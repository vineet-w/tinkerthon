import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, buffer);

    return NextResponse.json(
      {
        url: `/uploads/${filename}`,
        filename: file.name,
        size: file.size,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Upload failed" },
      { status: 500 }
    );
  }
}
