import CollectionManager from "@/components/admin/CollectionManager";
import AlleenBeheerder from "@/components/admin/AlleenBeheerder";

export default function AdminActiviteiten() {
  return (
    <div>
      <h1 className="font-display text-3xl text-forest-deep">Activiteiten</h1>
      <p className="mt-2 text-ink/60">
        Beheer de activiteiten en hun detailpagina&apos;s. Sleep om de volgorde
        te wijzigen.
      </p>
      <AlleenBeheerder>
      <div className="mt-8">
        <CollectionManager
          table="activities"
          singular="Activiteit"
          plural="Activiteiten"
          titleField="title"
          subtitleField="age_range"
          imageField="image_url"
          fields={[
            { key: "title", label: "Naam", type: "text", required: true },
            {
              key: "slug",
              label: "Link (slug)",
              type: "text",
              required: true,
              help: "Kleine letters en streepjes, bijv.: balou-basis",
            },
            {
              key: "icon",
              label: "Icoon",
              type: "select",
              required: true,
              options: [
                { value: "hoof", label: "Hoefijzer (basis)" },
                { value: "saddle", label: "Zadel (rijden)" },
                { value: "party", label: "Feest" },
                { value: "walk", label: "Wandelen" },
              ],
            },
            { key: "duration", label: "Duur", type: "text", help: "Bijv.: 60 minuten" },
            { key: "age_range", label: "Leeftijd", type: "text", help: "Bijv.: 4 – 8 jaar" },
            { key: "group_size", label: "Groepsgrootte", type: "text" },
            { key: "price_hint", label: "Prijsindicatie", type: "text" },
            {
              key: "image_url",
              label: "Foto (link)",
              type: "image",
              required: true,
            },
            {
              key: "intro",
              label: "Korte introductie",
              type: "textarea",
              required: true,
            },
            {
              key: "highlights",
              label: "Wat je kunt verwachten",
              type: "list",
              help: "Punten gescheiden door komma's.",
            },
            {
              key: "description",
              label: "Uitgebreide beschrijving",
              type: "longtext",
              required: true,
              help: "Laat een witregel tussen alinea's.",
            },
            { key: "seo_title", label: "Titel in Google", type: "text", seo: true },
            {
              key: "seo_description",
              label: "Omschrijving in Google",
              type: "textarea",
              seo: true,
            },
          ]}
        />
      </div>
      </AlleenBeheerder>
    </div>
  );
}
