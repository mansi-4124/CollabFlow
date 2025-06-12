// frontend/src/components/kanban-board.tsx

import { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./board-column";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  type Announcements,
  TouchSensor,
  MouseSensor,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./task-card";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import type { IColumn } from "../types/column.types";
import type { ITask } from "../types/task.types";
import type { IBoard } from "../types/board.types";
import { hasDraggableData } from "../lib/utils";

export type ColumnId = IColumn["_id"];

interface KanbanBoardProps {
  board: IBoard | null; // Keep board prop
  initialColumns: IColumn[];
  initialTasks: ITask[];
  // Updated signature to match the data needed for backend call
  onColumnReorder: (
    draggedColumnId: string,
    newPosition: number,
    boardId: string
  ) => void;
  onTaskReorder: (tasks: ITask[]) => void;
}

export function KanbanBoard({
  board, // Destructure board prop
  initialColumns,
  initialTasks,
  onColumnReorder,
  onTaskReorder,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<IColumn[]>(initialColumns);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col._id), [columns]);

  const [tasks, setTasks] = useState<ITask[]>(initialTasks);

  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks
      .filter((task) => task.column === columnId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    const taskPosition = tasksInColumn.findIndex((task) => task._id === taskId);
    const column = columns.find((col) => col._id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.name} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.column;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${active.data.current.task.title} at position: ${
          taskPosition + 1
        } of ${tasksInColumn.length} in column ${column?.name}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.name} was moved over ${
          over.data.current.column.name
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.column
        );
        if (over.data.current.task.column !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.title
          } was moved over column ${column?.name} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.name}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.name
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.column
        );
        if (over.data.current.task.column !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.name} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.name}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd} // Final state updates and Redux dispatch
      onDragOver={onDragOver} // Visual updates during drag
    >
      <BoardContainer>
        <SortableContext
          items={columnsId}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((col) => (
            <BoardColumn
              key={col._id}
              column={col}
              tasks={tasks
                .filter((task) => task.column === col._id)
                .sort((a, b) => a.orderIndex - b.orderIndex)}
            />
          ))}
        </SortableContext>
      </BoardContainer>

      {"document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks
                  .filter((task) => task.column === activeColumn._id)
                  .sort((a, b) => a.orderIndex - b.orderIndex)}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) {
      setColumns(initialColumns);
      setTasks(initialTasks);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) {
      setColumns(initialColumns);
      setTasks(initialTasks);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle Column Reordering
    if (activeData?.type === "Column" && overData?.type === "Column") {
      const draggedColumnId = activeId as string;
      const overColumnId = overId as string;

      const oldIndex = columns.findIndex((col) => col._id === draggedColumnId);
      const newIndex = columns.findIndex((col) => col._id === overColumnId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return;
      }

      // **Optimistic UI Update for Columns**
      setColumns((prevColumns) => {
        const newOrderedColumns = arrayMove(prevColumns, oldIndex, newIndex);
        return newOrderedColumns.map((col, idx) => ({ ...col, position: idx }));
      });

      // **Call the prop with minimal data for backend update**
      // Pass the board.id to the onColumnReorder callback
      if (board?._id) {
        // Ensure board and its _id exist
        onColumnReorder(draggedColumnId, newIndex, board._id.toString());
      } else {
        console.error("Board ID is missing, cannot reorder column on backend.");
      }
      return;
    }

    // Handle Task Reordering (within the same column or across columns)
    if (activeData?.type === "Task") {
      setTasks((prevTasks) => {
        const activeTask = prevTasks.find((task) => task._id === activeId);
        if (!activeTask) return prevTasks;

        const oldColumnId = activeTask.column;
        let newColumnId: ColumnId;
        let targetIndex: number;

        if (isOverATask(overData)) {
          // Helper for type narrowing
          const overTask = prevTasks.find((task) => task._id === overId);
          if (!overTask) return prevTasks;

          newColumnId = overTask.column;
          const tasksInTargetColumn = prevTasks
            .filter((t) => t.column === newColumnId && t._id !== activeId)
            .sort((a, b) => a.orderIndex - b.orderIndex);
          targetIndex = tasksInTargetColumn.findIndex((t) => t._id === overId);
          if (targetIndex === -1) {
            targetIndex = tasksInTargetColumn.length;
          }
        } else if (isOverAColumn(overData)) {
          // Helper for type narrowing
          newColumnId = overId as ColumnId;
          const tasksInTargetColumn = prevTasks
            .filter((t) => t.column === newColumnId && t._id !== activeId)
            .sort((a, b) => a.orderIndex - b.orderIndex);
          targetIndex = tasksInTargetColumn.length;
        } else {
          return prevTasks;
        }

        const updatedActiveTask = { ...activeTask, column: newColumnId };

        const tasksFromOldColumn = prevTasks
          .filter((t) => t.column === oldColumnId && t._id !== activeId)
          .sort((a, b) => a.orderIndex - b.orderIndex);

        let tasksFromNewColumn = prevTasks
          .filter((t) => t.column === newColumnId && t._id !== activeId)
          .sort((a, b) => a.orderIndex - b.orderIndex);

        tasksFromNewColumn.splice(targetIndex, 0, updatedActiveTask);

        const reindexedOldColumnTasks = tasksFromOldColumn.map((task, idx) => ({
          ...task,
          orderIndex: idx,
        }));
        const reindexedNewColumnTasks = tasksFromNewColumn.map((task, idx) => ({
          ...task,
          orderIndex: idx,
        }));

        const finalTasks = prevTasks
          .filter((t) => t.column !== oldColumnId && t.column !== newColumnId)
          .concat(reindexedOldColumnTasks)
          .concat(reindexedNewColumnTasks);

        onTaskReorder(finalTasks);
        return finalTasks;
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!active || !over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";
    const isOverAColumn = overData?.type === "Column";

    if (!isActiveATask) return;

    setTasks((currentTasks) => {
      const activeTask = currentTasks.find((t) => t._id === active.id);
      if (!activeTask) return currentTasks;

      let newColumnId: ColumnId | undefined;

      if (isOverATask) {
        newColumnId = (overData?.task as ITask)?.column;
      } else if (isOverAColumn) {
        newColumnId = over.id as ColumnId;
      }

      if (newColumnId && activeTask.column !== newColumnId) {
        return currentTasks.map((task) =>
          task._id === active.id ? { ...task, column: newColumnId! } : task
        );
      }
      return currentTasks;
    });
  }
}

// Helper functions for type narrowing data.current
function isOverATask(data: any): data is { type: "Task"; task: ITask } {
  return data?.type === "Task";
}

function isOverAColumn(data: any): data is { type: "Column"; column: IColumn } {
  return data?.type === "Column";
}
