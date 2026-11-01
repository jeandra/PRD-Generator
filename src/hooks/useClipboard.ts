"use client";

import toast from "react-hot-toast";

async function writeToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function useClipboard() {
  const copy = async (text: string, successMessage = "Disalin ke clipboard") => {
    try {
      await writeToClipboard(text);
      toast.success(successMessage);
      return true;
    } catch {
      toast.error("Gagal menyalin");
      return false;
    }
  };

  return { copy };
}
