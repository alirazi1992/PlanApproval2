import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Sidebar } from "@/src/lib/components/sidebar";

export const metadata: Metadata = {
  title: "PlanApproval 2",
  description: "Integrated plan approval and certification management platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body>
        <div className="main-container">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
