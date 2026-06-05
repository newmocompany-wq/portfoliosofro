import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";

export const Route = createFileRoute("/_admin/admin/education")({
  component: () => (
    <CrudPage
      title="Education"
      subtitle="Degrees and academic background"
      queryKey="admin-edu"
      api={api.education as any}
      columns={[
        { key: "degree", label: "Degree", render: (r: any) => <span className="font-medium text-foreground">{r.degree}</span> },
        { key: "school", label: "Institution" },
        { key: "year", label: "Year" },
      ]}
      fields={[
        { name: "degree", label: "Degree" },
        { name: "school", label: "Institution" },
        { name: "year", label: "Year" },
        { name: "focus", label: "Focus / thesis", type: "textarea" },
      ]}
      defaults={{ degree: "", school: "", year: "", focus: "" }}
    />
  ),
});
