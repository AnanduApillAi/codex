import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableSnippetProps {
  id: string;
  children: React.ReactNode;
  isSelected: boolean;
  selectedCount: number;
  heading: string;
}

export function DraggableSnippet({ 
  id, 
  children, 
  isSelected, 
  selectedCount,
  heading 
}: DraggableSnippetProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  // If this snippet is part of a multi-selection and is being dragged
  if (isDragging && selectedCount > 1) {
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <div className="space-y-1">
          {/* First snippet (the one being dragged) */}
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700 p-2">
            <div className="flex items-center gap-2">
              <FileIcon className="h-4 w-4" />
              <span className="truncate text-sm">{heading}</span>
            </div>
          </div>
          {/* Visual indication of additional selected snippets */}
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700 p-2 -mt-2 ml-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                +{selectedCount - 1} more snippets
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={cn(isDragging && 'opacity-50')}
    >
      {children}
    </div>
  );
} 