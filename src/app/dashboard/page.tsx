'use client';
import { useState } from 'react';
import { SnippetGrid } from '@/components/SnippetGrid';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';

// Define the SnippetDetails interface
interface SnippetData {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
}

export default function DashboardPage() {
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetData | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleSnippetSelect = (snippet: SnippetData | null, openPanel: boolean = true) => {
    setSelectedSnippet(snippet);
    if (openPanel) {
      setIsRightPanelOpen(true);
    }
  };

  const handleSnippetUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const handleNewSnippet = (selectedFolder: string | null) => {
    const newSnippet: SnippetData = {
      heading: '',
      description: '',
      code: '',
      tags: [],
      folder: selectedFolder || '',
    };
    
    setSelectedSnippet(newSnippet);
    setIsRightPanelOpen(true);
  };

  const handleFolderSelect = (folder: string | null) => {
    setSelectedFolder(folder);
  };

  const handlePanelClose = () => {
    setIsRightPanelOpen(false);
    setSelectedSnippet(null);
  };

  return (
    <main className="flex min-h-screen">
      <LeftPanel 
        onSnippetSelect={handleSnippetSelect} 
        updateTrigger={updateTrigger}
        onNewSnippet={handleNewSnippet}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        onUpdate={handleSnippetUpdate}
        snippetDetails={selectedSnippet}
      />
      <div className="flex-1">
        <SnippetGrid 
          selectedFolder={selectedFolder}
          onSnippetSelect={handleSnippetSelect}
          updateTrigger={updateTrigger}
          onNewSnippet={handleNewSnippet}
        />
      </div>
      <RightPanel
        isOpen={isRightPanelOpen}
        onClose={handlePanelClose}
        snippetDetails={selectedSnippet}
        onUpdate={handleSnippetUpdate}
        updateTrigger={updateTrigger}
      />
    </main>
  );
} 