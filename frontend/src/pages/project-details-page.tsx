import { useParams } from "react-router-dom";
import MainLayout from "../components/main-layout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setBoardLoading, setBoards } from "../redux/slices/boardSlice";
import { getProjectBoards } from "../services/boardService";
import { fetchProjectDetails } from "../redux/slices/projectSlice";
import { type AppDispatch, type RootState } from "../redux/store";
import ProjectHeader from "../components/project-header";
import ProjectOverviewCard from "../components/project-overview-card";
import TeamMembersCard from "../components/team-members-card";
import ProjectBoardsSection from "../components/project-board-section";

function ProjectDetailsContent() {
  const { projectId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject } = useSelector((state: RootState) => state.project);
  const { boards } = useSelector((state: RootState) => state.board);

  const fetchBoards = async () => {
    dispatch(setBoardLoading(true));
    const boards = await getProjectBoards(projectId as string);
    dispatch(setBoards(boards));
    dispatch(setBoardLoading(false));
    if (projectId) dispatch(fetchProjectDetails(projectId));
  };

  const refreshBoards = async () => await fetchBoards();
  useEffect(() => {
    fetchBoards();
  }, [projectId]);
  const members = [
    {
      name: "Mansi Shintre",
      role: "Owner",
      isOwner: true,
    },
    {
      name: "Pallavi Shintre",
      role: "Team Lead",
      isLead: true,
    },
  ];
  return (
    <>
      <ProjectHeader
        title={currentProject?.title as string}
        description={currentProject?.description as string}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-5">
          <ProjectOverviewCard
            category={currentProject?.category as string}
            status={currentProject?.status as string}
            priority={currentProject?.priority as string}
            deadline={currentProject?.deadline?.toString()}
            tags={currentProject?.tags}
          />
          <ProjectBoardsSection boards={boards} refreshBoards={refreshBoards} />
        </div>
        <div className="col-span-1 flex flex-col gap-5">
          <TeamMembersCard members={members} />
        </div>
      </div>
    </>
  );
}

export default function ProjectDetailsPage() {
  return (
    <>
      <MainLayout>
        <ProjectDetailsContent />
      </MainLayout>
    </>
  );
}
