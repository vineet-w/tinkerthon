import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth";
import { readData, writeData } from "@/lib/storage";

interface ResultEntry {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string;
  tableData?: { headers: string[]; rows: string[][] };
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  try {
    const results = readData<ResultEntry>("results.json");
    results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to retrieve results" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, pdfUrl, tableData } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields: title, description" },
        { status: 400 }
      );
    }

    const results = readData<ResultEntry>("results.json");
    const now = new Date().toISOString();

    const newResult: ResultEntry = {
      id: uuidv4(),
      title,
      description,
      pdfUrl: pdfUrl || undefined,
      tableData: tableData || undefined,
      createdAt: now,
      updatedAt: now,
    };

    results.push(newResult);
    writeData("results.json", results);

    return NextResponse.json(newResult, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to create result" },
      { status: 500 }
    );
  }
}
