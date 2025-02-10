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

  const handleSnippetSelect = (snippet: SnippetData) => {
    setSelectedSnippet(snippet);
    setIsRightPanelOpen(true);
  };

  const handleSnippetUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <main className="flex min-h-screen">
      <LeftPanel 
        onSnippetSelect={handleSnippetSelect} 
        updateTrigger={updateTrigger} 
      />
      <div className="flex-1">
        <SnippetGrid 
          selectedFolder={null}
          onSnippetSelect={handleSnippetSelect}
          updateTrigger={updateTrigger}
        />
      </div>
      <RightPanel
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        snippetDetails={selectedSnippet}
        onUpdate={handleSnippetUpdate}
      />
    </main>
  );
} 