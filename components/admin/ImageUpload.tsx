"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CropDialog from "@/components/admin/CropDialog";

/* ────────────────────────────────────────────────────────────────────────
   Foto-upload voor het beheer. Elke gekozen foto gaat eerst door het
   bijsnijvenster (met het juiste kader voor de plek op de site) en
   wordt daarna geüpload naar de publieke 'media'-bucket in Supabase
   Storage. De publieke links komen terug via onUploaded.
   ──────────────────────────────────────────────────────────────────────── */

const MAX_EDGE = 1800;
const SKIP_BELOW_BYTES = 500 * 1024;

/* Grote foto's (telefoons maken al snel 5–10 MB) worden vóór het
   uploaden verkleind naar webformaat. Lukt dat niet (bijv. een formaat
   dat de browser niet kan lezen), dan uploaden we het origineel. */
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

interface ReadyUpload {
  data: File | Blob;
  origName: string;
}

export default function ImageUpload({
  multiple = false,
  aspect = 4 / 3,
  onUploaded,
}: {
  multiple?: boolean;
  /* Verhouding van het bijsnijkader; gelijk aan hoe de foto op de
     site wordt getoond (standaard 4:3, verhaalomslag 16:9). */
  aspect?: number;
  onUploaded: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* Nog bij te snijden foto's; de eerste staat in het venster. */
  const [queue, setQueue] = useState<File[]>([]);
  const [ready, setReady] = useState<ReadyUpload[]>([]);
  const [total, setTotal] = useState(0);

  const startCropping = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setReady([]);
    setTotal(files.length);
    setQueue(Array.from(files));
    if (inputRef.current) inputRef.current.value = "";
  };

  /* Volgende foto uit de wachtrij, of uploaden als alles klaar is. */
  const advance = (finished: ReadyUpload | null) => {
    const nextReady = finished ? [...ready, finished] : ready;
    const nextQueue = queue.slice(1);
    setReady(nextReady);
    setQueue(nextQueue);
    if (nextQueue.length === 0) {
      setTotal(0);
      if (nextReady.length > 0) upload(nextReady);
    }
  };

  const upload = async (items: ReadyUpload[]) => {
    setBusy(true);
    const supabase = createClient();
    const urls: string[] = [];
    for (const item of items) {
      const converted = !(item.data instanceof File);
      let safeName = item.origName
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
        .upload(path, item.data, {
          cacheControl: "31536000",
          contentType: converted
            ? "image/jpeg"
            : (item.data as File).type,
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
    onUploaded(urls);
  };

  const current = queue[0];

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => startCropping(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy || queue.length > 0}
        className="rounded-full border border-sage-light px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-sage-whisper disabled:opacity-60"
      >
        {busy ? "Uploaden…" : multiple ? "📷 Foto's uploaden" : "📷 Foto uploaden"}
      </button>
      {error && <p className="mt-1.5 text-xs text-bark-deep">{error}</p>}

      {current && (
        <CropDialog
          key={`${current.name}-${queue.length}`}
          file={current}
          aspect={aspect}
          label={total > 1 ? `foto ${total - queue.length + 1} van ${total}` : undefined}
          onDone={(blob) => advance({ data: blob, origName: current.name })}
          onSkip={async () =>
            advance({ data: await shrinkImage(current), origName: current.name })
          }
          onCancel={() => {
            setQueue([]);
            setReady([]);
            setTotal(0);
          }}
        />
      )}
    </div>
  );
}
