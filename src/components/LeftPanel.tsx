'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileIcon, ChevronLeft, ChevronRight, ChevronDown, FolderIcon, Search, Plus, MoreVertical, Edit, Trash } from "lucide-react";
import { getAllSnippets, getAllFolders, addSnippet, updateSnippet, deleteSnippet } from '@/lib/db';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

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
  const minWidth = 150;
  const collapsedWidth = 48;
  const contextMenuRef = useRef<HTMLDivElement>(null);

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

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ show: false, position: { x: 0, y: 0 }, snippet: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleSnippetClick = (snippet: SnippetData) => {
    onSnippetSelect(snippet);
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
        setContextMenu({ show: false, position: { x: 0, y: 0 }, snippet: null });
        
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
          onSnippetSelect(updatedSnippet, false); // Pass false to prevent panel from opening
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
        setContextMenu({ show: false, position: { x: 0, y: 0 }, snippet: null });
        
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
        
        // Close the right panel if the deleted snippet is currently selected
        onSnippetSelect(null);
        
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

  return (
    <div 
      className="relative flex h-screen"
      style={{ width: isCollapsed ? collapsedWidth : width }}
    >
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
                      handleSnippetClick(result);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/50 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-4 w-4" />
                      <span className="flex-1 truncate">{result.heading}</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-6">
                      {result.folder}
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t my-2" />
            </div>
          )}

          {/* Folders */}
          <div className="flex-1 overflow-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Folders</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  title="New File"
                  onClick={() => onNewSnippet(selectedFolder)}
                >
                  <div className="flex items-center">
                    <FileIcon className="h-3.5 w-3.5" />
                    <Plus className="h-3 w-3 absolute -right-0.5 -bottom-0.5" />
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  title="New Folder"
                  onClick={handleNewFolder}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-3.5 w-3.5" />
                    <Plus className="h-3 w-3 absolute -right-0.5 -bottom-0.5" />
                  </div>
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.name} className="space-y-1">
                  <button
                    onClick={() => toggleFolder(folder.name)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors",
                      selectedFolder === folder.name && "bg-muted"
                    )}
                  >
                    {folder.isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <FolderIcon className="h-4 w-4" />
                    <span className="text-sm flex-1 text-left">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {folder.snippetCount}
                    </span>
                  </button>
                  {folder.isOpen && (
                    <div className="ml-9 border-l pl-2 space-y-1">
                      {folder.snippets.map((snippet) => (
                        <div key={snippet.id} className="relative">
                          <button
                            onContextMenu={(e) => handleSnippetContextMenu(e, snippet)}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isRenaming) {
                                handleSnippetClick(snippet);
                              }
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/50 text-sm flex items-center gap-2"
                          >
                            <FileIcon className="h-4 w-4" />
                            {isRenaming && contextMenu.snippet?.id === snippet.id ? (
                              <Input
                                value={newSnippetName}
                                onChange={(e) => setNewSnippetName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleRenameSnippet();
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    setIsRenaming(false);
                                    setNewSnippetName('');
                                    setContextMenu({ show: false, position: { x: 0, y: 0 }, snippet: null });
                                  }
                                }}
                                className="h-6 px-1"
                                autoFocus
                                onBlur={() => {
                                  setIsRenaming(false);
                                  setNewSnippetName('');
                                  setContextMenu({ show: false, position: { x: 0, y: 0 }, snippet: null });
                                }}
                              />
                            ) : (
                              <span className="truncate">{snippet.heading}</span>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
      </div>

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
    </div>
  );
} 