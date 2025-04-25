"use client";

import { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { UsersTable } from "./user-table";
import { AccessLogsAccordion } from "./access-logs";
import { DashboardOverview } from "./dashboard-overview";
import { ChangePassword } from "./change-password";

type ViewType = "dashboard" | "users" | "logs" | "change-password";

export default function UserDashboard({
  token,
  user,
}: {
  token: string;
  user: string;
}) {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview token={token} username={user} />;
      case "users":
        return <UsersTable token={token} user={user} />;
      case "logs":
        return <AccessLogsAccordion username={user} token={token} />;
      case "change-password":
        return <ChangePassword user={user} />;
      default:
        return <DashboardOverview token={token} username={user} />;
    }
  };

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-lg font-semibold">
              {activeView === "dashboard" && "Dashboard"}
              {activeView === "users" && "Users Management"}
              {activeView === "logs" && "Access Logs"}
              {activeView === "change-password" && "Change Password"}
            </h1>
          </div>
        </header>
        <div className="flex-1 p-6">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
