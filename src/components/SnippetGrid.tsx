'use client';
import { useEffect, useState } from 'react';
import { getAllSnippets } from '@/lib/db';
import { SnippetCard } from '@/components/SnippetCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SnippetDetails {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
  inactive?: boolean;
  createdAt?: Date;
}

interface SnippetGridProps {
  selectedFolder: string | null;
  onSnippetSelect: (snippet: SnippetDetails) => void;
  updateTrigger: number;
  onNewSnippet: (selectedFolder: string | null) => void;
}

export function SnippetGrid({ 
  selectedFolder, 
  onSnippetSelect, 
  updateTrigger,
  onNewSnippet 
}: SnippetGridProps) {
  const [snippets, setSnippets] = useState<SnippetDetails[]>([]);

  useEffect(() => {
    console.log('Loading snippets...', { updateTrigger, selectedFolder });
    const loadSnippets = async () => {
      try {
        const data = await getAllSnippets();
        console.log('Fetched snippets:', data.length);
        
        const filteredSnippets = data
          .filter(snippet => !snippet.inactive)
          .map(snippet => ({
            ...snippet,
            createdAt: snippet.createdAt || new Date(),
          }));
        
        console.log('Filtered snippets:', filteredSnippets.length);
        setSnippets(filteredSnippets);
      } catch (error) {
        console.error('Error loading snippets:', error);
      }
    };

    loadSnippets();
  }, [selectedFolder, updateTrigger]);

  return (
    <div className="space-y-4">
      {/* Add Snippet Button */}
      <div className="flex justify-end px-4 pt-4">
        <Button 
          onClick={() => onNewSnippet(selectedFolder)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Snippet
        </Button>
      </div>

      {/* Snippet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {snippets.map((snippet, index) => (
          <div 
            key={`${snippet.id}-${updateTrigger}`}
            onClick={() => onSnippetSelect(snippet)}
          >
            <SnippetCard
              snippet={{
                title: snippet.heading,
                description: snippet.description,
                code: snippet.code,
                tags: snippet.tags,
                folder: snippet.folder,
                createdAt: snippet.createdAt?.toISOString() || new Date().toISOString(),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 