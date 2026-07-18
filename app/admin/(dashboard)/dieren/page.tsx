import CollectionManager from "@/components/admin/CollectionManager";

export default function AdminDieren() {
  return (
    <div>
      <h1 className="font-display text-3xl text-forest-deep">Dieren</h1>
      <p className="mt-2 text-ink/60">
        Voeg dieren toe, pas ze aan of verberg ze tijdelijk. Sleep om de
        volgorde op de website te wijzigen.
      </p>
      <div className="mt-8">
        <CollectionManager
          table="animals"
          singular="Dier"
          plural="Dieren"
          titleField="name"
          subtitleField="species"
          imageField="image_url"
          fields={[
            { key: "name", label: "Naam", type: "text", required: true },
            {
              key: "species",
              label: "Soort",
              type: "select",
              required: true,
              options: [
                { value: "paard", label: "Paard" },
                { value: "pony", label: "Pony" },
                { value: "hond", label: "Hond" },
                { value: "kat", label: "Kat" },
                { value: "schaap", label: "Schaap" },
                { value: "kip", label: "Kip" },
                { value: "vis", label: "Vis" },
              ],
            },
            { key: "age", label: "Leeftijd (jaren)", type: "number" },
            {
              key: "traits",
              label: "Karaktereigenschappen",
              type: "list",
              help: "Gescheiden door komma's, bijv.: Geduldig, Knuffelbaar, Rustig",
            },
            {
              key: "image_url",
              label: "Foto",
              type: "image",
              required: true,
              help: "Upload een foto of plak een link.",
            },
            {
              key: "bio",
              label: "Korte bio (op het kaartje)",
              type: "textarea",
              required: true,
              help: "Eén à twee zinnen; dit staat op het overzicht.",
            },
            {
              key: "slug",
              label: "Link van de eigen pagina",
              type: "text",
              help: "Kleine letters en streepjes, bijv.: marwyn. Leeg laten = geen eigen pagina.",
            },
            {
              key: "story",
              label: "Het hele verhaal",
              type: "longtext",
              help: "Het volledige verhaal voor op de eigen pagina. Laat een witregel tussen alinea's.",
            },
            {
              key: "gallery",
              label: "Extra foto's",
              type: "images",
              help: "Voor op de eigen pagina. Mag leeg blijven.",
            },
          ]}
        />
      </div>
    </div>
  );
}
