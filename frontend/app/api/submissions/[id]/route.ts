import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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

    // First fetch the submission to get the file_name
    const { data: submission, error: fetchError } = await supabase
      .from("submissions")
      .select("file_name")
      .eq("id", id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // If there's an associated file, delete it from the storage bucket
    if (submission.file_name) {
      const { error: storageError } = await supabase.storage
        .from("uploads")
        .remove([submission.file_name]);
        
      if (storageError) {
        console.error("Failed to delete file from storage:", storageError);
        // Continue with deleting the DB row anyway
      }
    }

    // Delete the database row
    const { error: deleteError } = await supabase
      .from("submissions")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "DELETED" });
  } catch (err) {
    console.error("Submission DELETE error:", err);
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to delete submission" },
      { status: 500 }
    );
  }
}

