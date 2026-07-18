import CollectionManager from "@/components/admin/CollectionManager";
import AlleenBeheerder from "@/components/admin/AlleenBeheerder";

export default function AdminFaq() {
  return (
    <div>
      <h1 className="font-display text-3xl text-forest-deep">
        Veelgestelde vragen
      </h1>
      <p className="mt-2 text-ink/60">
        Vragen die ouders vaak stellen, met jouw antwoord. Gepubliceerde
        vragen verschijnen op de pagina &ldquo;Veelgestelde vragen&rdquo;;
        verborgen vragen blijven concept.
      </p>
      <AlleenBeheerder>
      <div className="mt-8">
        <CollectionManager
          table="faqs"
          singular="Vraag"
          plural="Vragen"
          titleField="question"
          fields={[
            {
              key: "question",
              label: "Vraag",
              type: "text",
              required: true,
              help: "Zoals een ouder &apos;m zou stellen, bijv.: Wat gebeurt er bij regen?",
            },
            {
              key: "answer",
              label: "Antwoord",
              type: "textarea",
              required: true,
              help: "Laat een witregel tussen alinea's.",
            },
          ]}
        />
      </div>
      </AlleenBeheerder>
    </div>
  );
}
