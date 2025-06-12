import { Pencil } from "lucide-react"; // Assuming lucide-react for icons
import { Card } from "./ui/card";
import { Button } from "./ui/button";

// Define props for TaskDescription component
interface TaskDescriptionProps {
  description: string;
  onEditDescription?: () => void; // Optional handler for editing description
}

export function TaskDescription({
  description,
  onEditDescription,
}: TaskDescriptionProps) {
  return (
    <Card className="p-5 mt-6 rounded-lg shadow-sm bg-white">
      {" "}
      {/* Decreased vertical padding to p-5 */}
      <div className="flex justify-between items-center border-b pb-3 border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Description</h2>
        {onEditDescription && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditDescription}
            className="text-gray-500 hover:text-gray-700 h-8 w-8 transition-colors duration-200"
            aria-label="Edit description"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-base text-gray-700 leading-relaxed">{description}</p>
    </Card>
  );
}
