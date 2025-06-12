import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface TaskHeaderProps {
  taskName: string;
  status: string;
  priority: string;
  onEditTaskName?: () => void; // Optional handler for editing task name
  onEditStatusPriority?: () => void; // Optional handler for editing status/priority
  onSaveChanges?: () => void; // Optional handler for saving changes
  onClose?: () => void; // Optional handler for closing the task details
}

export function TaskHeader({
  taskName,
  status,
  priority,
  onEditTaskName,
  onEditStatusPriority,
  onSaveChanges,
  onClose,
}: TaskHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      {/* Task Name and Edit Button */}
      <div className="flex items-center flex-grow">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-2 md:mr-4 flex-shrink-0">
          {taskName}
        </h1>
        {onEditTaskName && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditTaskName}
            className="text-gray-500 hover:text-gray-700 h-6 w-6 sm:h-8 sm:w-8"
            aria-label="Edit task name"
          >
            <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
      </div>

      {/* Status, Priority, Save, and Close Buttons */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Badge
          variant="secondary"
          className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md"
        >
          {status}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-red-200 text-red-700 px-3 py-1 text-sm rounded-md"
        >
          {priority}
        </Badge>
        {onEditStatusPriority && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditStatusPriority}
            className="text-gray-500 hover:text-gray-700 h-6 w-6 sm:h-8 sm:w-8"
            aria-label="Edit status and priority"
          >
            <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        {onSaveChanges && (
          <Button
            onClick={onSaveChanges}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Save Changes
          </Button>
        )}
        {onClose && (
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-md text-sm"
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
