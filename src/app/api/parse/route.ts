import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (fileName.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    } else if (fileName.endsWith(".tex")) {
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: `Unsupported file type: ${fileName}` },
        { status: 400 }
      );
    }

    const sections = extractSections(text);

    return NextResponse.json({
      text,
      sections,
      fileName: file.name,
      fileSize: file.size,
      isTeX: fileName.endsWith(".tex"),
    });
  } catch (err) {
    console.error("Parse error:", err);
    return NextResponse.json(
      { error: "Failed to parse document" },
      { status: 500 }
    );
  }
}

interface DocumentSections {
  title: string;
  abstract: string;
  body: string[];
  references: string;
}

function extractSections(text: string): DocumentSections {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const title = lines[0] || "Untitled";

  let abstract = "";
  let abstractStart = -1;
  let abstractEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if (
      abstractStart < 0 &&
      (lower === "abstract" || lower.startsWith("abstract:") || lower.startsWith("abstract "))
    ) {
      abstractStart = i + 1;
    }
    if (
      abstractStart > 0 &&
      abstractEnd < 0 &&
      i > abstractStart &&
      (lower === "introduction" ||
        lower.startsWith("1.") ||
        lower.startsWith("1 ") ||
        lower === "keywords" ||
        lower.startsWith("keywords:") ||
        lower.startsWith("index terms"))
    ) {
      abstractEnd = i;
    }
  }

  if (abstractStart > 0) {
    if (abstractEnd < 0) abstractEnd = Math.min(abstractStart + 15, lines.length);
    abstract = lines.slice(abstractStart, abstractEnd).join(" ");
  }

  const bodyStart = abstractEnd > 0 ? abstractEnd : 1;

  // Find the references section — search from the end
  let referencesStart = lines.length;
  for (let i = lines.length - 1; i >= bodyStart; i--) {
    const lower = lines[i].toLowerCase().trim();
    if (
      lower === "references" ||
      lower === "bibliography" ||
      lower === "works cited" ||
      lower.match(/^references\s*$/)
    ) {
      referencesStart = i;
      break;
    }
  }

  const bodyLines = lines.slice(bodyStart, referencesStart);
  const body = chunkByParagraphs(bodyLines);

  // Extract references as raw text, preserving each reference entry
  const references =
    referencesStart < lines.length
      ? lines.slice(referencesStart).join("\n")
      : "";

  return { title, abstract, body, references };
}

function chunkByParagraphs(lines: string[]): string[] {
  const chunks: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    current.push(line);
    if (current.join(" ").length > 2000) {
      chunks.push(current.join("\n"));
      current = [];
    }
  }
  if (current.length > 0) {
    chunks.push(current.join("\n"));
  }

  return chunks;
}
