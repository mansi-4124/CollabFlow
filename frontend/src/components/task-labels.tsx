import { Pencil } from "lucide-react"; // Assuming lucide-react for icons
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Define props for TaskLabelsSection component
interface TaskLabelsSectionProps {
  labels: string[]; // Now accepts an array of strings
  onEditLabels?: () => void; // Optional handler for editing labels
}

export function TaskLabelsSection({
  labels,
  onEditLabels,
}: TaskLabelsSectionProps) {
  return (
    <Card className="p-6 mt-6 rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center border-b pb-3 border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Labels</h2>
        {onEditLabels && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditLabels}
            className="text-gray-500 hover:text-gray-700 h-8 w-8 transition-colors duration-200"
            aria-label="Edit labels"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      {!labels ? (
        <div>No labels added</div>
      ) : (
        <div className="flex flex-wrap gap-2 mt-4">
          {labels.map((labelName, index) => (
            // Directly rendering Badge with a consistent gray color
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-800"
            >
              {labelName}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
