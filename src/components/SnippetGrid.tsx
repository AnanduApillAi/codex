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
  onSnippetSelect: (snippet: SnippetDetails) => void;
}

export function SnippetGrid({ onSnippetSelect }: SnippetGridProps) {
  const [snippets, setSnippets] = useState<SnippetDetails[]>([]);

  useEffect(() => {
    const loadSnippets = async () => {
      try {
        const data = await getAllSnippets();
        // Add createdAt if it doesn't exist
        const snippetsWithDate = data.map(snippet => ({
          ...snippet,
          createdAt: snippet.createdAt || new Date(),
        }));
        setSnippets(snippetsWithDate);
      } catch (error) {
        console.error('Error loading snippets:', error);
      }
    };

    loadSnippets();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {snippets.map((snippet, index) => (
        <div key={snippet.id || index} onClick={() => onSnippetSelect(snippet)}>
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