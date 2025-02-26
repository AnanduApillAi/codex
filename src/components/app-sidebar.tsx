"use client";

import * as React from "react";
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  MoreVertical,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Star,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DataContext } from "./providers/dataProvider";
import { useContext, useEffect } from "react";
import { SnippetDetails } from "@/types/snippets";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteSnippet, updateSnippet } from "@/lib/db";
import { Button } from "./ui/button";
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};



export function AppSidebar() {
  const [activeTeam, setActiveTeam] = React.useState(data.teams[0]);
  const { snippets, setSnippets } = useContext(DataContext);
  const [favorites, setFavorites] = React.useState<SnippetDetails[]>([]);
  const [trash, setTrash] = React.useState<SnippetDetails[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);   
  const router = useRouter();

  useEffect(() => {
    setFavorites(snippets.filter((snippet) => snippet.isFavorite));
    setTrash(snippets.filter((snippet) => snippet.isTrash));
  }, [snippets]);

  const handleRestoreSnippet = async (snippet: SnippetDetails) => {
    const updatedSnippet = snippets.map((s) => s.id === snippet.id ? { ...s, isTrash: false } : s);
    setSnippets(updatedSnippet);
    try {
      await updateSnippet(snippet.id!, { ...snippet, isTrash: false });
      
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
    }
  };

  const handleDeleteSnippet = async (snippet: SnippetDetails) => {
    setSnippets(snippets.filter((s) => s.id !== snippet.id));
    try {
      await deleteSnippet(snippet.id!);
    } catch (error) {
      console.error(error);
      setSnippets(snippets.filter((s) => s.id === snippet.id));
    }
    finally{
      setDialogOpen(false);
    }
  };
  const addToFavorites = async (snippet: SnippetDetails) => {
    setSnippets(snippets.map(s => s.id === snippet.id ? { ...s, isFavorite: true } : s));
    try {
      await updateSnippet(snippet.id!, { ...snippet, isFavorite: true });
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
    }
  }

  const removeFromFavorites = async (snippet: SnippetDetails) => {
    setSnippets(snippets.map(s => s.id === snippet.id ? { ...s, isFavorite: false } : s));
    try {
      await updateSnippet(snippet.id!, { ...snippet, isFavorite: false });   
      } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
    }
  }
  const moveToTrash = async (snippet: SnippetDetails) => {
    
    setSnippets(snippets.map(s => s.id === snippet.id ? { ...s, isFavorite: false, isTrash: true } : s));
    try {
      await updateSnippet(snippet.id!, { ...snippet, isFavorite: false, isTrash: true });
    } catch (error) {
      console.error(error); 
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
    }
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex justify-between items-end">
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <SidebarTrigger className="-ml-1" />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              Toggle Sidebar <kbd className="ml-2">⌘+b</kbd>
            </TooltipContent>
          </Tooltip>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="flex flex-col gap-4">

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <SquareTerminal />
                  <span>Playground</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <SquareTerminal />
                      <span>Snippets</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* Favorites Section */}
                    {favorites.length > 0 && (
                      <>
                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          Favorites
                        </div>
                        {favorites.map((item, index) => (
                          <SidebarMenuItem key={`fav-${index}`}>
                            <SidebarMenuSubButton 
                              className="flex items-center justify-between w-full cursor-pointer"
                              onClick={() => router.push(`/dashboard/playground?snippet=${item.id}`)}
                            >
                              <div className="flex items-center gap-1">
                                <Star className="h-2 w-2" />
                                <span>{item.title}</span>
                              </div>
                            </SidebarMenuSubButton>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <SidebarMenuAction>
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </SidebarMenuAction>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="w-48 rounded-lg"
                                side="bottom"
                                align="end"
                              >
                                <DropdownMenuItem onClick={() => removeFromFavorites(item)}>
                                  <Forward className="text-muted-foreground" />
                                  <span>Remove from favorites</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveToTrash(item)}>
                                  <Trash2 className="text-muted-foreground" />
                                  <span>Move to Trash</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </SidebarMenuItem>
                        ))}
                        
                        {/* Divider between sections */}
                        {snippets.filter(s => !s.isFavorite && !s.isTrash).length > 0 && (
                          <div className="mx-3 my-2 h-px bg-border"></div>
                        )}
                      </>
                    )}
                    
                    {/* Regular Snippets Section */}
                    {snippets.filter(s => !s.isFavorite && !s.isTrash).length > 0 && (
                      <>
                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          All Snippets
                        </div>
                        {snippets.filter(s => !s.isFavorite && !s.isTrash).map((item, index) => (
                          <SidebarMenuItem key={`reg-${index}`}>
                            <SidebarMenuSubButton 
                              className="flex items-center justify-between w-full cursor-pointer"
                              onClick={() => router.push(`/dashboard/playground?snippet=${item.id}`)}
                            >
                              <div className="flex items-center gap-2">
                                <span>{item.title}</span>
                              </div>
                            </SidebarMenuSubButton>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <SidebarMenuAction>
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </SidebarMenuAction>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="w-48 rounded-lg"
                                side="bottom"
                                align="end"
                              >
                                <DropdownMenuItem onClick={() => addToFavorites(item)}>
                                  <Star className="text-muted-foreground" />
                                  <span>Add to Favorites</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveToTrash(item)}>
                                  <Trash2 className="text-muted-foreground" />
                                  <span>Move to Trash</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </SidebarMenuItem>
                        ))}
                      </>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>



              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <SquareTerminal />
                      <span>Trash</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                  {trash?.map((item, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuSubButton 
                          className="flex items-center justify-between w-full cursor-pointer"
                          onClick={() => router.push(`/dashboard/playground?snippet=${item.id}`)}
                        >
                          <span>{item.title}</span>
                        </SidebarMenuSubButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild  >
                            <SidebarMenuAction>
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-48 rounded-lg"
                            side="bottom"
                            align="end"
                          >
                            <DropdownMenuItem onClick={() => handleRestoreSnippet(item)}>
                              <Forward className="text-muted-foreground" />
                              <span>Restore Snippet</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem >
                              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem 
                                        onSelect={(e) => e.preventDefault()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Forward className="text-muted-foreground" />
                                        <span>Delete Permanently</span>
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent onClick={(e) => e.stopPropagation()}>
                                    <DialogHeader>
                                        <DialogTitle>Delete Snippet</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete this snippet?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="destructive" onClick={() => handleDeleteSnippet(item)}>yes</Button>
                                    </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>




            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side="bottom"
                      align="end"
                    >
                      <DropdownMenuItem>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {data.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
