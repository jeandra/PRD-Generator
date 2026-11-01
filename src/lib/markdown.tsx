import React from "react";

export function renderInline(text: string) {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key++}>{token.slice(1, -1)}</code>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

const splitTableRow = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

const isTableSeparator = (line: string) =>
  /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes("-");

const isTableStart = (lines: string[], index: number) =>
  index + 1 < lines.length &&
  lines[index].trim().startsWith("|") &&
  lines[index + 1].trim().startsWith("|") &&
  isTableSeparator(lines[index + 1]);

export function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isTableStart(lines, i)) {
      const header = splitTableRow(line);
      const rows: string[][] = [];
      let j = i + 2;

      while (j < lines.length && lines[j].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[j]));
        j++;
      }

      nodes.push(
        <div key={key++} className="my-4 overflow-x-auto">
          <table>
            <thead>
              <tr>
                {header.map((cell, cellIndex) => (
                  <th key={cellIndex}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {header.map((_, cellIndex) => (
                    <td key={cellIndex}>
                      {renderInline(row[cellIndex] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      i = j;
      continue;
    }

    if (line.startsWith("#### ")) {
      nodes.push(<h4 key={key++}>{renderInline(line.slice(5))}</h4>);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(<h3 key={key++}>{renderInline(line.slice(4))}</h3>);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(<h2 key={key++}>{renderInline(line.slice(3))}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      nodes.push(<h1 key={key++}>{renderInline(line.slice(2))}</h1>);
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      nodes.push(
        <ul key={key++}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      nodes.push(
        <ol key={key++}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      nodes.push(
        <blockquote key={key++}>
          {renderInline(line.replace(/^>\s?/, ""))}
        </blockquote>
      );
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      nodes.push(<hr key={key++} />);
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    nodes.push(<p key={key++}>{renderInline(line)}</p>);
    i++;
  }

  return nodes;
}
