'use client';
import { useState } from 'react';
import { SnippetGrid } from '@/components/SnippetGrid';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';

// Define the SnippetDetails interface
interface SnippetDetails {
  heading: string;
  description: string;
  code: string;
  tags: string[];
  project: string;
  folder: string;
}

export default function DashboardPage() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetDetails | undefined>();

  const handleSnippetSelect = (snippet: SnippetDetails) => {
    setSelectedSnippet(snippet);
    setIsRightPanelOpen(true);
  };

  return (
    <main className="flex min-h-screen">
      <LeftPanel />
      <div className="flex-1 py-8">
        <h1 className="text-3xl font-bold mb-6">Code Snippets</h1>
        <SnippetGrid onSnippetSelect={handleSnippetSelect} />
      </div>
      <RightPanel 
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        snippetDetails={selectedSnippet}
      />
    </main>
  );
} 