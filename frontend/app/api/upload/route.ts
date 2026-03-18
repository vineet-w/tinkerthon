import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use the credentials provided in .env.example/environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wdgwpsjtkdhvypfyzqfh.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ3dwc2p0a2RodnlwZnl6cWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Mzg0NDcsImV4cCI6MjA4OTMxNDQ0N30.7GlCkktC-GPxKnBOjJw_cIdkWpcUtsKIFEAQvg0Ck-Q";

const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Convert file to buffer
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
      return NextResponse.json({ 
        error: "Storage upload failed", 
        details: error.message 
      }, { status: 500 });
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
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "SYSTEM ERROR: Upload process failed", details: error.message },
      { status: 500 }
    );
  }
}
