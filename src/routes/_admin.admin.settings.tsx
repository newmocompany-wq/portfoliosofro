import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const field = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) { toast.error("Passwords don't match"); return; }
    toast.success("Password updated");
    setPwd({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Appearance and account security.</p>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display font-semibold mb-3">Appearance</h2>
        <div className="flex gap-2">
          <button onClick={() => setTheme("dark")} className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm ${theme === "dark" ? "border-electric text-electric bg-electric/5" : "border-border"}`}>
            <Moon className="size-4" /> Dark
          </button>
          <button onClick={() => setTheme("light")} className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm ${theme === "light" ? "border-electric text-electric bg-electric/5" : "border-border"}`}>
            <Sun className="size-4" /> Light
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display font-semibold mb-3 flex items-center gap-2"><KeyRound className="size-4 text-electric" /> Change password</h2>
        <form onSubmit={submit} className="space-y-3">
          {[
            ["current", "Current password"], ["next", "New password"], ["confirm", "Confirm new password"],
          ].map(([k, l]) => (
            <label key={k} className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{l}</span>
              <input type="password" className={field} value={(pwd as any)[k]} onChange={(e) => setPwd({ ...pwd, [k]: e.target.value })} />
            </label>
          ))}
          <button className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-2 text-sm font-medium text-electric-foreground hover:opacity-90">Update password</button>
        </form>
      </section>
    </div>
  );
}
