import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/storage";

interface ProblemStatement {
  id: string;
  [key: string]: unknown;
}

const FILE = "problemstatements";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const data = (await readData(FILE)) as ProblemStatement[];
  const idx = data.findIndex((r) => r.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  data[idx] = { ...data[idx], ...body, updatedAt: new Date().toISOString() };
  await writeData(FILE, data);
  return NextResponse.json(data[idx]);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = (await readData(FILE)) as ProblemStatement[];
  const filtered = data.filter((r) => r.id !== id);
  await writeData(FILE, filtered);
  return NextResponse.json({ success: true });
}
