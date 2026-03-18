import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map snake_case to camelCase for the frontend
    const mapped = submissions.map(s => ({
      id: s.id,
      teamLeaderName: s.team_leader_name,
      teamName: s.team_name,
      githubLink: s.github_link,
      videoLink: s.video_link,
      fileUrl: s.file_url,
      fileName: s.file_name,
      createdAt: s.created_at,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Submissions GET error:", err);
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to retrieve submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamLeaderName, teamName, githubLink, videoLink, fileUrl, fileName } = body;

    if (!teamLeaderName || !teamName) {
      return NextResponse.json(
        { error: "Missing required fields: teamLeaderName, teamName" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert([
        {
          team_leader_name: teamLeaderName,
          team_name: teamName,
          github_link: githubLink || null,
          video_link: videoLink || null,
          file_url: fileUrl || null,
          file_name: fileName || null,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "TRANSMISSION RECEIVED", id: data.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Submissions POST error:", err);
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to process submission" },
      { status: 500 }
    );
  }
}

