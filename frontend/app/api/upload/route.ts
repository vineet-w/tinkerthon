import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;

    // Convert file to buffer for Supabase
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage 'uploads' bucket
    const { data: uploadData, error } = await supabase.storage
      .from("uploads")
      .upload(filename, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Storage upload failed" }, { status: 500 });
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filename);

    return NextResponse.json(
      {
        url: publicUrlData.publicUrl,
        filename: file.name,
        size: file.size,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "SYSTEM ERROR: Upload process failed" },
      { status: 500 }
    );
  }
}
