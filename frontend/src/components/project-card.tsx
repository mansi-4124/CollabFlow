import { StarIcon } from "lucide-react";
import type { IProject } from "../types/project.types";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "../redux/slices/projectSlice";

interface IProjectProps {
  project: IProject;
  isStarred: boolean | undefined;
}

function ProjectCard({ project, isStarred }: IProjectProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <div
        onClick={() => {
          dispatch(setCurrentProject(project));
          navigate(`/project/${project._id}`);
        }}
        className="cursor-pointer"
      >
        <Card key={project._id} className="relative h-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {project.title}
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-400 hover:bg-transparent"
              >
                <StarIcon fill={isStarred ? "#facc15" : "none"} />
              </Button>
            </CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Created: {new Date(project.createdAt ?? "").toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              {/*(project.members ?? []).slice(0, 4).map((member, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="w-6 h-6 border-2 border-background">
                      <AvatarImage
                        src={member.user.avatar}
                        alt={member.user.name}
                      />
                      <AvatarFallback>
                        {member.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{member.user.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))*/}
              {project.members && project.members.length > 4 && (
                <Avatar className="w-6 h-6 text-xs">
                  +{project.members.length - 4}
                </Avatar>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {(project.tags ?? []).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.deadline && (
              <div className="text-sm text-red-500">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ProjectCard;
