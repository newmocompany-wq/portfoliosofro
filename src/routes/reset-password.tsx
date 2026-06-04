import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/client";
import { CircuitBackground } from "@/components/effects/CircuitBackground";

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
});

function ResetPage() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== confirm) { toast.error("Passwords don't match"); return; }
    setBusy(true);
    try { await api.auth.resetPassword("demo-token", pwd); toast.success("Password updated"); nav({ to: "/login" }); }
    finally { setBusy(false); }
  };
  const field = "w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm";
  return (
    <div className="relative min-h-screen grid place-items-center px-4 bg-background">
      <CircuitBackground />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Reset password</h1>
        <p className="text-sm text-muted-foreground mb-6">Choose a new password.</p>
        <form onSubmit={submit} className="space-y-4">
          <label className="block"><span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">New password</span>
            <input required type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className={field} /></label>
          <label className="block"><span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Confirm password</span>
            <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} /></label>
          <button disabled={busy} className="inline-flex w-full h-11 items-center justify-center rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground">
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
        <Link to="/login" className="mt-4 inline-block text-xs text-muted-foreground hover:text-electric">← Back to login</Link>
      </div>
    </div>
  );
}
