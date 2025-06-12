import React from "react";
import styles from "./project-board-card.module.css"; // For status/priority tag colors
import type { IBoard } from "../types/board.types";
import { useNavigate } from "react-router-dom";

interface ProjectBoardCardProps {
  board: IBoard;
}

const ProjectBoardCard: React.FC<ProjectBoardCardProps> = ({ board }) => {
  const getStatusClass = (status: IBoard["status"]) => {
    switch (status) {
      case "active":
        return styles.statusActive;
      case "archived":
        return styles.statusArchived;
      default:
        return "";
    }
  };

  const getPriorityClass = (priority: IBoard["priority"]) => {
    switch (priority) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return ""; // Handle undefined or other priorities
    }
  };

  // Format date
  const formattedDeadline = board.deadline
    ? new Date(board.deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No deadline";
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/board/${board._id}`);
      }}
      className="cursor-pointer"
    >
      <div className="bg-card text-card-foreground rounded-lg p-5 shadow-sm hover:translate-y-[-3px] hover:shadow-md transition-transform duration-200 ease-in-out">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-semibold m-0 flex-grow">{board.title}</h4>
          <div className="flex gap-2">
            {board.status && (
              <span
                className={`${styles.statusTag} ${getStatusClass(
                  board.status
                )} capitalize`}
              >
                {board.status}
              </span>
            )}
            {board.priority && (
              <span
                className={`${styles.priorityTag} ${getPriorityClass(
                  board.priority
                )} capitalize`}
              >
                {board.priority}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {board.description}
        </p>
        <div className="flex items-center gap-4 flex-wrap mb-4">
          {/* {board.teamLead?.name && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="text-base">👤</span> {board.teamLead.name}
          </span>
        )} */}
          {board.members && board.members.length > 0 && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              {board.members.length} members
            </span>
          )}
          {board.deadline && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="text-base">🗓️</span> {formattedDeadline}
            </span>
          )}
          <span className="ml-auto text-xl text-primary font-bold">→</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {board.tags &&
            board.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-background text-foreground px-3 py-1 rounded-full text-xs border border-border"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectBoardCard;
