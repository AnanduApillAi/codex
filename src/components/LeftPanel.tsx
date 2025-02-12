'use client';
import { useEffect, useState, useRef } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileIcon, ChevronLeft, ChevronRight, ChevronDown, FolderIcon, Search, MoreVertical, Edit, Trash } from "lucide-react";
import { getAllSnippets, getAllFolders, addSnippet, updateSnippet, deleteSnippet, renameFolder } from '@/lib/db';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { DraggableSnippet } from '@/components/DraggableSnippet';
import { DroppableFolder } from '@/components/DroppableFolder';

interface SnippetData {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
  inactive?: boolean;
  createdAt?: Date;
}

interface FolderData {
  name: string;
  snippetCount: number;
  snippets: SnippetData[];
  isOpen?: boolean;
}

interface LeftPanelProps {
  onSnippetSelect: (snippet: SnippetData | null) => void;
  updateTrigger: number;
  onNewSnippet: (selectedFolder: string | null) => void;
  selectedFolder: string | null;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdate: () => void;
  snippetDetails: SnippetData | null;
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuState {
  show: boolean;
  position: ContextMenuPosition;
  snippet: SnippetData | null;
}

interface FolderContextMenuState {
  show: boolean;
  position: ContextMenuPosition;
  folderName: string | null;
}

export default function LeftPanel({ 
  onSnippetSelect, 
  updateTrigger, 
  onNewSnippet,
  selectedFolder,
  setSelectedFolder,
  onUpdate,
  snippetDetails
}: LeftPanelProps) {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(256);
  const [adjustedWidth, setAdjustedWidth] = useState(256);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SnippetData[]>([]);
  const [allSnippets, setAllSnippets] = useState<SnippetData[]>([]);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    position: { x: 0, y: 0 },
    snippet: null
  });
  const [isRenaming, setIsRenaming] = useState(false);
  const [newSnippetName, setNewSnippetName] = useState('');
  const [folderContextMenu, setFolderContextMenu] = useState<FolderContextMenuState>({
    show: false,
    position: { x: 0, y: 0 },
    folderName: null
  });
  const [isRenamingFolder, setIsRenamingFolder] = useState(false);
  const [folderToRename, setFolderToRename] = useState<string | null>(null);
  const [unorganizedSnippets, setUnorganizedSnippets] = useState<SnippetData[]>([]);
  const [selectedSnippets, setSelectedSnippets] = useState<number[]>([]);
  const minWidth = 150;
  const collapsedWidth = 48;
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const snippets = await getAllSnippets();
        const activeSnippets = snippets.filter(s => !s.inactive).map(s => ({
          id: s.id,
          heading: s.heading,
          description: s.description,
          code: s.code,
          tags: s.tags,
          folder: s.folder,
          inactive: s.inactive
        }));
        
        setAllSnippets(activeSnippets);
        
        // Set unorganized snippets (snippets with empty folder)
        setUnorganizedSnippets(activeSnippets.filter(s => !s.folder || s.folder.trim() === ''));
        
        const folderList = await getAllFolders();
        const folderData = folderList.map(folderName => ({
          name: folderName,
          snippetCount: snippets.filter(s => s.folder === folderName && !s.inactive).length,
          snippets: snippets
            .filter(s => s.folder === folderName && !s.inactive)
            .map(s => ({
              id: s.id,
              heading: s.heading,
              description: s.description,
              code: s.code,
              tags: s.tags,
              folder: s.folder,
              inactive: s.inactive
            })),
          isOpen: false
        }));

        setFolders(folderData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [updateTrigger]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = allSnippets.filter(snippet =>
        snippet.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.folder.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allSnippets]);

  // Update the useEffect for click outside handling to include folderContextMenu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ show: false, position: { x: 0, y: 0 }, snippet: null });
        setFolderContextMenu({ show: false, position: { x: 0, y: 0 }, folderName: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add useEffect for global click handler
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Clear selection if clicking outside of any snippet
      if (!(e.target as HTMLElement).closest('[data-snippet-id]')) {
        setSelectedSnippets([]);
      }
    };

    // Add global click listener
    window.addEventListener('click', handleGlobalClick);

    // Cleanup
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const startWidth = width;
    const startX = e.pageX;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.pageX - startX);
      if (newWidth >= minWidth && newWidth <= 384) {
        setWidth(newWidth);
        setAdjustedWidth(newWidth);
      }
      if (newWidth <= minWidth) {
        return
      } else {
        setIsCollapsed(false);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setWidth(isCollapsed ? adjustedWidth : collapsedWidth);
  };

  const toggleFolder = (folderName: string) => {
    setFolders(prevFolders =>
      prevFolders.map(folder => ({
        ...folder,
        isOpen: folder.name === folderName ? !folder.isOpen : folder.isOpen
      }))
    );
    setSelectedFolder(prev => folderName === prev ? null : folderName);
  };

  const handleSnippetClick = (e: React.MouseEvent, snippet: SnippetData) => {
    e.stopPropagation();
    const isCtrlPressed = e.ctrlKey || e.metaKey;

    if (isCtrlPressed) {
      setSelectedSnippets(prev => {
        const snippetId = snippet.id!;
        return prev.includes(snippetId)
          ? prev.filter(id => id !== snippetId)
          : [...prev, snippetId];
      });
    } else {
      setSelectedSnippets([snippet.id!]);
      onSnippetSelect(snippet);
    }
  };

  const handleNewSnippet = () => {
    onNewSnippet(selectedFolder);
  };

  const handleNewFolder = () => {
    setIsAddingFolder(true);
  };

  const handleFolderNameSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newFolderName.trim()) {
      try {
        // Create a placeholder snippet for the new folder
        const placeholder: SnippetData = {
          heading: "Folder Placeholder",
          description: "This is a placeholder to keep the folder structure",
          code: "",
          tags: ["placeholder"],
          folder: newFolderName.trim(),
          inactive: true,
          createdAt: new Date()
        };
        
        await addSnippet(placeholder);
        setIsAddingFolder(false);
        setNewFolderName('');

        // Fetch all snippets and folders to properly update the state
        const snippets = await getAllSnippets();
        const updatedFolders = await getAllFolders();
        
        // Create updated folder data with correct snippet counts and content
        const folderData = updatedFolders.map(folderName => ({
          name: folderName,
          snippetCount: snippets.filter(s => s.folder === folderName && !s.inactive).length,
          snippets: snippets
            .filter(s => s.folder === folderName && !s.inactive)
            .map(s => ({
              id: s.id,
              heading: s.heading,
              description: s.description,
              code: s.code,
              tags: s.tags,
              folder: s.folder,
              inactive: s.inactive
            })),
          isOpen: folders.find(f => f.name === folderName)?.isOpen || false
        }));

        setFolders(folderData);
        onUpdate();
        toast.success('Folder created successfully');
      } catch (error) {
        console.error('Error creating new folder:', error);
        toast.error('Failed to create folder');
      }
    } else if (e.key === 'Escape') {
      setIsAddingFolder(false);
      setNewFolderName('');
    }
  };

  const handleSnippetContextMenu = (e: React.MouseEvent, snippet: SnippetData) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      position: { x: e.pageX, y: e.pageY },
      snippet: snippet
    });
  };

  const handleRenameSnippet = async () => {
    if (contextMenu.snippet?.id && newSnippetName.trim()) {
      try {
        const updatedSnippet = {
          ...contextMenu.snippet,
          heading: newSnippetName.trim()
        };
        
        await updateSnippet(contextMenu.snippet.id, updatedSnippet);
        setIsRenaming(false);
        setNewSnippetName('');
        setContextMenu(prev => ({ ...prev, show: false }));
        
        // Fetch and update data
        const snippets = await getAllSnippets();
        const updatedFolders = await getAllFolders();
        
        const folderData = updatedFolders.map(folderName => ({
          name: folderName,
          snippetCount: snippets.filter(s => s.folder === folderName && !s.inactive).length,
          snippets: snippets
            .filter(s => s.folder === folderName && !s.inactive)
            .map(s => ({
              id: s.id,
              heading: s.heading,
              description: s.description,
              code: s.code,
              tags: s.tags,
              folder: s.folder,
              inactive: s.inactive
            })),
          isOpen: folders.find(f => f.name === folderName)?.isOpen || false
        }));

        setFolders(folderData);
        onUpdate(); // Trigger global update
        
        // Update the selected snippet without opening the panel
        if (snippetDetails && snippetDetails.id === contextMenu.snippet.id) {
          onSnippetSelect(updatedSnippet);
        }
        
        toast.success('Snippet renamed successfully');
      } catch (error) {
        console.error('Error renaming snippet:', error);
        toast.error('Failed to rename snippet');
      }
    }
  };

  const handleDeleteSnippet = async () => {
    if (contextMenu.snippet?.id) {
      try {
        const updatedSnippet = {
          ...contextMenu.snippet,
          folder: 'Deleted'
        };
        
        await updateSnippet(contextMenu.snippet.id, updatedSnippet);
        
        // Fetch the fresh snippet data
        const snippets = await getAllSnippets();
        const freshSnippet = snippets.find(s => s.id === contextMenu.snippet?.id);
        
        if (snippetDetails && snippetDetails.id === contextMenu.snippet.id) {
          onSnippetSelect(freshSnippet || null);
        }
        
        setContextMenu({ show: false, position: { x: 0, y: 0 }, snippet: null });
        
        // Fetch and update data
        const updatedFolders = await getAllFolders();
        
        const folderData = updatedFolders.map(folderName => ({
          name: folderName,
          snippetCount: snippets.filter(s => s.folder === folderName && !s.inactive).length,
          snippets: snippets
            .filter(s => s.folder === folderName && !s.inactive)
            .map(s => ({
              id: s.id,
              heading: s.heading,
              description: s.description,
              code: s.code,
              tags: s.tags,
              folder: s.folder,
              inactive: s.inactive
            })),
          isOpen: folders.find(f => f.name === folderName)?.isOpen || false
        }));

        setFolders(folderData);
        onUpdate(); // Trigger global update
        
        // Update selected folder if the current folder is empty
        if (selectedFolder === contextMenu.snippet.folder) {
          setSelectedFolder(null);
        }
        
        toast.success('Snippet moved to Deleted folder');
      } catch (error) {
        console.error('Error deleting snippet:', error);
        toast.error('Failed to delete snippet');
      }
    }
  };

  const handleFolderContextMenu = (e: React.MouseEvent, folderName: string) => {
    e.preventDefault();
    setContextMenu({ show: false, position: { x: 0, y: 0 }, snippet: null });
    setFolderContextMenu({
      show: true,
      position: { x: e.pageX, y: e.pageY },
      folderName: folderName
    });
  };

  const handleRenameFolderClick = () => {
    if (folderContextMenu.folderName) {
      setNewFolderName(folderContextMenu.folderName);
      setFolderToRename(folderContextMenu.folderName);
      setIsRenamingFolder(true);
      setFolderContextMenu(prev => ({ ...prev, show: false }));
    }
  };

  const handleRenameFolder = async () => {
    if (folderToRename && newFolderName.trim()) {
      try {
        await renameFolder(folderToRename, newFolderName.trim());

        // Reset states
        setIsRenamingFolder(false);
        setFolderToRename(null);
        setNewFolderName('');
        
        // Refresh data
        const updatedSnippets = await getAllSnippets();
        const updatedFolders = await getAllFolders();
        
        const folderData = updatedFolders.map(folderName => ({
          name: folderName,
          snippetCount: updatedSnippets.filter(s => s.folder === folderName && !s.inactive).length,
          snippets: updatedSnippets
            .filter(s => s.folder === folderName && !s.inactive)
            .map(s => ({
              id: s.id,
              heading: s.heading,
              description: s.description,
              code: s.code,
              tags: s.tags,
              folder: s.folder,
              inactive: s.inactive
            })),
          isOpen: folders.find(f => f.name === folderName)?.isOpen || false
        }));

        setFolders(folderData);
        onUpdate(); // This will trigger updates in RightPanel and SnippetGrid
        toast.success('Folder renamed successfully');
      } catch (error) {
        console.error('Error renaming folder:', error);
        toast.error('Failed to rename folder');
      }
    }
  };

  const handleDeleteFolder = async () => {
    if (folderContextMenu.folderName) {
      try {
        // Get all snippets
        const snippets = await getAllSnippets();
        
        // Find and delete the placeholder snippet first
        const placeholder = snippets.find(s => 
          s.folder === folderContextMenu.folderName && 
          s.inactive === true && 
          s.heading === "Folder Placeholder"
        );
        
        if (placeholder?.id) {
          await deleteSnippet(placeholder.id);
        }

        // Update all active snippets in the folder to move them to "Deleted"
        const folderSnippets = snippets.filter(s => 
          s.folder === folderContextMenu.folderName && 
          !s.inactive &&
          s.heading !== "Folder Placeholder" // Exclude placeholder from being moved
        );

        // Move snippets to Deleted folder one by one
        for (const snippet of folderSnippets) {
          if (snippet.id) {
            const updatedSnippet = {
              ...snippet,
              folder: "Deleted",
              // Add a flag to prevent placeholder creation
              skipPlaceholder: true
            };
            await updateSnippet(snippet.id, updatedSnippet);
          }
        }

        // Reset folder context menu state
        setFolderContextMenu({ show: false, position: { x: 0, y: 0 }, folderName: null });

        // Refresh data - but exclude the deleted folder from results
        const updatedSnippets = (await getAllSnippets()).filter(s => 
          s.folder !== folderContextMenu.folderName || 
          (s.folder === folderContextMenu.folderName && s.heading !== "Folder Placeholder")
        );
        
        const updatedFolders = (await getAllFolders()).filter(f => 
          f !== folderContextMenu.folderName
        );
        
        const folderData = updatedFolders.map(folderName => ({
          name: folderName,
          snippetCount: updatedSnippets.filter(s => s.folder === folderName && !s.inactive).length,
          snippets: updatedSnippets
            .filter(s => s.folder === folderName && !s.inactive)
            .map(s => ({
              id: s.id,
              heading: s.heading,
              description: s.description,
              code: s.code,
              tags: s.tags,
              folder: s.folder,
              inactive: s.inactive
            })),
          isOpen: folders.find(f => f.name === folderName)?.isOpen || false
        }));

        setFolders(folderData);
        onUpdate(); // This will trigger updates in RightPanel and SnippetGrid
        toast.success('Folder deleted successfully');
      } catch (error) {
        console.error('Error deleting folder:', error);
        toast.error('Failed to delete folder');
      }
    }
  };

  // Handle drag end for single or multiple snippets
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!active) return;

    try {
      const snippetsToMove = selectedSnippets.length > 0 
        ? selectedSnippets 
        : [Number(active.id.toString().replace('snippet-', ''))];

      for (const snippetId of snippetsToMove) {
        const draggedSnippet = allSnippets.find(s => s.id === snippetId);
        if (!draggedSnippet) continue;

        const updatedSnippet = {
          ...draggedSnippet,
          folder: over ? over.id.toString().replace('folder-', '') : ''
        };

        await updateSnippet(snippetId, updatedSnippet);
        
        if (snippetDetails && snippetDetails.id === snippetId) {
          onSnippetSelect(updatedSnippet);
        }
      }
      
      onUpdate();
      toast.success(over 
        ? `${snippetsToMove.length} snippet(s) moved successfully` 
        : `${snippetsToMove.length} snippet(s) moved to unorganized`
      );
      
      // Clear selection after successful move
      setSelectedSnippets([]);
    } catch (error) {
      console.error('Error moving snippets:', error);
      toast.error('Failed to move snippets');
    }
  };

  return (
    <div className={cn(
      "relative border-r border-gray-200 dark:border-gray-700 h-screen transition-all duration-300",
      isCollapsed ? "w-12" : "w-64"
    )}>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed w-[inherit] h-screen">
          {/* Collapsed state file icon */}
          {isCollapsed && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <Button variant="ghost" size="icon">
                <FileIcon className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Expanded state content */}
          <div className={`flex flex-col h-full ${isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
            {/* Search bar */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search snippets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="px-4 py-2">
                <h3 className="text-sm font-medium mb-2">Search Results</h3>
                <div className="space-y-1">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSnippetClick(e, result);
                      }}
                      className={cn(
                        "w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors",
                        selectedSnippets.includes(result.id!)
                          ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <FileIcon className="h-4 w-4" />
                      <span className="truncate">{result.heading}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t my-2" />
              </div>
            )}

            {/* Folders and Snippets */}
            <div className="flex-1 overflow-auto px-4">
              {/* Folders section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Folders</h2>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      title="New Folder"
                      onClick={handleNewFolder}
                    >
                      <div className="flex items-center">
                        <FolderIcon className="h-3.5 w-3.5" />
                        
                      </div>
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  {/* Unorganized Snippets */}
                  {unorganizedSnippets.map((snippet) => (
                    <DraggableSnippet 
                      key={snippet.id} 
                      id={`snippet-${snippet.id}`}
                      isSelected={selectedSnippets.includes(snippet.id!)}
                      selectedCount={selectedSnippets.length}
                      heading={snippet.heading}
                    >
                      <button
                        data-snippet-id={snippet.id}
                        onContextMenu={(e) => handleSnippetContextMenu(e, snippet)}
                        onClick={(e) => handleSnippetClick(e, snippet)}
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors",
                          selectedSnippets.includes(snippet.id!)
                            ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <FileIcon className="h-4 w-4" />
                        <span className="truncate">{snippet.heading}</span>
                      </button>
                    </DraggableSnippet>
                  ))}

                  {/* Folders */}
                  {folders.map((folder) => (
                    <DroppableFolder key={folder.name} id={`folder-${folder.name}`}>
                      <div className="space-y-1">
                        <button
                          onClick={() => toggleFolder(folder.name)}
                          onContextMenu={(e) => handleFolderContextMenu(e, folder.name)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors",
                            selectedFolder === folder.name && "bg-muted"
                          )}
                        >
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform",
                            folder.isOpen && "rotate-90"
                          )} />
                          <FolderIcon className="h-4 w-4" />
                          <span className="flex-1 truncate">{folder.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {folder.snippetCount}
                          </span>
                        </button>

                        {folder.isOpen && (
                          <div className="ml-9 border-l pl-2 space-y-1">
                            {folder.snippets.map((snippet) => (
                              <DraggableSnippet 
                                key={snippet.id} 
                                id={`snippet-${snippet.id}`}
                                isSelected={selectedSnippets.includes(snippet.id!)}
                                selectedCount={selectedSnippets.length}
                                heading={snippet.heading}
                              >
                                <button
                                  data-snippet-id={snippet.id}
                                  onContextMenu={(e) => handleSnippetContextMenu(e, snippet)}
                                  onClick={(e) => handleSnippetClick(e, snippet)}
                                  className={cn(
                                    "w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors",
                                    selectedSnippets.includes(snippet.id!)
                                      ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                      : "hover:bg-muted/50"
                                  )}
                                >
                                  <FileIcon className="h-4 w-4" />
                                  <span className="truncate">{snippet.heading}</span>
                                </button>
                              </DraggableSnippet>
                            ))}
                          </div>
                        )}
                      </div>
                    </DroppableFolder>
                  ))}
                  
                  {/* New Folder Input */}
                  {isAddingFolder && (
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <ChevronRight className="h-4 w-4" />
                      <FolderIcon className="h-4 w-4" />
                      <Input
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={handleFolderNameSubmit}
                        placeholder="New folder name..."
                        className="h-7 px-2"
                        autoFocus
                        onBlur={() => setIsAddingFolder(false)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resizer handle with toggle button */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          <div
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-300 dark:hover:bg-gray-600"
            onMouseDown={startResizing}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm"
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </DndContext>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50"
          style={{ 
            left: contextMenu.position.x, 
            top: contextMenu.position.y,
            minWidth: '160px'
          }}
        >
          <button
            className="w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              setNewSnippetName(contextMenu.snippet?.heading || '');
              setIsRenaming(true);
              setContextMenu(prev => ({ ...prev, show: false }));
            }}
          >
            <Edit className="h-4 w-4" />
            Rename
          </button>
          <button
            className="w-full px-3 py-1.5 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSnippet();
            }}
          >
            <Trash className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}

      {/* Folder Context Menu */}
      {folderContextMenu.show && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50"
          style={{ 
            left: folderContextMenu.position.x, 
            top: folderContextMenu.position.y,
            minWidth: '160px'
          }}
        >
          <button
            className="w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleRenameFolderClick();
            }}
          >
            <Edit className="h-4 w-4" />
            Rename
          </button>
          <button
            className="w-full px-3 py-1.5 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFolder();
            }}
          >
            <Trash className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
} 