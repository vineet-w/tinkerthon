"use client"

import { useRef, useMemo, useEffect, useState, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/* ═══════════════════════════════════════════════════════
   SINGLE LEG — short appendage under a body segment
   ═══════════════════════════════════════════════════════ */
function Leg({
  parentPos,
  side,
  index,
  phase,
}: {
  parentPos: THREE.Vector3
  side: "left" | "right"
  index: number
  phase: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  const offset = index * 2.3

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    const sideSign = side === "left" ? -1 : 1

    const walkCycle = Math.sin(t * 5 + offset) * 0.3
    const spasm = phase === "zapped" ? Math.sin(t * 40 + offset) * 0.5 : 0

    ref.current.position.set(
      parentPos.x + sideSign * 0.2,
      parentPos.y - 0.15 + walkCycle * 0.05,
      parentPos.z
    )
    ref.current.rotation.z = sideSign * (0.6 + walkCycle * 0.3 + spasm)
    ref.current.rotation.x = walkCycle * 0.2
  })

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.02, 0.012, 0.25, 6]} />
      <meshStandardMaterial
        color="#2a2a2a"
        metalness={0.85}
        roughness={0.25}
        emissive="#00ff41"
        emissiveIntensity={0.08}
      />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════════════
   FRONT TENTACLES — longer feelers on the head
   ═══════════════════════════════════════════════════════ */
function FrontTentacle({
  headPos,
  side,
  phase,
}: {
  headPos: THREE.Vector3
  side: "left" | "right"
  phase: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const sideSign = side === "left" ? -1 : 1

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    const spasm = phase === "zapped" ? Math.sin(t * 35) * 0.4 : 0

    const segments = 12
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      const frac = i / segments
      const reach = frac * 0.6
      points.push(new THREE.Vector3(
        headPos.x + sideSign * (0.15 + frac * 0.25) + Math.sin(t * 2.5 + frac * 3) * 0.08 * frac + spasm * frac,
        headPos.y - frac * 0.35 + Math.sin(t * 3 + frac * 4) * 0.06 * frac,
        headPos.z + reach * 0.3
      ))
    }

    const curve = new THREE.CatmullRomCurve3(points)
    const newGeo = new THREE.TubeGeometry(curve, 10, 0.018, 5, false)
    meshRef.current.geometry.dispose()
    meshRef.current.geometry = newGeo
  })

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[
        new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, -0.3, 0.2)]),
        10, 0.018, 5, false
      ]} />
      <meshStandardMaterial
        color="#2a2a2a"
        metalness={0.85}
        roughness={0.25}
        emissive="#00ff41"
        emissiveIntensity={0.12}
      />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════════════
   SENTINEL BODY — segmented caterpillar/centipede
   ═══════════════════════════════════════════════════════ */
