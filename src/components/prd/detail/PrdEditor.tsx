"use client";

type PrdEditorProps = {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
};

export default function PrdEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
}: PrdEditorProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-bold text-[#31224d]">
          Judul Dokumen PRD
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          className="clay-pill-input w-full px-4 py-3 text-base font-bold"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-[#31224d]">
          Konten Dokumen (Markdown Format)
        </label>
        <textarea
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          className="clay-pill-input w-full p-4 font-mono text-xs leading-relaxed"
          style={{ minHeight: "65vh" }}
        />
      </div>
    </div>
  );
}
