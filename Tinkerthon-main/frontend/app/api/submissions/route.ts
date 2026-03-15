import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
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

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const submissions = readData<Submission>("submissions.json");
    submissions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to retrieve submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, teamName, message, fileUrl, fileName } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    const submissions = readData<Submission>("submissions.json");
    const now = new Date().toISOString();

    const newSubmission: Submission = {
      id: uuidv4(),
      name,
      email,
      teamName: teamName || undefined,
      message,
      fileUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      createdAt: now,
    };

    submissions.push(newSubmission);
    writeData("submissions.json", submissions);

    return NextResponse.json(
      { message: "TRANSMISSION RECEIVED", id: newSubmission.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to process submission" },
      { status: 500 }
    );
  }
}
