import { createContext, useContext, useState, ReactNode } from 'react';

interface DragItem {
  id: string;
  type: 'activity' | 'destination';
  title: string;
  duration?: string;
  category?: string;
}

interface DragDropContextType {
  draggedItem: DragItem | null;
  setDraggedItem: (item: DragItem | null) => void;
  dropTarget: string | null;
  setDropTarget: (target: string | null) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider = ({ children }: DragDropProviderProps) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  return (
    <DragDropContext.Provider value={{
      draggedItem,
      setDraggedItem,
      dropTarget,
      setDropTarget
    }}>
      {children}
    </DragDropContext.Provider>
  );
};