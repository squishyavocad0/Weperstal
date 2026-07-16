"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/* ────────────────────────────────────────────────────────────────────────
   Foto-upload voor het beheer. Uploadt naar de publieke 'media'-bucket
   in Supabase Storage en geeft de publieke links terug, zodat Maria
   foto's van haar eigen computer of telefoon kan gebruiken zonder
   ergens anders links te hoeven regelen.
   ──────────────────────────────────────────────────────────────────────── */

/* Grote foto's (telefoons maken al snel 5–10 MB) worden vóór het
   uploaden stilletjes verkleind naar webformaat: sneller voor
   bezoekers en zuiniger met opslagruimte. Lukt verkleinen niet
   (bijv. een formaat dat de browser niet kan lezen), dan uploaden
   we gewoon het origineel. */
const MAX_EDGE = 1800;
const SKIP_BELOW_BYTES = 500 * 1024;

async function shrinkImage(file: File): Promise<File | Blob> {
  if (file.type === "image/gif" || file.size < SKIP_BELOW_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export default function ImageUpload({
  multiple = false,
  onUploaded,
}: {
  multiple?: boolean;
  onUploaded: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const prepared = await shrinkImage(file);
      const converted = prepared !== file;
      let safeName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(-80);
      if (converted) safeName = safeName.replace(/\.[a-z0-9]+$/, "") + ".jpg";
      const path = `${new Date().toISOString().slice(0, 10)}/${crypto
        .randomUUID()
        .slice(0, 8)}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, prepared, {
          cacheControl: "31536000",
          contentType: converted ? "image/jpeg" : file.type,
        });
      if (uploadError) {
        setError(
          uploadError.message.toLowerCase().includes("bucket not found")
            ? "De fotomap bestaat nog niet in Supabase. Voer supabase/storage.sql één keer uit in de SQL Editor."
            : `Uploaden mislukt: ${uploadError.message}`
        );
        setBusy(false);
        return;
      }
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    onUploaded(urls);
  };

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => upload(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-full border border-sage-light px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-sage-whisper disabled:opacity-60"
      >
        {busy ? "Uploaden…" : multiple ? "📷 Foto's uploaden" : "📷 Foto uploaden"}
      </button>
      {error && <p className="mt-1.5 text-xs text-bark-deep">{error}</p>}
    </div>
  );
}
