import { saveAs } from "file-saver";

export type ExportDocument = {
  title: string;
  content: string;
  createdAt: string;
};

export function exportMarkdownFile(doc: ExportDocument) {
  const blob = new Blob([doc.content], {
    type: "text/markdown;charset=utf-8",
  });
  saveAs(blob, `${doc.title}.md`);
}
