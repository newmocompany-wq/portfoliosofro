import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/client";
import { CircuitBackground } from "@/components/effects/CircuitBackground";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await api.auth.forgotPassword(email); setSent(true); toast.success("Reset link sent."); }
    finally { setBusy(false); }
  };
  return (
    <div className="relative min-h-screen grid place-items-center px-4 bg-background">
      <CircuitBackground />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Forgot password</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a reset link.</p>
        {sent ? (
          <div className="rounded-md border border-electric/30 bg-electric/5 p-4 text-sm">Check your inbox for instructions.</div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block"><span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm" /></label>
            <button disabled={busy} className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground">
              <Mail className="size-4" /> {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
        <Link to="/login" className="mt-4 inline-block text-xs text-muted-foreground hover:text-electric">← Back to login</Link>
      </div>
    </div>
  );
}
