import { NextRequest, NextResponse } from "next/server";
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "ACCESS DENIED" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, pdfUrl, tableData } = body;

    const results = readData<ResultEntry>("results.json");
    const index = results.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    results[index] = {
      ...results[index],
      title: title || results[index].title,
      description: description || results[index].description,
      pdfUrl: pdfUrl !== undefined ? pdfUrl : results[index].pdfUrl,
      tableData: tableData !== undefined ? tableData : results[index].tableData,
      updatedAt: new Date().toISOString(),
    };

    writeData("results.json", results);
    return NextResponse.json(results[index]);
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to update result" },
      { status: 500 }
    );
  }
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
    const results = readData<ResultEntry>("results.json");
    const filtered = results.filter((r) => r.id !== id);

    if (filtered.length === results.length) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    writeData("results.json", filtered);
    return NextResponse.json({ message: "DELETED" });
  } catch {
    return NextResponse.json(
      { error: "SYSTEM ERROR: Failed to delete result" },
      { status: 500 }
    );
  }
}
