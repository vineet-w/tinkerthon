import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/storage";
import { v4 as uuid } from "uuid";

const FILE = "problemstatements";

export async function GET() {
  const data = await readData(FILE);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { domain, track, title, description, published } = body;

  if (!domain || !track || !title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const data = await readData(FILE);
  const entry = {
    id: uuid(),
    domain,
    track,
    title,
    description,
    published: published ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.push(entry);
  await writeData(FILE, data);
  return NextResponse.json(entry, { status: 201 });
}
