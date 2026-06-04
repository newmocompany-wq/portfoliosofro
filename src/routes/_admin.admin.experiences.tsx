import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";

export const Route = createFileRoute("/_admin/admin/experiences")({
  component: () => (
    <CrudPage
      title="Experiences"
      subtitle="Academic & professional positions"
      queryKey="admin-exp"
      api={api.experiences as any}
      columns={[
        { key: "position", label: "Position", render: (r: any) => <span className="font-medium text-foreground">{r.position}</span> },
        { key: "organization", label: "Organization" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
      ]}
      fields={[
        { name: "position", label: "Position" },
        { name: "organization", label: "Organization" },
        { name: "from", label: "From (year)" },
        { name: "to", label: "To (year)" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      defaults={{ position: "", organization: "", from: "", to: "" }}
    />
  ),
});
