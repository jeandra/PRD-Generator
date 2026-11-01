import { jsPDF } from "jspdf";
import type { ExportDocument } from "./markdown";

export function exportPdfFile(doc: ExportDocument) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  pdf.setFontSize(18);
  pdf.text(doc.title, margin, 30);

  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(
    `Dibuat: ${new Date(doc.createdAt).toLocaleDateString("id-ID")}`,
    margin,
    40
  );

  pdf.setTextColor(0);
  pdf.setFontSize(11);

  const lines = pdf.splitTextToSize(doc.content, maxWidth);
  let y = 50;

  for (const line of lines) {
    if (y > 280) {
      pdf.addPage();
      y = 20;
    }

    if (line.startsWith("# ") || line.startsWith("## ")) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      y += 4;
    } else {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
    }

    pdf.text(line, margin, y);
    y += 6;
  }

  pdf.save(`${doc.title}.pdf`);
}
