"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MorpheusSilhouetteProps {
  themeColor: string;
}

export default function MorpheusSilhouette({ themeColor }: MorpheusSilhouetteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const silhouetteRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create a simple silhouette geometry (simplified human form)
    const createSilhouette = () => {
      const group = new THREE.Group();
      
      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(themeColor),
          transparent: true,
          opacity: 0.9
        })
      );
      head.position.y = 1.8;
      group.add(head);

      // Body
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.6, 2, 32),
        new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(themeColor),
          transparent: true,
          opacity: 0.8
        })
      );
      body.position.y = 0.5;
      group.add(body);

      // Arms
      const leftArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16),
        new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(themeColor),
          transparent: true,
          opacity: 0.7
        })
      );
      leftArm.position.set(-0.8, 1.2, 0);
      leftArm.rotation.z = Math.PI / 4;
      group.add(leftArm);

      const rightArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16),
        new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(themeColor),
          transparent: true,
          opacity: 0.7
        })
      );
      rightArm.position.set(0.8, 1.2, 0);
      rightArm.rotation.z = -Math.PI / 4;
      group.add(rightArm);

      // Legs
      const leftLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 2, 16),
        new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(themeColor),
          transparent: true,
          opacity: 0.7
        })
      );
      leftLeg.position.set(-0.3, -0.8, 0);
      group.add(leftLeg);

      const rightLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 2, 16),
        new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(themeColor),
          transparent: true,
          opacity: 0.7
        })
      );
      rightLeg.position.set(0.3, -0.8, 0);
      group.add(rightLeg);

      return group;
    };

    const silhouette = createSilhouette();
    scene.add(silhouette);
    silhouetteRef.current = silhouette;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Add directional light for highlights
    const directionalLight = new THREE.DirectionalLight(new THREE.Color(themeColor), 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add backlight for silhouette effect
    const backLight = new THREE.DirectionalLight(new THREE.Color(themeColor), 0.5);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (silhouetteRef.current) {
        silhouetteRef.current.rotation.y += 0.005;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [themeColor]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
    />
  );
}