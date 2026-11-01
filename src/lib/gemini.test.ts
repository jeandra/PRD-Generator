import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { buildPrompt } from "./gemini.ts";

describe("buildPrompt", () => {
  test("memuat PRD dengan technical plan dan implementation tasks", () => {
    const prompt = buildPrompt({
      title: "Catatanku",
      description: "Aplikasi catatan",
      targetUser: "Mahasiswa",
      problem: "Catatan berantakan",
      features: "- Catat\n- Cari",
    });

    assert.ok(prompt.includes("# PRD: Catatanku"));
    assert.ok(prompt.includes("## 13. Technical Plan"));
    assert.ok(prompt.includes("## 14. Implementation Tasks"));
    assert.ok(prompt.includes("- [ ]"));
  });

  test("memuat judul user", () => {
    const prompt = buildPrompt({
      title: "X",
      description: "Y",
      targetUser: "Z",
      problem: "W",
      features: "V",
    });

    assert.ok(prompt.includes("# PRD: X"));
  });
});
