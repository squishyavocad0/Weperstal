"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

/* ────────────────────────────────────────────────────────────────────────
   Bijsnijvenster voor foto's. Werkt met muis (slepen + scrollwiel),
   en op telefoon/tablet met één vinger slepen en twee vingers knijpen
   om te zoomen. Het kader heeft dezelfde verhouding als de plek waar
   de foto op de site komt te staan, zodat wat je hier ziet ook echt
   is wat bezoekers zien.
   ──────────────────────────────────────────────────────────────────────── */

const MAX_EDGE = 1800;

async function renderCrop(file: File, area: Area): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(area.width, area.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width * scale));
  canvas.height = Math.max(1, Math.round(area.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(
    bitmap,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  bitmap.close();
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
}

export default function CropDialog({
  file,
  aspect,
  label,
  onDone,
  onSkip,
  onCancel,
}: {
  file: File;
  aspect: number;
  /* bijv. "Foto 2 van 5" bij meerdere foto's tegelijk */
  label?: string;
  onDone: (cropped: Blob) => void;
  onSkip: () => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const confirm = async () => {
    if (!area) return;
    setBusy(true);
    try {
      const blob = await renderCrop(file, area);
      if (blob) {
        onDone(blob);
        return;
      }
      setFailed(true);
    } catch {
      setFailed(true);
    }
    setBusy(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-3"
      role="dialog"
      aria-modal="true"
      aria-label="Foto bijsnijden"
    >
      <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-organic bg-white shadow-lifted">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <p className="font-display text-lg text-forest-deep">
            Foto bijsnijden{label ? ` — ${label}` : ""}
          </p>
          <p className="hidden text-xs text-ink/50 sm:block">
            Sleep om te verschuiven · knijp of scroll om te zoomen
          </p>
        </div>

        <div className="relative h-[55vh] min-h-[260px] bg-ink/90">
          {url && (
            <Cropper
              image={url}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
              onMediaLoaded={() => setFailed(false)}
            />
          )}
        </div>

        <div className="flex items-center gap-3 px-5 pt-4">
          <label htmlFor="crop-zoom" className="text-sm text-ink/60">
            Zoom
          </label>
          <input
            id="crop-zoom"
            type="range"
            min={1}
            max={4}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-forest"
          />
        </div>

        {failed && (
          <p className="px-5 pt-3 text-sm text-bark-deep">
            Bijsnijden lukt niet bij dit bestandstype. Kies &ldquo;Zonder
            bijsnijden&rdquo; om de foto toch te gebruiken.
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 p-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-sage-light px-5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-sage-whisper"
          >
            Annuleren
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full border border-sage-light px-5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-sage-whisper"
          >
            Zonder bijsnijden
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={busy || !area}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-forest-deep disabled:opacity-60"
          >
            {busy ? "Bezig…" : "Gebruiken"}
          </button>
        </div>
      </div>
    </div>
  );
}
