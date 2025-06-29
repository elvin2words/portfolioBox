import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { ReactNode } from 'react';

interface DragDropProviderProps {
  children: ReactNode;
  onDragEnd: (result: DropResult) => void;
  onDragStart?: () => void;
  onDragUpdate?: () => void;
}

export function DragDropProvider({ 
  children, 
  onDragEnd, 
  onDragStart, 
  onDragUpdate 
}: DragDropProviderProps) {
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
    >
      {children}
    </DragDropContext>
  );
}
