import { useDroppable } from '@dnd-kit/core';

interface DroppableFolderProps {
  id: string;
  children: React.ReactNode;
}

export function DroppableFolder({ id, children }: DroppableFolderProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`${isOver ? 'bg-muted/50' : ''}`}
    >
      {children}
    </div>
  );
} 