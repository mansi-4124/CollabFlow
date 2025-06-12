// frontend/src/components/BoardPageContent.tsx

import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../components/main-layout";
import ProjectHeader from "../components/project-header";

import { fetchBoardById } from "../redux/slices/boardSlice";
import {
  fetchColumnsByBoard,
  updateColumnOrder, // Use the correct thunk name
} from "../redux/slices/columnSlice";
import {
  fetchTasksByBoardId,
  updateTaskOrder,
} from "../redux/slices/taskSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { KanbanBoard } from "../components/kanban-board";
import type { ITask } from "../types/task.types";

function BoardPageContent() {
  const { boardId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { currentBoard, loading: boardLoading } = useSelector(
    (state: RootState) => state.board
  );
  const { columns } = useSelector((state: RootState) => state.column);
  const { tasks } = useSelector((state: RootState) => state.task);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardById(boardId));
      dispatch(fetchColumnsByBoard(boardId));
      dispatch(fetchTasksByBoardId(boardId));
    }
  }, [boardId, dispatch]);

  const handleColumnReorder = useCallback(
    // Added boardId to the parameters
    (
      draggedColumnId: string,
      newPosition: number,
      currentBoardId: string
    ): void => {
      if (!currentBoardId) {
        // Use currentBoardId parameter
        console.warn("No boardId found for column reorder.");
        return;
      }
      // Dispatch the thunk with the necessary payload including boardId
      dispatch(
        updateColumnOrder({
          columnId: draggedColumnId,
          position: newPosition,
          boardId: currentBoardId, // Pass boardId here
        })
      );
    },
    [dispatch] // Only dispatch is needed as a dependency here. currentBoardId comes from the call.
  );

  const handleTaskReorder = useCallback(
    (updatedTasks: ITask[]): void => {
      if (!boardId) {
        console.warn("No boardId found for task reorder.");
        return;
      }
      // Assuming updateTaskOrder handles the backend call for tasks
      dispatch(updateTaskOrder({ boardId, tasks: updatedTasks }));
    },
    [boardId, dispatch]
  );

  return (
    <>
      {boardLoading ? (
        <div className="p-4 text-muted-foreground">Loading board...</div>
      ) : (
        <>
          <ProjectHeader
            title={currentBoard?.title || "Untitled"}
            description={currentBoard?.description || ""}
          />
          <KanbanBoard
            board={currentBoard} // Pass the board object
            initialColumns={columns}
            initialTasks={tasks}
            onColumnReorder={handleColumnReorder}
            onTaskReorder={handleTaskReorder}
          />
        </>
      )}
    </>
  );
}

export default function BoardPage() {
  return (
    <MainLayout>
      <BoardPageContent />
    </MainLayout>
  );
}
