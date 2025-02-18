'use client';

import { formatDistanceToNow } from 'date-fns';
import { ClipboardCopy } from 'lucide-react';
import { toast } from 'sonner';
import { SnippetDetails } from '@/types/snippets';



export function SnippetCard({ snippet }: { snippet: SnippetDetails }) {
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(snippet.code);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{snippet.heading}</h3>
        <div className="flex">
          <button
            onClick={(e) => handleCopy(e)}
            className="p-2 hover:bg-muted rounded-md"
            aria-label="Copy code"
          >
            <ClipboardCopy className="h-4 w-4" />
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
        {formatDistanceToNow(new Date(snippet.createdAt || new Date()), { addSuffix: true })}
      </div>
    </div>
  );
} 