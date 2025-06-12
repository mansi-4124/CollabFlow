import { Pencil } from "lucide-react"; // Assuming lucide-react for icons
import { Card } from "./ui/card";
import { Button } from "./ui/button";

// Define props for TaskDetailsPanel component
interface TaskDetailsPanelProps {
  project: string;
  board: string;
  column: string;
  createdBy: string;
  createdAt: string | undefined;
  updatedAt: string | undefined;
  onEditDetails?: () => void; // Optional handler for editing task details
}

export function TaskDetailsPanel({
  project,
  board,
  column,
  createdBy,
  createdAt,
  updatedAt,
  onEditDetails,
}: TaskDetailsPanelProps) {
  return (
    <Card className="p-6 rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center border-b pb-3 border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Task Details</h2>
        {onEditDetails && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditDetails}
            className="text-gray-500 hover:text-gray-700 h-8 w-8 transition-colors duration-200"
            aria-label="Edit task details"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-y-3 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">Project:</span> {project}
        </p>
        <p>
          <span className="font-medium text-gray-900">Board:</span> {board}
        </p>
        <p>
          <span className="font-medium text-gray-900">Column:</span> {column}
        </p>
        <p>
          <span className="font-medium text-gray-900">Created By:</span>{" "}
          {createdBy}
        </p>
        <p>
          <span className="font-medium text-gray-900">Created At:</span>{" "}
          {createdAt?.substring(0, 10)}
        </p>
        <p>
          <span className="font-medium text-gray-900">Updated At:</span>{" "}
          {updatedAt?.substring(0, 10)}
        </p>
      </div>
    </Card>
  );
}
