import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Spinner } from "@/components/common/Primitives";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-prof"], queryFn: () => api.professor.get() });
  const [form, setForm] = useState<any>(null);
  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);

  const save = useMutation({
    mutationFn: (p: any) => api.professor.update(p),
    onSuccess: () => { toast.success("Profile updated"); qc.invalidateQueries({ queryKey: ["admin-prof"] }); },
  });

  if (isLoading || !form) return <Spinner />;
  const field = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm";

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Personal, academic, and contact information.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">Personal information</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["name", "Full name"], ["title", "Academic title"], ["department", "Department"],
              ["university", "University"], ["email", "Email"], ["phone", "Phone"],
              ["office", "Office"], ["officeHours", "Office hours"], ["address", "Address"],
            ].map(([k, l]) => (
              <label key={k} className="block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{l}</span>
                <input className={field} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">About</h2>
          <label className="block"><span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Biography</span>
            <textarea rows={5} className={field} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></label>
          <label className="block"><span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Vision</span>
            <textarea rows={3} className={field} value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} /></label>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">Social links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(form.socials ?? {}).map(([k, v]) => (
              <label key={k} className="block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{k}</span>
                <input className={field} value={v as string} onChange={(e) => setForm({ ...form, socials: { ...form.socials, [k]: e.target.value } })} />
              </label>
            ))}
          </div>
        </section>

        <button disabled={save.isPending} className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-2.5 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60">
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
