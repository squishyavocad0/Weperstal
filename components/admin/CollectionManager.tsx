"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

/* ────────────────────────────────────────────────────────────────────────
   Generieke beheercomponent voor Maria.
   Eén component beheert alle collecties: dieren, verhalen, activiteiten
   en team. Ondersteunt: toevoegen, bewerken, verwijderen, publiceren of
   verbergen (concepten), en volgorde wijzigen via drag-and-drop.
   ──────────────────────────────────────────────────────────────────────── */

export type FieldType =
  | "text"
  | "textarea"
  | "longtext"
  | "number"
  | "list"
  | "select"
  | "image"
  | "images"
  | "date";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  help?: string;
  required?: boolean;
  seo?: boolean;
}

interface Row {
  id: string;
  published: boolean;
  sort_order?: number;
  [key: string]: unknown;
}

interface Props {
  table: string;
  singular: string;
  plural: string;
  titleField: string;
  imageField?: string;
  subtitleField?: string;
  fields: FieldConfig[];
  orderable?: boolean;
  orderBy?: string;
  orderAsc?: boolean;
  /* Optioneel: basispad van een voorbeeldweergave (de slug van het
     record wordt erachter geplakt), bijv. om een conceptverhaal te
     bekijken vóór publicatie. */
  previewBase?: string;
}

