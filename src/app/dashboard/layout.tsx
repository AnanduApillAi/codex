import type { Metadata } from "next";
import "../../app/globals.css";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebarInset } from "@/components/app-sidebarInset";
export const metadata: Metadata = {
  title: "CODEX",
  description: "Codex is a snippet manager that allows you to save and manage your code snippets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      
        <AppSidebar />
        <AppSidebarInset>
          {children}
        </AppSidebarInset>
      <Toaster />
    </Providers>
  );
}
