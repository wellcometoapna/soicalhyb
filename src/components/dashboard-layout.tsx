"use client";

import { ReactNode } from "react";
import DashboardSidebar from "./dashboard-sidebar";
import MobileDashboardSidebar from "./mobile-dashboard-sidebar";

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    email: string;
  };
}

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
}

export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen bg-slate-900">
      {/* Mobile Sidebar */}
      <MobileDashboardSidebar user={user} />

      <div className="flex h-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar user={user} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
