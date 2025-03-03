'use client';

import { formatDistanceToNow } from 'date-fns';
import { Copy, Code2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { SnippetDetails } from '@/types/snippets';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function SnippetCard({ snippet }: { snippet: SnippetDetails }) {
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const code = `${snippet.code.html}\n${snippet.code.css}\n${snippet.code.js}`;
    await navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard!');
  };

  // Get a preview of the code for the card background
  const getCodePreview = () => {
    const html = snippet.code.html.slice(0, 100);
    const css = snippet.code.css.slice(0, 100);
    const js = snippet.code.js.slice(0, 100);
    
    return { html, css, js };
  };
  
  const codePreview = getCodePreview();
  const hasCode = snippet.code.html.length > 0 || snippet.code.css.length > 0 || snippet.code.js.length > 0;

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 border-border hover:border-primary/50 hover:shadow-md h-full flex flex-col"
    >
      {hasCode && (
        <div className="h-32 bg-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 font-mono text-xs p-3 overflow-hidden">
            {codePreview.html && <div className="text-blue-500">{codePreview.html}</div>}
            {codePreview.css && <div className="text-pink-500 mt-1">{codePreview.css}</div>}
            {codePreview.js && <div className="text-yellow-500 mt-1">{codePreview.js}</div>}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm p-2 rounded-full">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          {snippet.isFavorite && (
            <div className="absolute top-2 right-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>
      )}
      
      <CardHeader className={`${hasCode ? 'pt-4 pb-2' : 'pt-5 pb-2'} px-4`}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{snippet.title || 'Untitled Snippet'}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full transition-opacity duration-200 hover:bg-muted hover:text-muted-foreground"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2 flex-grow">
        {snippet.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {snippet.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="px-4 pt-0 pb-4 flex flex-col items-start gap-2">
        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {snippet.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-1.5 py-0 text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
            {snippet.tags.length > 3 && (
              <Badge variant="outline" className="px-1.5 py-0 text-xs font-normal">
                +{snippet.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(snippet.createdAt || new Date()), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
} 