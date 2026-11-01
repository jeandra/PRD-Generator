import { renderMarkdown } from "@/lib/markdown";

export default function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return <div className={className}>{renderMarkdown(content)}</div>;
}
