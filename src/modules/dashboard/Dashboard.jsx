import { useAuth } from "@auth/components/AuthProvider";
import { DashboardHeader } from "./components/DashboardHeader";
import { useDashboardData } from "./hooks/useDashboardData";

export function Dashboard() {
  const { authSession } = useAuth();
  const roleSlug = authSession?.user?.role_slug || "user";

  const {
    dashboard,
    loadDashboard,
    loadingDashboard,
    dashboardError,
    dashboardFilter,
    setDashboardFilterValue,
    clearDashboardFilter,
    adminView,
  } = useDashboardData({ roleSlug });

  return (
    <main className="dashboard-page w-auto h-auto justify-center items-center">
      <h1 className="text-3xl">
        Dashboard
      </h1>
    </main>
  );
}

export default Dashboard;
