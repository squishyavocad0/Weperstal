import CollectionManager from "@/components/admin/CollectionManager";
import AlleenBeheerder from "@/components/admin/AlleenBeheerder";

export default function AdminTeam() {
  return (
    <div>
      <h1 className="font-display text-3xl text-forest-deep">Team</h1>
      <p className="mt-2 text-ink/60">
        Beheer wie er op de pagina “Over ons” staan. Sleep om de volgorde te
        wijzigen.
      </p>
      <AlleenBeheerder>
      <div className="mt-8">
        <CollectionManager
          table="team_members"
          singular="Teamlid"
          plural="Teamleden"
          titleField="name"
          subtitleField="role"
          imageField="image_url"
          fields={[
            { key: "name", label: "Naam", type: "text", required: true },
            { key: "role", label: "Rol", type: "text", required: true },
            {
              key: "image_url",
              label: "Portretfoto (link)",
              type: "image",
              required: true,
            },
            {
              key: "bio",
              label: "Persoonlijke introductie",
              type: "textarea",
              required: true,
            },
          ]}
        />
      </div>
      </AlleenBeheerder>
    </div>
  );
}