function SentinelBody({ phase }: { phase: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const segmentRefs = useRef<(THREE.Mesh | null)[]>([])
  const eyeRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([])

  const segmentCount = 10
  const segments = useMemo(() => {
    return Array.from({ length: segmentCount }, (_, i) => {
      const frac = i / (segmentCount - 1)
      const radius = 0.28 - frac * 0.18
      return { radius, index: i }
    })
  }, [])

  const segPositions = useRef<THREE.Vector3[]>(
    Array.from({ length: segmentCount }, () => new THREE.Vector3())
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const spasm = phase === "zapped" ? Math.sin(t * 35) * 0.15 : 0
    const hitRecoil = phase === "hit" ? Math.sin(t * 25) * 0.2 : 0

    segmentRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const frac = i / (segmentCount - 1)

      const waveX = Math.sin(t * 2.0 + i * 0.6) * 0.06 * (1 + frac)
      const waveY = Math.sin(t * 1.5 + i * 0.8) * 0.04

      const spacing = 0.22 + frac * 0.04
      const baseX = i * spacing
      const curveZ = Math.sin(i * 0.4) * 0.08

      mesh.position.set(
        baseX + waveX + spasm + hitRecoil,
        waveY + spasm * Math.sin(t * 40 + i) + hitRecoil * Math.sin(i),
        curveZ
      )

      segPositions.current[i].copy(mesh.position)
    })

    const eyeBright = phase === "pillHover"
      ? 3.0 + Math.sin(t * 5) * 0.8
      : phase === "zapped"
        ? 6 * Math.abs(Math.sin(t * 30))
        : phase === "hit"
          ? 4 * Math.abs(Math.sin(t * 20))
          : 1.5 + Math.sin(t * 2.5) * 0.5

    eyeRefs.current.forEach((mat) => {
      if (mat) mat.emissiveIntensity = eyeBright
    })
  })

  return (
    <group ref={groupRef}>
      {segments.map(({ radius, index: i }) => {
        const frac = i / (segmentCount - 1)
        return (
          <group key={i}>
            <mesh ref={(el) => { segmentRefs.current[i] = el }}>
              <sphereGeometry args={[radius, 16, 12]} />
              <meshStandardMaterial
                color={i === 0 ? "#383838" : "#2e2e2e"}
                metalness={0.88}
                roughness={0.22}
                emissive="#00ff41"
                emissiveIntensity={0.04 + (1 - frac) * 0.03}
              />
            </mesh>

            {i > 0 && (
              <mesh position={[i * 0.24, 0, 0]}>
                <torusGeometry args={[radius * 0.85, 0.012, 6, 16]} />
                <meshStandardMaterial
                  color="#1a1a1a"
                  metalness={0.9}
                  roughness={0.3}
                  emissive="#00ff41"
                  emissiveIntensity={0.02}
                />
              </mesh>
            )}
          </group>
        )
      })}

      {[
        [-0.1, 0.12, 0.2],
        [0.1, 0.12, 0.2],
        [-0.06, 0.06, 0.24],
        [0.06, 0.06, 0.24],
      ].map((pos, i) => (
        <mesh key={`eye-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[i < 2 ? 0.045 : 0.035, 12, 12]} />
          <meshStandardMaterial
            ref={(el) => { eyeRefs.current[i] = el }}
            color="#ff2020"
            emissive="#ff2020"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}

      <pointLight position={[0.5, -0.4, 0]} color="#00ff41" intensity={0.5} distance={2.5} />

      {Array.from({ length: 7 }, (_, i) => (
        <group key={`legs-${i}`}>
          <Leg parentPos={segPositions.current[i + 1] || new THREE.Vector3()} side="left" index={i} phase={phase} />
          <Leg parentPos={segPositions.current[i + 1] || new THREE.Vector3()} side="right" index={i} phase={phase} />
        </group>
      ))}

      <FrontTentacle headPos={segPositions.current[0] || new THREE.Vector3()} side="left" phase={phase} />
      <FrontTentacle headPos={segPositions.current[0] || new THREE.Vector3()} side="right" phase={phase} />
    </group>
  )
}

/* ═══════════════════════════════════════════════════════
   PARASITE CONTROLLER — movement + lifecycle
   Now supports being "hit" by clicks near it
   ═══════════════════════════════════════════════════════ */
function ParasiteController({
  hitCount,
  maxHits,
  onDead,
}: {
  hitCount: number
  maxHits: number
  onDead: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  const [phase, setPhase] = useState<"entry" | "idle" | "attacking" | "hit" | "zapped" | "dead">("entry")
  const [visible, setVisible] = useState(true)

  const homePos = useRef(new THREE.Vector3(0, 1.5, 0))
  const currentPos = useRef(new THREE.Vector3(0, 8, 0))
  const targetPos = useRef(new THREE.Vector3(0, 8, 0))

  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))

  const lastAttackTime = useRef(0)
  const nextAttackDelay = useRef(1.5 + Math.random() * 1.5)
  const isAttacking = useRef(false)
  const isSpinning = useRef(false)
  const spinStartTime = useRef(0)
  const entryStarted = useRef(false)
  const prevHitCount = useRef(0)
  const hitRecoverTime = useRef(0)

  // Expose position for click detection
  useEffect(() => {
    // Store parasite screen position for click checks
    (window as any).__parasitePos = currentPos.current
  })

  // Mouse tracking
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      mouseWorld.current.set(
        x * viewport.width * 0.5,
        y * viewport.height * 0.5,
        0
      )
    }
    window.addEventListener("pointermove", handler as EventListener)
    return () => window.removeEventListener("pointermove", handler as EventListener)
  }, [viewport])

  // React to hits
  useEffect(() => {
    if (hitCount > prevHitCount.current && phase !== "dead" && phase !== "zapped") {
      prevHitCount.current = hitCount

      if (hitCount >= maxHits) {
        // Dead!
        setPhase("zapped")
        setTimeout(() => {
          setPhase("dead")
          setVisible(false)
          onDead()
        }, 1200)
      } else {
        // Hit recoil — briefly stagger, then resume
        setPhase("hit")
        hitRecoverTime.current = performance.now() + 600
      }
    }
  }, [hitCount, maxHits, phase, onDead])

  const prevPos = useRef(new THREE.Vector3(0, 8, 0))
  const velocity = useRef(new THREE.Vector3(0, 0, 0)) // smooth velocity

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return
    const t = clock.elapsedTime
    const dt = clock.getDelta() || 0.016

    prevPos.current.copy(currentPos.current)

    // ── HIT RECOIL — stagger backward ──
    if (phase === "hit") {
      // Jolt away from cursor
      const away = currentPos.current.clone().sub(mouseWorld.current).normalize().multiplyScalar(0.08)
      currentPos.current.add(away)

      if (performance.now() > hitRecoverTime.current) {
        setPhase("idle")
        lastAttackTime.current = t
      }
    }

    // ── ENTRY ──
    if (phase === "entry") {
      if (!entryStarted.current) {
        entryStarted.current = true
        currentPos.current.set(0, viewport.height * 0.7, 0)
        targetPos.current.copy(homePos.current)
      }
      currentPos.current.lerp(targetPos.current, 0.04)
      if (currentPos.current.distanceTo(homePos.current) < 0.1) {
        setPhase("idle")
        lastAttackTime.current = t
      }
    }

    // ── IDLE + ATTACKING ──
    if (phase === "idle" || phase === "attacking") {
      if (!isAttacking.current && t - lastAttackTime.current > nextAttackDelay.current) {
        isAttacking.current = true

        if (Math.random() < 0.15) {
          isSpinning.current = true
          spinStartTime.current = t
        } else {
          targetPos.current.copy(mouseWorld.current)
          setPhase("attacking")
        }
      }

      if (isAttacking.current && !isSpinning.current) {
        // Smooth accelerating lunge — velocity lerps toward target delta
        const desired = targetPos.current.clone().sub(currentPos.current)
        velocity.current.lerp(desired.multiplyScalar(0.18), 0.25)
        currentPos.current.add(velocity.current)
        if (currentPos.current.distanceTo(targetPos.current) < 0.35) {
          isAttacking.current = false
          targetPos.current.copy(homePos.current)
          lastAttackTime.current = t
          nextAttackDelay.current = 1.5 + Math.random() * 1.5
          setPhase("idle")
        }
      } else if (isSpinning.current) {
        const spinProgress = (t - spinStartTime.current) / 0.8
        if (spinProgress >= 1) {
          isSpinning.current = false
          isAttacking.current = false
          lastAttackTime.current = t
          nextAttackDelay.current = 1.5 + Math.random() * 1.5
        }
      }

      if (!isAttacking.current) {
        // Slow drift back — damp velocity then inch home
        velocity.current.multiplyScalar(0.85)
        const homeDir = homePos.current.clone().sub(currentPos.current)
        velocity.current.lerp(homeDir.multiplyScalar(0.012), 0.05)
        currentPos.current.add(velocity.current)
        currentPos.current.y += Math.sin(t * 1.2) * 0.003
      }
    }

    // ── ZAPPED ──
    if (phase === "zapped") {
      const scale = Math.max(0, groupRef.current.scale.x - dt * 0.8)
      groupRef.current.scale.set(scale, scale, scale)
      currentPos.current.x += Math.sin(t * 50) * 0.05
      currentPos.current.y += Math.sin(t * 47) * 0.05
    }

    // Apply position
    groupRef.current.position.copy(currentPos.current)

    // Face movement direction
    const vel = currentPos.current.clone().sub(prevPos.current)
    if (vel.length() > 0.001) {
      const targetAngle = Math.atan2(vel.y, vel.x)
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetAngle - Math.PI,
        0.08
      )
    }

    if (isSpinning.current) {
      const spinFrac = (t - spinStartTime.current) / 0.8
      groupRef.current.rotation.z = spinFrac * Math.PI * 2
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
      <SentinelBody phase={phase} />
    </group>
  )
}

/* ═══════════════════════════════════════════════════════
   ORBITING GREEN LIGHT
   ═══════════════════════════════════════════════════════ */
function OrbitingLight() {
  const ref = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.set(
      Math.cos(t * 0.5) * 3,
      Math.sin(t * 0.3) * 1.5,
      Math.sin(t * 0.5) * 3
    )
  })

  return <pointLight ref={ref} color="#00ff41" intensity={0.8} distance={8} />
}

/* ═══════════════════════════════════════════════════════
   SCENE
   ═══════════════════════════════════════════════════════ */
function ParasiteScene({
  hitCount,
  maxHits,
  onDead,
}: {
  hitCount: number
  maxHits: number
  onDead: () => void
}) {
  return (
    <>
      <ambientLight color="#0a0a0a" intensity={0.4} />
      <pointLight position={[0, -4, 2]} color="#00ff41" intensity={0.5} distance={10} />
      <directionalLight position={[2, 3, 4]} color="#00ff41" intensity={0.3} />
      <OrbitingLight />
      <ParasiteController hitCount={hitCount} maxHits={maxHits} onDead={onDead} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   EXPORTED CANVAS WRAPPER
   ═══════════════════════════════════════════════════════ */
export default function MatrixParasite({
  hitCount,
  maxHits,
  onDead,
  onScreenClick,
}: {
  hitCount: number
  maxHits: number
  onDead: () => void
  onScreenClick: (mouseX: number, mouseY: number) => void
}) {
  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 35, cursor: "crosshair", touchAction: "none" }}
      onClick={(e) => onScreenClick(e.clientX, e.clientY)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <ParasiteScene hitCount={hitCount} maxHits={maxHits} onDead={onDead} />
      </Canvas>
    </div>
  )
}
