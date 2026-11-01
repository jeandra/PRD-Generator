import "server-only";
import { refineSectionContent } from "@/server/ai/refine";
import { ApiError } from "@/server/http";
import type { PrdDetail } from "@/types/prd";
import { findOwnedPrd, updatePrdContent } from "./prd";
import { createPrdVersion } from "./versions";

function findSectionRange(lines: string[], sectionTitle: string) {
  let startIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith("## ") &&
      line.toLowerCase().includes(sectionTitle.toLowerCase())
    ) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) return null;

  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith("## ")) {
      endIndex = i;
      break;
    }
  }

  return { startIndex, endIndex };
}

export async function refinePrdSection(
  userId: string,
  prdId: string,
  input: { sectionTitle: string; instruction: string }
): Promise<{ prd: PrdDetail; message: string }> {
  const prd = await findOwnedPrd(userId, prdId);
  const lines = prd.content.split("\n");
  const range = findSectionRange(lines, input.sectionTitle);

  if (!range) {
    throw new ApiError(
      400,
      `Section "${input.sectionTitle}" tidak ditemukan dalam dokumen`
    );
  }

  const currentSectionText = lines
    .slice(range.startIndex, range.endIndex)
    .join("\n");

  const newSectionText = await refineSectionContent({
    prdTitle: prd.title,
    sectionText: currentSectionText,
    instruction: input.instruction,
  });

  if (!newSectionText) {
    throw new ApiError(502, "Gagal mendapatkan respons AI");
  }

  const newContent = [
    ...lines.slice(0, range.startIndex),
    newSectionText,
    ...lines.slice(range.endIndex),
  ].join("\n");

  await createPrdVersion(prdId, prd.content);
  const updated = await updatePrdContent(prdId, newContent);

  return {
    prd: updated,
    message: `Section "${input.sectionTitle}" berhasil diperbarui`,
  };
}
