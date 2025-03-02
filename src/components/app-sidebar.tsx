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
  Home,
  FileCode,
  Code2,
  Search,
  Loader2,
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
import { useContext, useEffect, useState } from "react";
import { SnippetDetails } from "@/types/snippets";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { deleteSnippet, updateSnippet } from "@/lib/db";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
  const { snippets, setSnippets } = useContext(DataContext);
  const [favorites, setFavorites] = useState<SnippetDetails[]>([]);
  const [regularSnippets, setRegularSnippets] = useState<SnippetDetails[]>([]);
  const [trash, setTrash] = useState<SnippetDetails[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState<SnippetDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [snippetsOpen, setSnippetsOpen] = useState(true);
  const [trashOpen, setTrashOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSnippetId = searchParams.get("snippet");

  const isActive = (id: number | undefined) => {
    return pathname.includes('/dashboard/playground') && currentSnippetId === id?.toString();
  };

  useEffect(() => {
    setFavorites(snippets.filter((snippet) => snippet.isFavorite && !snippet.isTrash));
    setRegularSnippets(snippets.filter((snippet) => !snippet.isFavorite && !snippet.isTrash));
    setTrash(snippets.filter((snippet) => snippet.isTrash));
  }, [snippets]);

  const handleRestoreSnippet = async (snippet: SnippetDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSnippet = { ...snippet, isTrash: false };
    setSnippets(snippets.map((s) => s.id === snippet.id ? updatedSnippet : s));
    try {
      await updateSnippet(snippet.id!, updatedSnippet);
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
    }
  };

  const handleDeleteSnippet = async () => {
    if (!snippetToDelete) return;

    setIsDeleting(true);
    setSnippets(snippets.filter((s) => s.id !== snippetToDelete.id));

    try {
      await deleteSnippet(snippetToDelete.id!);
      if (isActive(snippetToDelete.id)) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setSnippets([...snippets]);
    } finally {
      setDialogOpen(false);
      setSnippetToDelete(null);
      setIsDeleting(false);
    }
  };

  const confirmDelete = (snippet: SnippetDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    setSnippetToDelete(snippet);
    setDialogOpen(true);
  };

  const addToFavorites = async (snippet: SnippetDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const updatedSnippet = { ...snippet, isFavorite: true };
    setSnippets(snippets.map(s => s.id === snippet.id ? updatedSnippet : s));
    try {
      await updateSnippet(snippet.id!, updatedSnippet);
      
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
    }
  };

  const removeFromFavorites = async (snippet: SnippetDetails, e: React.MouseEvent) => {
    console.log("Removing from favorites");
    e.stopPropagation();
    const updatedSnippet = { ...snippet, isFavorite: false };
    setSnippets(snippets.map(s => s.id === snippet.id ? updatedSnippet : s));
    try {
      await updateSnippet(snippet.id!, updatedSnippet);
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
    }
  };

  const moveToTrash = async (snippet: SnippetDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSnippet = { ...snippet, isFavorite: false, isTrash: true };
    setSnippets(snippets.map(s => s.id === snippet.id ? updatedSnippet : s));
    try {
      await updateSnippet(snippet.id!, updatedSnippet);
      if (isActive(snippet.id)) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
    }
  };

  // Add this state to track sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Add this effect to handle sidebar state changes
  useEffect(() => {
    const handleSidebarStateChange = () => {
      // Check if sidebar is collapsed by looking at a data attribute on the sidebar element
      const sidebarElement = document.querySelector('[data-sidebar-collapsed]');
      setIsSidebarCollapsed(sidebarElement?.getAttribute('data-sidebar-collapsed') === 'true');
    };

    // Initial check
    handleSidebarStateChange();

    // Set up mutation observer to detect sidebar state changes
    const observer = new MutationObserver(handleSidebarStateChange);
    const sidebar = document.querySelector('[data-sidebar]');

    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['data-sidebar-collapsed']
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="relative">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <span className="font-semibold text-lg">
                  CodEX
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup >
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start ${pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  <button onClick={() => router.push('/dashboard')}>
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={pathname === '/dashboard/playground' && !currentSnippetId ? 'bg-accent text-accent-foreground' : ''}
                >
                  <button onClick={() => router.push('/dashboard/playground')} className="w-full">
                    <FileCode className="h-4 w-4" />
                    <span>New Snippet</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <Separator className="my-2" />

          <SidebarGroup >

            <SidebarGroupLabel>Your Snippets</SidebarGroupLabel>


            <SidebarMenu >
              <Collapsible
                asChild
                // onOpenChange={setFavoritesOpen} 
                // className="w-full"
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={"Favorites"}>
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>Favorites</span>
                      {favorites.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {favorites.length}
                        </Badge>
                      )}
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-1 pb-2 transition-opacity duration-200">
                    <SidebarMenuSub>


                      {favorites.length === 0 ? (
                        <p className="text-xs text-muted-foreground px-9 py-2">No favorites yet</p>
                      ) : (
                        <div className="space-y-1">
                          {favorites.map((snippet) => (
                            <SidebarMenuSubItem key={snippet.id}>
                              <SidebarMenuSubButton asChild>
                                <motion.div

                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex items-center justify-between px-9 py-1.5 text-sm rounded-md ${isActive(snippet.id) ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                                    } transition-colors cursor-pointer md:group`}
                                  onClick={() => router.push(`/dashboard/playground?snippet=${snippet.id}`)}
                                >
                                  <span className="truncate">{snippet.title || 'Untitled Snippet'}</span>

                                  <div className="flex items-center md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => removeFromFavorites(snippet, e)}
                                      className="p-1 rounded-md hover:bg-background"
                                    >
                                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    </button>
                                    <button
                                      onClick={(e) => moveToTrash(snippet, e)}
                                      className="p-1 rounded-md hover:bg-background"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                    </button>
                                  </div>
                                </motion.div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>

                          ))}
                        </div>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>

              </Collapsible>

              <Collapsible
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="All Snippets">
                      <Folder className="h-4 w-4" />
                      <span>All Snippets</span>
                      {snippets.filter((snippet) => !snippet.isTrash).length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {snippets.length}
                        </Badge>
                      )}
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-1 pb-2 transition-opacity duration-200">
                    <SidebarMenuSub>
                      {snippets.filter((snippet) => !snippet.isTrash).length === 0 ? (
                        <p className="text-xs text-muted-foreground px-9 py-2">No snippets yet</p>
                      ) : (
                        <div className="space-y-1">
                          {snippets.filter((snippet) => !snippet.isTrash).map((snippet) => (
                            <SidebarMenuSubItem key={snippet.id}>
                              <SidebarMenuSubButton asChild>
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex items-center justify-between px-9 py-1.5 text-sm rounded-md ${isActive(snippet.id) ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'} transition-colors cursor-pointer group`}
                                  onClick={() => router.push(`/dashboard/playground?snippet=${snippet.id}`)}
                                >
                                  <span className="truncate">{snippet.title || 'Untitled Snippet'}</span>
                                  <div className="flex items-center md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    {snippet.isFavorite ? (
                                      <button
                                        onClick={(e) => removeFromFavorites(snippet, e)}
                                        className="p-1 rounded-md hover:bg-background"
                                      >
                                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={(e) => addToFavorites(snippet, e)}
                                        className="p-1 rounded-md hover:bg-background"
                                      >
                                        <Star className="h-3.5 w-3.5 text-muted-foreground hover:text-yellow-400" />
                                      </button>
                                    )}
                                    
                                    <button
                                      onClick={(e) => moveToTrash(snippet, e)}
                                      className="p-1 rounded-md hover:bg-background"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                    </button>
                                  </div>
                                </motion.div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </div>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Trash">
                      <Trash2 className="h-4 w-4" />
                      <span>Trash</span>
                      {trash.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {trash.length}
                        </Badge>
                      )}
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-1 pb-2 transition-opacity duration-200">
                    <SidebarMenuSub>
                      {trash.length === 0 ? (
                        <p className="text-xs text-muted-foreground px-9 py-2">Trash is empty</p>
                      ) : (
                        <div className="space-y-1">
                          {trash.map((snippet) => (
                            <SidebarMenuSubItem key={snippet.id}>
                              <SidebarMenuSubButton asChild>
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex items-center justify-between px-9 py-1.5 text-sm rounded-md ${isActive(snippet.id) ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'} transition-colors cursor-pointer group`}
                                  onClick={() => router.push(`/dashboard/playground?snippet=${snippet.id}`)}
                                >
                                  <span className="truncate">{snippet.title || 'Untitled Snippet'}</span>
                                  <div className="flex items-center md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => handleRestoreSnippet(snippet, e)}
                                      className="p-1 rounded-md hover:bg-background"
                                    >
                                      <Forward className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                                    </button>
                                    <button
                                      onClick={(e) => confirmDelete(snippet, e)}
                                      className="p-1 rounded-md hover:bg-background"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                    </button>
                                  </div>
                                </motion.div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </div>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Delete Snippet</DialogTitle>
            </VisuallyHidden>
            <DialogDescription>
              Are you sure you want to permanently delete this snippet? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center justify-between sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSnippet}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


