import { Button } from "./ui/button";

interface ProjectHeaderProps {
  title: string;
  description: string;
  //onEditProject: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  description,
  //onEditProject,
}) => {
  return (
    <header className="flex justify-between items-start bg-primary text-primary-foreground p-5 rounded-lg mb-5">
      <div className="flex-grow">
        <h1 className="text-3xl font-semibold mb-2">{title}</h1>
        <p className="text-md opacity-90">{description}</p>
      </div>
      {/* <Button>Edit</Button> */}
    </header>
  );
};

export default ProjectHeader;
