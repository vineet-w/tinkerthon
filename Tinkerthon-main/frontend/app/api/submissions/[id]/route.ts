import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/storage";

interface Submission {
  id: string;
  name: string;
  email: string;
  teamName?: string;
  message: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
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
    const submissions = readData<Submission>("submissions.json");
    const filtered = submissions.filter((s) => s.id !== id);

    if (filtered.length === submissions.length) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    writeData("submissions.json", filtered);
    return NextResponse.json({ message: "DELETED" });
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to delete submission" },
      { status: 500 }
    );
  }
}
