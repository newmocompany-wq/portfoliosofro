import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";
import { SearchInput, Empty, Spinner } from "@/components/common/Primitives";
import { Image as ImageIcon, FileText, File as FileIcon, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/media")({
  component: MediaPage,
});

const ICON = { image: ImageIcon, pdf: FileText, doc: FileIcon } as const;

function MediaPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["admin-media", search], queryFn: () => api.media.list({ search, pageSize: 50 }) });
  const remove = useMutation({
    mutationFn: (id: string) => api.media.remove(id),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-media"] }); },
  });
  const upload = useMutation({
    mutationFn: () => api.media.create({
      name: `upload-${Date.now()}.jpg`,
      type: "image",
      url: "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?auto=format&fit=crop&w=800&q=70",
      size: "1.2 MB",
      uploadedAt: new Date().toISOString().slice(0, 10),
    } as any),
    onSuccess: () => { toast.success("Uploaded"); qc.invalidateQueries({ queryKey: ["admin-media"] }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Images, PDFs, and documents.</p>
        </div>
        <button onClick={() => upload.mutate()} className="inline-flex items-center gap-2 rounded-md bg-electric px-4 py-2 text-sm font-medium text-electric-foreground hover:opacity-90">
          <Upload className="size-4" /> Upload
        </button>
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder="Search media…" />
      {isLoading ? <Spinner /> : !data?.data.length ? <Empty /> : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.data.map((m: any) => {
            const Icon = ICON[m.type as keyof typeof ICON] ?? FileIcon;
            return (
              <div key={m.id} className="group relative rounded-xl border border-border bg-card overflow-hidden">
                <div className="aspect-square bg-muted/30 grid place-items-center">
                  {m.type === "image" ? <img src={m.url} className="size-full object-cover" /> : <Icon className="size-10 text-muted-foreground" />}
                </div>
                <div className="p-2.5 text-xs">
                  <p className="truncate font-medium">{m.name}</p>
                  <p className="text-muted-foreground">{m.size}</p>
                </div>
                <button onClick={() => { if (confirm("Delete?")) remove.mutate(m.id); }} className="absolute top-2 right-2 grid size-7 place-items-center rounded-md bg-deep/60 backdrop-blur border border-border opacity-0 group-hover:opacity-100 transition hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
