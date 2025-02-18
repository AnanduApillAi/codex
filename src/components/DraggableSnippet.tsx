import { useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

interface DraggableSnippetProps {
  id: string;
  children: React.ReactNode;
  isSelected: boolean;
  selectedCount: number;
  heading: string;
  grouped?: boolean;
  selectedSnippets?: number[];
}

export function DraggableSnippet({ 
  id, 
  children, 
  isSelected,
  selectedCount,
  heading,
  grouped = false,
  selectedSnippets = []
}: DraggableSnippetProps) {
  const [isDragGroup, setIsDragGroup] = useState(false);
  const [groupTransform, setGroupTransform] = useState<{ x: number, y: number } | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  useEffect(() => {
    if (isDragging && selectedCount > 1) {
      // Log all snippet elements in the document
      const allSnippets = document.querySelectorAll('[data-selected="true"]:not([data-dragging="true"])');
      allSnippets.forEach(snippet => snippet.style.visibility = 'hidden');
      
    }
  }, [isDragging, transform, selectedCount, selectedSnippets, id]);

  const currentId = Number(id.replace('snippet-', ''));
  const shouldHide = selectedCount > 1 && 
                    selectedSnippets?.includes(currentId) && 
                    !isDragging &&
                    isDragGroup;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    position: 'relative' as const,
    zIndex: isDragging ? 50 : undefined,
    visibility: shouldHide ? 'hidden' : 'visible',
    backgroundColor: (selectedSnippets?.includes(currentId) && isDragGroup && !isDragging) 
      ? '#86efac'
      : undefined
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        ${isDragging ? 'opacity-50' : ''}
        ${isSelected ? 'relative' : ''}
        ${isDragging && selectedCount > 1 ? 'after:content-[attr(data-count)] after:absolute after:-top-2 after:-right-2 after:bg-blue-500 after:text-white after:rounded-full after:w-5 after:h-5 after:flex after:items-center after:justify-center after:text-xs' : ''}
      `}
      data-dragging={isDragging ? "true" : undefined}
      data-selected={isSelected ? "true" : undefined}
      data-count={selectedCount}
    >
      {children}
    </div>
  );
}