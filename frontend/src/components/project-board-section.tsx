import type { IBoard } from "../types/board.types";
import AddBoardForm from "./add-board-form";
import ProjectBoardCard from "./project-board-card";

interface ProjectBoardsSectionProps {
  boards: IBoard[];
  refreshBoards: () => void;
}

const ProjectBoardsSection: React.FC<ProjectBoardsSectionProps> = ({
  boards,
  refreshBoards,
}) => {
  return (
    <section className="bg-card text-card-foreground rounded-lg p-5 shadow-sm flex-grow">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold flex items-center gap-3">
          Project Boards
        </h2>
        <AddBoardForm refreshBoards={refreshBoards} />
      </div>
      <div className="grid grid-cols-1 gap-5">
        {boards.length > 0 ? (
          boards.map((board) => (
            <ProjectBoardCard key={board._id} board={board} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-10">
            No boards available for this project. Click "Add Board" to create
            one!
          </p>
        )}
      </div>
    </section>
  );
};

export default ProjectBoardsSection;
