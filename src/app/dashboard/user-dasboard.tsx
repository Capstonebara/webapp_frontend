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
import DashboardOverview from "./dashboard-overview";

type ViewType = "dashboard" | "users" | "logs";

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
        return <DashboardOverview />;
      case "users":
        return <UsersTable token={token} user={user} />;
      case "logs":
        return <AccessLogsAccordion username={user} token={token} />;
      default:
        return <DashboardOverview />;
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
            </h1>
          </div>
        </header>
        <div className="flex-1 p-6">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
