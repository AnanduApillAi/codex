import { SidebarProvider } from "../ui/sidebar";
import { cookies } from "next/headers";
import { DataProvider } from "./dataProvider";




type ProviderProps = {
  children:React.ReactNode
};



export async function Providers({ children }: ProviderProps) {
  const cookieStore = await cookies();
    const sidebarState = cookieStore.get("sidebar:state")?.value;
    const sidebarWidth = cookieStore.get("sidebar:width")?.value;

    let defaultOpen = true;
    if (sidebarState) {
        defaultOpen = sidebarState === "true";
    }

  return (
      <SidebarProvider defaultOpen={defaultOpen} defaultWidth={sidebarWidth}>
          <DataProvider>
          {children}
        </DataProvider>
      </SidebarProvider>
  );
}
