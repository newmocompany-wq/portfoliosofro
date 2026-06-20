import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import App from "./App";
import "./styles.css";
// NOTE: AdminDataProvider is intentionally NOT imported/used here anymore.
// It used to wrap the entire app, which meant every admin/* API call
// (achievements, researches, experiences, etc.) fired on every page load —
// including public pages — producing a wall of 401 Unauthenticated errors
// for visitors who aren't logged in. It now lives inside AdminLayout, so it
// only runs once the user is actually inside /admin/* and authenticated.
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <SiteSettingsProvider>
                <App />
                <Toaster theme="dark" position="top-right" richColors />
              </SiteSettingsProvider>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);