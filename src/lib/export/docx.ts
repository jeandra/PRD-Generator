import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import type { ExportDocument } from "./markdown";

export async function exportDocxFile(doc: ExportDocument) {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: doc.title, bold: true, size: 36 })],
      heading: HeadingLevel.TITLE,
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Dibuat: ${new Date(doc.createdAt).toLocaleDateString("id-ID")}`,
          size: 20,
          color: "666666",
        }),
      ],
    })
  );

  children.push(new Paragraph({ text: "" }));

  for (const line of doc.content.split("\n")) {
    if (line.startsWith("# ")) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: line.replace("# ", ""), bold: true, size: 32 }),
          ],
          heading: HeadingLevel.HEADING_1,
        })
      );
    } else if (line.startsWith("## ")) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.replace("## ", ""),
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
        })
      );
    } else if (line.startsWith("### ")) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.replace("### ", ""),
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_3,
        })
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line.slice(2), size: 22 })],
          bullet: { level: 0 },
        })
      );
    } else if (line.trim() === "") {
      children.push(new Paragraph({ text: "" }));
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
        })
      );
    }
  }

  const document = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(document);
  saveAs(blob, `${doc.title}.docx`);
}
