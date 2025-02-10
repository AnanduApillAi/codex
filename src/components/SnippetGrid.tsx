'use client';
import { useEffect, useState } from 'react';
import { getAllSnippets } from '@/lib/db';
import { SnippetCard } from '@/components/SnippetCard';

interface SnippetDetails {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
  createdAt?: Date;
}

interface SnippetGridProps {
  selectedFolder: string | null;
  onSnippetSelect: (snippet: SnippetDetails) => void;
  updateTrigger: number;
}

export function SnippetGrid({ selectedFolder, onSnippetSelect, updateTrigger }: SnippetGridProps) {
  const [snippets, setSnippets] = useState<SnippetDetails[]>([]);

  useEffect(() => {
    console.log('Loading snippets...', { updateTrigger, selectedFolder });
    const loadSnippets = async () => {
      try {
        const data = await getAllSnippets();
        console.log('Fetched snippets:', data.length);
        
        const filteredSnippets = data
          .filter(snippet => !selectedFolder || snippet.folder === selectedFolder)
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
  );
} 