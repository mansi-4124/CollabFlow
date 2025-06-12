import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import type { ITask } from "../types/task.types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: ITask;
}

interface TaskCardProps {
  task: ITask;
  isOverlay?: boolean;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: `Task card: ${task.title}`,
    },
  });

  const style = {
    transition,
    // Use CSS.Transform.toString for proper application of transform values
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("bg-white dark:bg-secondary shadow-sm", {
    variants: {
      dragging: {
        over: "ring-2 ring-muted opacity-30", // This opacity might be too aggressive for tasks
        overlay: "ring-2 ring-primary",
      },
    },
  });
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => {
          navigate(`/task/${task._id}`);
        }}
        className="cursor-pointer"
      >
        <Card
          ref={setNodeRef}
          style={style}
          className={variants({
            // isDragging for the actual dragged item, isOverlay for the DragOverlay component
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
          })}
        >
          <CardHeader className="px-3 py-2 flex flex-row items-center border-b">
            {/* The Button with GripVertical serves as the drag handle for the task */}
            <Button
              variant="ghost"
              {...attributes}
              {...listeners} // Listeners ensure the drag is initiated when this button is interacted with
              className="p-1 text-muted-foreground hover:text-primary h-auto cursor-grab"
            >
              <span className="sr-only">Move task</span>
              <GripVertical className="w-4 h-4" />
            </Button>
            <Badge
              variant="outline"
              className="ml-auto text-xs px-2 py-0.5 rounded"
            >
              Task
            </Badge>
          </CardHeader>
          <CardContent className="px-3 py-3 text-sm text-left whitespace-pre-wrap">
            {task.title}
          </CardContent>
        </Card>
      </div>
      {/* console.log(task) should typically be removed in production code */}
      {/* {console.log(task)} */}
    </>
  );
}
