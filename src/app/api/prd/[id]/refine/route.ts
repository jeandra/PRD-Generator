import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MODEL_CANDIDATES = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;
    const body = await req.json();
    const { sectionTitle, instruction } = body;

    if (!sectionTitle || typeof sectionTitle !== "string") {
      return NextResponse.json(
        { error: "Nama section wajib diisi" },
        { status: 400 }
      );
    }

    if (!instruction || typeof instruction !== "string") {
      return NextResponse.json(
        { error: "Instruksi perbaikan wajib diisi" },
        { status: 400 }
      );
    }

    const prd = await prisma.prd.findFirst({
      where: { id, userId },
    });

    if (!prd) {
      return NextResponse.json({ error: "PRD tidak ditemukan" }, { status: 404 });
    }

    const lines = prd.content.split("\n");
    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("## ") && line.toLowerCase().includes(sectionTitle.toLowerCase())) {
        startIndex = i;
        break;
      }
    }

    if (startIndex === -1) {
      return NextResponse.json(
        { error: `Section "${sectionTitle}" tidak ditemukan dalam dokumen` },
        { status: 400 }
      );
    }

    for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].trim().startsWith("## ")) {
        endIndex = i;
        break;
      }
    }

    if (endIndex === -1) {
      endIndex = lines.length;
    }

    const currentSectionText = lines.slice(startIndex, endIndex).join("\n");

    const prompt = `Kamu adalah seorang Product Manager profesional.
Tugasmu adalah memperbaiki atau menulis ulang SATU section dokumen PRD sesuai instruksi.

Dokumen: ${prd.title}
Section yang diperbaiki:
"""
${currentSectionText}
"""

Instruksi perbaikan dari pengguna:
"${instruction.trim()}"

ATURAN PENTING:
- Keluarkan HANYA teks section tersebut (dimulai dari judul ## yang sama).
- Jangan berikan kata pengantar, salam, atau teks di luar section.
- Gunakan bahasa Indonesia yang profesional, jelas, dan terstruktur (markdown).`;

    let newSectionText = "";
    let lastError: unknown;

    for (const model of MODEL_CANDIDATES) {
      try {
        const result = await genAI
          .getGenerativeModel({ model })
          .generateContent(prompt);
        newSectionText = result.response.text().trim();
        if (newSectionText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!newSectionText) {
      throw lastError || new Error("Gagal mendapatkan respons AI");
    }

    const beforeLines = lines.slice(0, startIndex);
    const afterLines = lines.slice(endIndex);
    const newContent = [...beforeLines, newSectionText, ...afterLines].join("\n");

    // Simpan snapshot versi sebelum memperbarui
    await prisma.prdVersion.create({
      data: {
        prdId: id,
        content: prd.content,
      },
    });

    const updated = await prisma.prd.update({
      where: { id },
      data: { content: newContent },
    });

    return NextResponse.json({
      prd: updated,
      message: `Section "${sectionTitle}" berhasil diperbarui`,
    });
  } catch (error) {
    console.error("Refine section error:", error);
    const detail =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? `: ${error.message}`
        : "";
    return NextResponse.json(
      { error: `Gagal memperbaiki section dengan AI${detail}` },
      { status: 500 }
    );
  }
}
