import { NextRequest, NextResponse } from "next/server";
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, date, imageUrl } = body;

    const announcements = readData<Announcement>("announcements.json");
    const index = announcements.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    announcements[index] = {
      ...announcements[index],
      title: title || announcements[index].title,
      description: description || announcements[index].description,
      date: date || announcements[index].date,
      imageUrl: imageUrl !== undefined ? imageUrl : announcements[index].imageUrl,
      updatedAt: new Date().toISOString(),
    };

    writeData("announcements.json", announcements);
    return NextResponse.json(announcements[index]);
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const { id } = await params;
    const announcements = readData<Announcement>("announcements.json");
    const filtered = announcements.filter((a) => a.id !== id);

    if (filtered.length === announcements.length) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    writeData("announcements.json", filtered);
    return NextResponse.json({ message: "DELETED" });
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to delete announcement" },
      { status: 500 }
    );
  }
}