export default function CollectionManager({
  table,
  singular,
  plural,
  titleField,
  imageField,
  subtitleField,
  fields,
  orderable = true,
  orderBy = "sort_order",
  orderAsc = true,
  previewBase,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const flash = (m: string) => {
    setMessage(m);
    // Foutmeldingen blijven langer staan zodat Maria ze rustig kan lezen.
    const isError = /mislukt/i.test(m);
    setTimeout(() => setMessage(null), isError ? 10000 : 3200);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: orderAsc });
    if (!error && data) setRows(data as Row[]);
    setLoading(false);
  }, [supabase, table, orderBy, orderAsc]);

  useEffect(() => {
    load();
  }, [load]);

  /* ── Opslaan (nieuw of bestaand) ── */
  const save = async (values: Record<string, unknown>) => {
    if (creating) {
      const payload: Record<string, unknown> = {
        ...values,
        published: false, // nieuw = concept, bewust
      };
      if (orderable) {
        payload.sort_order =
          Math.max(0, ...rows.map((r) => Number(r.sort_order ?? 0))) + 1;
      }
      const { error } = await supabase.from(table).insert(payload);
      if (error) return flash(`Opslaan mislukt: ${error.message}`);
      flash(`${singular} toegevoegd als concept. Zet ‘m aan om te publiceren.`);
    } else if (editing) {
      const { error } = await supabase
        .from(table)
        .update(values)
        .eq("id", editing.id);
      if (error) return flash(`Opslaan mislukt: ${error.message}`);
      flash("Wijzigingen opgeslagen.");
    }
    setEditing(null);
    setCreating(false);
    load();
  };

  /* ── Publiceren / verbergen ── */
  const togglePublished = async (row: Row) => {
    const { error } = await supabase
      .from(table)
      .update({ published: !row.published })
      .eq("id", row.id);
    if (error) return flash(`Wijzigen mislukt: ${error.message}`);
    flash(row.published ? "Verborgen — nu een concept." : "Gepubliceerd!");
    load();
  };

  /* ── Verwijderen ── */
  const remove = async (row: Row) => {
    const name = String(row[titleField] ?? singular);
    if (!confirm(`Weet je zeker dat je “${name}” definitief wilt verwijderen?`))
      return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) return flash(`Verwijderen mislukt: ${error.message}`);
    flash(`${singular} verwijderd.`);
    load();
  };

  /* ── Drag-and-drop volgorde ── */
  const onDrop = async (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...rows];
    const from = list.findIndex((r) => r.id === dragId);
    const to = list.findIndex((r) => r.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setRows(list);
    setDragId(null);

    await Promise.all(
      list.map((r, i) =>
        supabase.from(table).update({ sort_order: i + 1 }).eq("id", r.id)
      )
    );
    flash("Volgorde opgeslagen.");
  };

  if (editing || creating) {
    return (
      <div>
        {message && (
          <p
            className="mb-4 rounded-2xl bg-gold-soft/50 px-4 py-3 text-sm text-bark-deep"
            role="alert"
          >
            {message}
          </p>
        )}
        <RecordForm
          fields={fields}
          singular={singular}
          initial={editing ?? undefined}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={save}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink/60">
          {rows.length} {rows.length === 1 ? singular.toLowerCase() : plural.toLowerCase()}
          {orderable && rows.length > 1 && (
            <span className="ml-2 text-ink/40">
              · sleep kaarten om de volgorde te wijzigen
            </span>
          )}
        </p>
        <button
          onClick={() => setCreating(true)}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-forest-deep"
        >
          + {singular} toevoegen
        </button>
      </div>

      {message && (
        <p className="mt-4 rounded-2xl bg-sage-whisper px-4 py-3 text-sm text-forest-deep" role="status">
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-ink/50">Laden…</p>
      ) : rows.length === 0 ? (
        <p className="mt-10 rounded-organic bg-white p-8 text-center text-ink/60 shadow-soft">
          Nog geen {plural.toLowerCase()}. Klik op “+ {singular} toevoegen” om
          te beginnen.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              draggable={orderable}
              onDragStart={() => setDragId(row.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(row.id)}
              className={`flex items-center gap-4 rounded-organic bg-white p-4 shadow-soft transition-all ${
                orderable ? "cursor-grab active:cursor-grabbing" : ""
              } ${dragId === row.id ? "opacity-50" : ""}`}
            >
              {orderable && (
                <span className="text-ink/30" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
                    <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
                    <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
                  </svg>
                </span>
              )}
              {imageField && typeof row[imageField] === "string" && row[imageField] ? (
                <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={String(row[imageField])}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {String(row[titleField] ?? "—")}
                </p>
                {subtitleField && (
                  <p className="truncate text-sm text-ink/50">
                    {String(row[subtitleField] ?? "")}
                  </p>
                )}
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  row.published
                    ? "bg-sage-whisper text-forest-deep"
                    : "bg-gold-soft/50 text-bark-deep"
                }`}
              >
                {row.published ? "Gepubliceerd" : "Concept"}
              </span>
              <div className="flex shrink-0 gap-2">
                {previewBase && (
                  <a
                    href={`${previewBase}/${encodeURIComponent(
                      String(row.slug ?? row.id)
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-sage-light px-3.5 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-sage-whisper"
                  >
                    Bekijken
                  </a>
                )}
                <button
                  onClick={() => togglePublished(row)}
                  className="rounded-full border border-sage-light px-3.5 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-sage-whisper"
                >
                  {row.published ? "Verbergen" : "Publiceren"}
                </button>
                <button
                  onClick={() => setEditing(row)}
                  className="rounded-full border border-sage-light px-3.5 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-sage-whisper"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => remove(row)}
                  className="rounded-full border border-transparent px-3.5 py-1.5 text-xs font-medium text-bark-deep transition-colors hover:bg-gold-soft/40"
                >
                  Verwijderen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Formulier voor één record ── */
function RecordForm({
  fields,
  singular,
  initial,
  onCancel,
  onSave,
}: {
  fields: FieldConfig[];
  singular: string;
  initial?: Row;
  onCancel: () => void;
  onSave: (values: Record<string, unknown>) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = initial?.[f.key];
      if (f.type === "list" || f.type === "images") {
        v[f.key] = Array.isArray(raw) ? (raw as string[]).join(", ") : "";
      } else {
        v[f.key] = raw ?? (f.type === "number" ? 0 : "");
      }
    }
    return v;
  });
  const [busy, setBusy] = useState(false);

  const set = (key: string, val: unknown) =>
    setValues((v) => ({ ...v, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = values[f.key];
      if (f.type === "list" || f.type === "images") {
        out[f.key] = String(raw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (f.type === "number") {
        out[f.key] = Number(raw) || 0;
      } else {
        const s = String(raw ?? "").trim();
        out[f.key] = s === "" && f.seo ? null : s;
      }
    }
    await onSave(out);
    setBusy(false);
  };

  const normal = fields.filter((f) => !f.seo);
  const seo = fields.filter((f) => f.seo);

  return (
    <form onSubmit={submit} className="rounded-organic bg-white p-6 shadow-soft md:p-8">
      <h2 className="font-display text-2xl text-forest-deep">
        {initial ? `${singular} bewerken` : `Nieuwe ${singular.toLowerCase()}`}
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {normal.map((f) => (
          <Field key={f.key} field={f} value={values[f.key]} onChange={set} />
        ))}
      </div>

      {seo.length > 0 && (
        <details className="mt-8 rounded-2xl bg-cream-soft p-5">
          <summary className="cursor-pointer text-sm font-semibold text-ink/70">
            Vindbaarheid in Google (SEO) — optioneel
          </summary>
          <div className="mt-4 grid gap-5">
            {seo.map((f) => (
              <Field key={f.key} field={f} value={values[f.key]} onChange={set} />
            ))}
          </div>
        </details>
      )}

      <div className="mt-8 flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-forest px-6 py-3 font-semibold text-cream shadow-soft transition-all hover:bg-forest-deep disabled:opacity-60"
        >
          {busy ? "Opslaan…" : "Opslaan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-sage-light px-6 py-3 font-medium text-ink/70 transition-colors hover:bg-sage-whisper"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (key: string, val: unknown) => void;
}) {
  const id = `f-${field.key}`;
  const base =
    "w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none transition-colors focus:border-forest";
  const wide =
    field.type === "textarea" ||
    field.type === "longtext" ||
    field.type === "image" ||
    field.type === "images";

  /* Galerij: komma-gescheiden links achter de schermen, maar Maria ziet
     gewoon een uploadknop en miniaturen met een verwijderkruisje. */
  if (field.type === "images") {
    const urls = String(value ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const removeAt = (i: number) =>
      onChange(field.key, urls.filter((_, j) => j !== i).join(", "));

    return (
      <div className="md:col-span-2">
        <span className="mb-2 block text-sm font-medium text-ink/80">
          {field.label}
        </span>
        {urls.length > 0 && (
          <ul className="mb-1 flex flex-wrap gap-3">
            {urls.map((url, i) => (
              <li key={`${url}-${i}`} className="relative">
                <span className="block h-20 w-28 overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Foto verwijderen"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-bark-deep text-xs text-cream shadow-soft"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <ImageUpload
          multiple
          onUploaded={(added) => onChange(field.key, [...urls, ...added].join(", "))}
        />
        {field.help && <p className="mt-1.5 text-xs text-ink/50">{field.help}</p>}
      </div>
    );
  }

  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink/80">
        {field.label}
      </label>
      {field.type === "textarea" || field.type === "longtext" ? (
        <textarea
          id={id}
          rows={field.type === "longtext" ? 10 : 3}
          required={field.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={base}
        />
      ) : field.type === "select" ? (
        <select
          id={id}
          required={field.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={base}
        >
          <option value="" disabled>
            Kies…
          </option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          required={field.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={base}
          placeholder={field.type === "image" ? "https://…" : undefined}
        />
      )}
      {field.type === "image" && (
        <ImageUpload
          onUploaded={(urls) => onChange(field.key, urls[0] ?? "")}
        />
      )}
      {field.help && <p className="mt-1.5 text-xs text-ink/50">{field.help}</p>}
      {field.type === "image" && typeof value === "string" && value.startsWith("http") && (
        <span className="relative mt-3 block h-28 w-40 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Voorbeeld" className="h-full w-full object-cover" />
        </span>
      )}
    </div>
  );
}
