import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/api/client";

const SiteSettingsContext = createContext(null);

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx)
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Public settings — no auth required. Was previously api.settings.get()
    // which silently hit /api/admin/setting (auth-protected) and failed for
    // every visitor who wasn't logged in, leaving settings stuck at null.
    api.public.settings
      .get()
      .then((data) => {
        if (!active) return;
        if (data) setSettings(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const href = settings?.favicon;
    if (!href) return;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }, [settings?.favicon]);

  // NOTE: updateSettings still uses the admin endpoint (api.admin.settings.update)
  // since updating settings is an authenticated/admin-only action. This is correct
  // as-is — only the initial public read needed to change.
  const updateSettings = useCallback(async (patch) => {
    setSettings((s) => ({ ...s, ...patch }));
    try {
      await api.admin.settings.update(patch);
    } catch {
      // Optimistic — will reconcile on next load
    }
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}