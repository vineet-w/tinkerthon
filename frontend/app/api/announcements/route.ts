import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/storage";

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  try {
    const announcements = readData<Announcement>("announcements.json");
    // Sort by createdAt descending
    announcements.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to retrieve announcements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "ACCESS DENIED" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, date, imageUrl } = body;

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, date" },
        { status: 400 }
      );
    }

    const announcements = readData<Announcement>("announcements.json");
    const now = new Date().toISOString();

    const newAnnouncement: Announcement = {
      id: uuidv4(),
      title,
      description,
      date,
      imageUrl: imageUrl || undefined,
      createdAt: now,
      updatedAt: now,
    };

    announcements.push(newAnnouncement);
    writeData("announcements.json", announcements);

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to create announcement" },
      { status: 500 }
    );
  }
}
