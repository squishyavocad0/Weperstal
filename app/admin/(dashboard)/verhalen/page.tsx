import CollectionManager from "@/components/admin/CollectionManager";

export default function AdminVerhalen() {
  return (
    <div>
      <h1 className="font-display text-3xl text-forest-deep">Verhalen</h1>
      <p className="mt-2 text-ink/60">
        Schrijf nieuwe verhalen of werk bestaande bij. Een verborgen verhaal is
        een concept: alleen jij ziet het.
      </p>
      <div className="mt-8">
        <CollectionManager
          table="stories"
          singular="Verhaal"
          plural="Verhalen"
          titleField="title"
          subtitleField="published_at"
          imageField="cover_url"
          orderBy="published_at"
          orderAsc={false}
          orderable={false}
          previewBase="/admin/voorbeeld/verhaal"
          fields={[
            { key: "title", label: "Titel", type: "text", required: true },
            {
              key: "slug",
              label: "Link (slug)",
              type: "text",
              required: true,
              help: "Kleine letters en streepjes, bijv.: eerste-lammetjes",
            },
            { key: "published_at", label: "Datum", type: "date", required: true },
            { key: "author", label: "Auteur", type: "text", required: true },
            {
              key: "cover_url",
              label: "Omslagfoto",
              type: "image",
              required: true,
              aspect: 16 / 9,
              help: "Upload een foto of plak een link.",
            },
            {
              key: "gallery",
              label: "Extra foto's",
              type: "images",
              help: "Upload zoveel foto's als je wilt. Mag leeg blijven.",
            },
            {
              key: "excerpt",
              label: "Korte samenvatting",
              type: "textarea",
              required: true,
              help: "Verschijnt op de overzichtspagina en in Google.",
            },
            {
              key: "body",
              label: "Verhaal",
              type: "longtext",
              required: true,
              help: "Laat een witregel tussen alinea's.",
            },
            {
              key: "seo_title",
              label: "Titel in Google",
              type: "text",
              seo: true,
              help: "Leeg laten = gewone titel gebruiken.",
            },
            {
              key: "seo_description",
              label: "Omschrijving in Google",
              type: "textarea",
              seo: true,
              help: "Leeg laten = korte samenvatting gebruiken.",
            },
          ]}
        />
      </div>
    </div>
  );
}
