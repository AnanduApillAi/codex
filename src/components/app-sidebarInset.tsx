"use client";
import { SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import Socials from "@/components/socials";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

export function AppSidebarInset({ 
  children, 
  snippetName,
}: { 
  children: React.ReactNode;
  snippetName?: string;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isPlayground = pathname.includes('/playground');

  return (
    <SidebarInset className="overflow-x-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
        <div className="flex items-center gap-2 px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="-ml-1" />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              Toggle Sidebar <kbd className="ml-2">⌘+b</kbd>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              {isPlayground && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/playground">
                      Playground
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              {snippetName && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {snippetName}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* <div className="mr-2 sm:mr-4">
          <Socials />
        </div> */}
        
        <div className="flex items-center gap-2 pr-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="relative inline-flex cursor-pointer"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }
                }}
              >
                <div className="w-[52px] h-[28px] rounded-full bg-primary/10 dark:bg-primary/20 
                              transition-colors duration-200 ease-in-out relative">
                  <div className="absolute left-[2px] top-[2px] w-[24px] h-[24px] rounded-full 
                                bg-white shadow-sm transform transition-transform duration-200 
                                dark:translate-x-[24px] flex items-center justify-center">
                    <Sun className="h-3.5 w-3.5 text-primary/70 rotate-0 scale-100 transition-all duration-200
                                  dark:rotate-90 dark:scale-0" />
                    <Moon className="absolute h-3.5 w-3.5 text-primary/70 rotate-90 scale-0 transition-all duration-200
                                   dark:rotate-0 dark:scale-100" />
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              Toggle theme <kbd className="ml-2">⌘+t</kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
      {children}
    </SidebarInset>
  );
}
