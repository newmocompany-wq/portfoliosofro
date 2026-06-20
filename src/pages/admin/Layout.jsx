import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { AdminShell } from "@/components/admin/AdminShell";
function AdminLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav("/login");
  }, [loading, user, nav]);
  if (loading || !user) return null;
  // AdminDataProvider is scoped here so admin/* API calls only fire once
  // we know the user is authenticated and actually inside the dashboard —
  // not on every page of the public site.
  return (
    <AdminDataProvider>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </AdminDataProvider>
  );
}
export default AdminLayout;