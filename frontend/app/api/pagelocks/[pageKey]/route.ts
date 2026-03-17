import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/storage";

interface PageLock {
  id: string;
  pageKey: string;
  locked: boolean;
  scheduledUnlock?: string;
  lockedAt: string;
  updatedAt: string;
  lockedBy: string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await params;
    const decodedKey = decodeURIComponent(pageKey);
    const locks = readData<PageLock>("pagelocks.json");
    const lock = locks.find((l) => l.pageKey === decodedKey);

    if (!lock) {
      // No lock entry means page is unlocked
      return NextResponse.json({ pageKey: decodedKey, locked: false });
    }

    // Auto-unlock if scheduled time has passed
    if (lock.locked && lock.scheduledUnlock) {
      const unlockTime = new Date(lock.scheduledUnlock);
      if (unlockTime <= new Date()) {
        lock.locked = false;
        lock.updatedAt = new Date().toISOString();
        writeData("pagelocks.json", locks);
      }
    }

    return NextResponse.json(lock);
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to retrieve page lock" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const { pageKey } = await params;
    const decodedKey = decodeURIComponent(pageKey);
    const body = await request.json();
    const locks = readData<PageLock>("pagelocks.json");
    const lock = locks.find((l) => l.pageKey === decodedKey);

    if (!lock) {
      return NextResponse.json({ error: "Lock not found" }, { status: 404 });
    }

    if (typeof body.locked === "boolean") lock.locked = body.locked;
    if (body.scheduledUnlock !== undefined) lock.scheduledUnlock = body.scheduledUnlock || undefined;
    lock.updatedAt = new Date().toISOString();

    writeData("pagelocks.json", locks);
    return NextResponse.json(lock);
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to update page lock" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const { pageKey } = await params;
    const decodedKey = decodeURIComponent(pageKey);
    let locks = readData<PageLock>("pagelocks.json");
    locks = locks.filter((l) => l.pageKey !== decodedKey);
    writeData("pagelocks.json", locks);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to delete page lock" },
      { status: 500 }
    );
  }
}
