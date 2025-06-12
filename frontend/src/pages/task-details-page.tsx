import { useParams } from "react-router-dom";
import MainLayout from "../components/main-layout";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../redux/store";
import { Skeleton } from "../components/ui/skeleton";
import { useEffect, useState } from "react";
import { setSelectedTask } from "../redux/slices/taskSlice";
import { TaskHeader } from "../components/task-header";
import { TaskDescription } from "../components/task-description";
import { TaskDetailsPanel } from "../components/task-details-panel";
import { getTaskById } from "../services/taskService";
import { TaskLabelsSection } from "../components/task-labels";

function TaskDetailsContent() {
  const { taskId } = useParams();
  const [task, setTask] = useState<any>();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchTask = async () => {
      if (taskId) {
        const fetchedTask = await getTaskById(taskId);
        console.log(fetchedTask);
        setTask(fetchedTask);
        dispatch(setSelectedTask(fetchedTask));
      }
    };
    fetchTask();
  }, [taskId, dispatch]);

  if (!task) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  return (
    <>
      <div className="flex min-h-screen bg-gray-100 p-8">
        {/* Main Content Area */}
        <div className="flex-1 max-w-3xl mr-8">
          {/* Task Header */}
          <TaskHeader
            taskName={task.title}
            status={task.status}
            priority={task.priority}
          />

          {/* Task Description */}
          <TaskDescription description={task.description} />
          <TaskLabelsSection labels={task.label} />
        </div>
        <div className="w-full lg:w-80 flex-shrink-0">
          {/* Task Details */}
          <TaskDetailsPanel
            project={task.project.title}
            board={task.board.title}
            column={task.column.name}
            createdBy={task.createdBy.name}
            createdAt={task.createdAt?.toString()}
            updatedAt={task.updatedAt?.toString()}
            onEditDetails={() => console.log("Edit Task Details")}
          />
          {/* ... other sidebar components */}
        </div>
      </div>
    </>
  );
}

export default function TaskDetailsPage() {
  return (
    <MainLayout>
      <TaskDetailsContent />
    </MainLayout>
  );
}
