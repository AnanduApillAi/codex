'use client';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileIcon, ChevronLeft, ChevronRight, ChevronDown, FolderIcon, Search } from "lucide-react";
import { getAllSnippets, getAllFolders } from '@/lib/db';
import { cn } from '@/lib/utils';

interface SnippetData {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
}

interface FolderData {
  name: string;
  snippetCount: number;
  snippets: SnippetData[];
  isOpen?: boolean;
}

interface LeftPanelProps {
  onSnippetSelect: (snippet: SnippetData) => void;
  updateTrigger: number;
}

export default function LeftPanel({ onSnippetSelect, updateTrigger }: LeftPanelProps) {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(256);
  const [adjustedWidth, setAdjustedWidth] = useState(256);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SnippetData[]>([]);
  const [allSnippets, setAllSnippets] = useState<SnippetData[]>([]);
  const minWidth = 150;
  const collapsedWidth = 48;

  useEffect(() => {
    const loadData = async () => {
      try {
        const snippets = await getAllSnippets();
        setAllSnippets(snippets.map(s => ({
          id: s.id,
          heading: s.heading,
          description: s.description,
          code: s.code,
          tags: s.tags,
          folder: s.folder
        })));
        
        const folderList = await getAllFolders();
        const folderData = folderList.map(folderName => ({
          name: folderName,
          snippetCount: snippets.filter(s => s.folder === folderName).length,
          snippets: snippets.filter(s => s.folder === folderName)
            .map(s => ({
              id: s.id,
              heading: s.heading,
              description: s.description,
              code: s.code,
              tags: s.tags,
              folder: s.folder
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
    setSelectedFolder(folderName);
  };

  const handleSnippetClick = (snippet: SnippetData) => {
    onSnippetSelect(snippet);
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
            <h2 className="font-semibold mb-4">Folders</h2>
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
                        <button
                          key={snippet.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSnippetClick(snippet);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/50 text-sm flex items-center gap-2"
                        >
                          <FileIcon className="h-4 w-4" />
                          <span className="truncate">{snippet.heading}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
    </div>
  );
} 