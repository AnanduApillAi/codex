'use client';

import { formatDistanceToNow } from 'date-fns';
import { ClipboardCopy, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Snippet {
  title: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
  createdAt: string;
}

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{snippet.title}</h3>
        <div className="flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-2 hover:bg-muted rounded-md"
            aria-label="Copy code"
          >
            <ClipboardCopy className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-muted rounded-md ml-2"
            aria-label="Edit snippet"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{snippet.description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="text-xs text-muted-foreground mb-1">
        Folder: {snippet.folder}
      </div>
      <div className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
      </div>
    </div>
  );
} 