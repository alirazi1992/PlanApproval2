import React from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
export interface AppShellProps {
  children: React.ReactNode;
}
export function AppShell({
  children
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <div className="absolute -top-24 -right-10 w-[420px] h-[420px] bg-purple-200/40 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 left-1/3 w-[360px] h-[360px] bg-sky-100/30 blur-[120px] rounded-full" />

      <div className="relative z-10 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 p-4 md:p-6 xl:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
