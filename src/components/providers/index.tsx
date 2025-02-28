"use client"

import { SidebarProvider } from "../ui/sidebar";
import { DataProvider } from "./dataProvider";
import { ThemeProvider } from "@/components/theme-provider";

type ProviderProps = {
  children: React.ReactNode
};

export function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
