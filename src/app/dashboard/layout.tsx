import type { Metadata } from "next";
import "../../app/globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/app-sidebar";
export const metadata: Metadata = {
  title: "CODEX",
  description: "CODEX",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme="system"
    //   enableSystem
    //   disableTransitionOnChange
    // >
    //   <SidebarConfig>{children}</SidebarConfig>
    // </ThemeProvider>
    <Providers>
      <AppSidebar />
      {children}
    </Providers>
    // <SidebarConfig>{children}</SidebarConfig>
  );
}
