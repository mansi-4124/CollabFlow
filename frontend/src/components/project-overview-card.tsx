import React from "react";
import styles from "./project-overview-card.module.css";
interface ProjectOverviewCardProps {
  category: string;
  status: string;
  priority: string;
  deadline: string | undefined;
  tags: string[] | undefined;
}

const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({
  category,
  status,
  priority,
  deadline,
  tags,
}) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return styles.statusInProgress;
      case "completed":
        return styles.statusCompleted;
      case "on hold":
        return styles.statusOnHold;
      default:
        return "";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return "";
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
        Project Overview
      </h2>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Category</span>
          <span
            className={`${styles.tagBase} bg-secondary text-secondary-foreground`}
          >
            {category}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Status</span>
          <span className={`${styles.tagBase} ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Priority</span>
          <span
            className={`text-base font-medium ${getPriorityClass(priority)}`}
          >
            {priority}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Deadline</span>
          <span className="text-base font-medium">
            {" "}
            {deadline != undefined ? deadline.substring(0, 10) : "No deadline"}
          </span>
        </div>
      </div>
      <div>
        <span className="text-sm text-muted-foreground">Tags</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-background text-foreground px-3 py-1 rounded-full text-sm border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectOverviewCard;
