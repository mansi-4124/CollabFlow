import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"; // Added verticalListSortingStrategy for tasks
import { useDndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { GripVertical } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import type { IColumn } from "../types/column.types";
import type { ITask } from "../types/task.types";
import { TaskCard } from "./task-card";

export interface ColumnDragData {
  type: "Column";
  column: IColumn;
}

interface BoardColumnProps {
  column: IColumn;
  tasks: ITask[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  // Sort tasks by orderIndex before rendering. This is crucial for consistent visual order.
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [tasks]);

  // Extract task IDs for SortableContext
  const taskIds = useMemo(() => {
    return sortedTasks.map((task) => task._id);
  }, [sortedTasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.name}`,
    },
  });

  const style = {
    transition,
    // Use CSS.Transform.toString for proper application of transform values
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[500px] max-h-[500px] w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30", // This opacity might be too aggressive if you want to see the column underneath
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        // isDragging for the actual dragged item, isOverlay for the DragOverlay component
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        {/* The Button with GripVertical serves as the drag handle for the column */}
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners} // Listeners ensure the drag is initiated when this button is interacted with
          className="p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
        >
          <span className="sr-only">{`Move column: ${column.name}`}</span>
          <GripVertical />
        </Button>
        <span className="ml-auto">{column.name}</span>
      </CardHeader>

      {/* ScrollArea for tasks within the column */}
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          {/* SortableContext for tasks within this column */}
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {" "}
            {/* Applied vertical strategy */}
            {sortedTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
        <ScrollBar orientation="vertical" />{" "}
        {/* Added vertical scrollbar for tasks */}
      </ScrollArea>
    </Card>
  );
}

// BoardContainer component (remains largely the same, no functional changes needed here)
export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
