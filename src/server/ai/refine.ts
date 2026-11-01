import "server-only";
import { generateText } from "./gemini";

export async function refineSectionContent(input: {
  prdTitle: string;
  sectionText: string;
  instruction: string;
}) {
  const prompt = `Kamu adalah seorang Product Manager profesional.
Tugasmu adalah memperbaiki atau menulis ulang SATU section dokumen PRD sesuai instruksi.

Dokumen: ${input.prdTitle}
Section yang diperbaiki:
"""
${input.sectionText}
"""

Instruksi perbaikan dari pengguna:
"${input.instruction}"

ATURAN PENTING:
- Keluarkan HANYA teks section tersebut (dimulai dari judul ## yang sama).
- Jangan berikan kata pengantar, salam, atau teks di luar section.
- Gunakan bahasa Indonesia yang profesional, jelas, dan terstruktur (markdown).`;

  return (await generateText(prompt)).trim();
}
