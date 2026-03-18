import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/storage";

interface PageLock {
  id: string;
  pageKey: string;
  locked: boolean;
  scheduledUnlock?: string; // ISO datetime
  lockedAt: string;
  updatedAt: string;
  lockedBy: string;
}

// Auto-unlock pages whose scheduledUnlock time has passed
function processAutoUnlocks(locks: PageLock[]): PageLock[] {
  const now = new Date();
  let changed = false;
  for (const lock of locks) {
    if (lock.locked && lock.scheduledUnlock) {
      const unlockTime = new Date(lock.scheduledUnlock);
      if (unlockTime <= now) {
        lock.locked = false;
        lock.updatedAt = now.toISOString();
        changed = true;
      }
    }
  }
  if (changed) {
    writeData("pagelocks.json", locks);
  }
  return locks;
}

export async function GET() {
  try {
    const locks = readData<PageLock>("pagelocks.json");
    const processed = processAutoUnlocks(locks);
    return NextResponse.json(processed);
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to retrieve page locks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const body = await request.json();
    const { pageKey, locked, scheduledUnlock } = body;

    if (!pageKey || typeof locked !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: pageKey, locked" },
        { status: 400 }
      );
    }

    const locks = readData<PageLock>("pagelocks.json");
    const now = new Date().toISOString();

    // Check if a lock for this pageKey already exists
    const existing = locks.find((l) => l.pageKey === pageKey);
    if (existing) {
      existing.locked = locked;
      existing.scheduledUnlock = scheduledUnlock || undefined;
      existing.updatedAt = now;
    } else {
      locks.push({
        id: uuidv4(),
        pageKey,
        locked,
        scheduledUnlock: scheduledUnlock || undefined,
        lockedAt: now,
        updatedAt: now,
        lockedBy: "admin",
      });
    }

    writeData("pagelocks.json", locks);
    return NextResponse.json(
      existing || locks[locks.length - 1],
      { status: existing ? 200 : 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to update page lock" },
      { status: 500 }
    );
  }
}
