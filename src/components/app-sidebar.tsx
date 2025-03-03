"use client";

import * as React from "react";
import {
  ChevronRight,
  Folder,
  Forward,
  Star,
  Trash2,
  Home,
  FileCode,
  Code2,
  Loader2,
} from "lucide-react";


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { Suspense } from "react";


// Create a new component to handle search params
function SidebarWithParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSnippetId = searchParams.get("snippet");
  
  return <SidebarContent pathname={pathname} currentSnippetId={currentSnippetId} />;
}

// Move the main sidebar content to a separate component
function SidebarContent({ pathname, currentSnippetId }: { 
  pathname: string; 
  currentSnippetId: string | null; 
}) {
  const { snippets, setSnippets } = useContext(DataContext);
  const [favorites, setFavorites] = useState<SnippetDetails[]>([]);
  const [trash, setTrash] = useState<SnippetDetails[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState<SnippetDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const isActive = (id: number | undefined) => {
    return pathname.includes('/dashboard/playground') && currentSnippetId === id?.toString();
  };

  useEffect(() => {
    setFavorites(snippets.filter((snippet) => snippet.isFavorite && !snippet.isTrash));
    setTrash(snippets.filter((snippet) => snippet.isTrash));
  }, [snippets]);

  const handleRestoreSnippet = async (snippet: SnippetDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSnippet = { ...snippet, isTrash: false };
    setSnippets(snippets.map((s) => s.id === snippet.id ? updatedSnippet : s));
    try {
      await updateSnippet(snippet.id!, updatedSnippet);
      toast.success('Snippet restored successfully');
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
      toast.error('Failed to restore snippet');
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
      toast.success('Snippet deleted successfully');
    } catch (error) {
      console.error(error);
      setSnippets([...snippets]);
      toast.error('Failed to delete snippet');
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
      toast.success('Snippet added to favorites');
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
      toast.error('Failed to add snippet to favorites');
    }
  };

  const removeFromFavorites = async (snippet: SnippetDetails, e: React.MouseEvent) => {
    console.log("Removing from favorites");
    e.stopPropagation();
    const updatedSnippet = { ...snippet, isFavorite: false };
    setSnippets(snippets.map(s => s.id === snippet.id ? updatedSnippet : s));
    try {
      await updateSnippet(snippet.id!, updatedSnippet);
      toast.success('Snippet removed from favorites');
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
      toast.error('Failed to remove snippet from favorites');
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
      toast.success('Snippet moved to trash');
    } catch (error) {
      console.error(error);
      setSnippets(snippets.map(s => s.id === snippet.id ? snippet : s));
      toast.error('Failed to move snippet to trash');
    }
  };


  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="relative">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                onClick={() => router.push('/dashboard')}
              >

                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Code2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-2xl">
                    CodEX
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>


        </SidebarHeader>

        <SidebarGroupContent>
          <SidebarGroup >
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
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
                  tooltip="New Snippet"
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
                      <Star className="h-4 w-4" />
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
                          {snippets.filter((snippet) => !snippet.isTrash).length}
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
        </SidebarGroupContent>

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

// Main export component
export function AppSidebar() {
  return (
    <Suspense fallback={<SidebarLoading />}>
      <SidebarWithParams />
    </Suspense>
  );
}

// Add a loading component
function SidebarLoading() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* Basic loading state for header */}
        <div className="p-4">
          <div className="h-8 w-24 bg-muted/20 animate-pulse rounded" />
        </div>
      </SidebarHeader>
      <SidebarGroupContent>
        <div className="p-4 space-y-4">
          <div className="h-4 w-3/4 bg-muted/20 animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted/20 animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted/20 animate-pulse rounded" />
        </div>
      </SidebarGroupContent>
      <SidebarRail />
    </Sidebar>
  );
}


