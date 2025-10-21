"use client";

import { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DraggableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

function DraggableItem({ id, children, className }: DraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "z-50 opacity-50 scale-105 shadow-lg",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-lg flex-shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </Button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

interface DraggableTableProps<T = any> {
  data: T[];
  onReorder: (newOrder: T[]) => void;
  getRecordId: (record: T) => string;
  renderItem: (record: T) => ReactNode;
  className?: string;
}

export function DraggableTable<T = any>({
  data,
  onReorder,
  getRecordId,
  renderItem,
  className,
}: DraggableTableProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = data.findIndex(
        (item) => getRecordId(item) === active.id
      );
      const newIndex = data.findIndex((item) => getRecordId(item) === over?.id);

      const newOrder = arrayMove(data, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={data.map(getRecordId)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("space-y-4", className)}>
          {data.map((record) => (
            <DraggableItem key={getRecordId(record)} id={getRecordId(record)}>
              {renderItem(record)}
            </DraggableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
