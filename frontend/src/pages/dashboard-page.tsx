import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../components/main-layout";
import { useEffect, useState } from "react";
import type { IProject } from "../types/project.types";
import ProjectCard from "../components/project-card";
import AddProjectForm from "../components/add-project-form";
import {
  setProjectLoading,
  setProjectsStore,
} from "../redux/slices/projectSlice";
import { getUserProjects } from "../services/authService";
import type { RootState } from "../redux/store";

function DashboardContent() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [projects, setProjects] = useState<IProject[]>([]);
  const fetchProjects = async () => {
    try {
      dispatch(setProjectLoading(true));
      const res = await getUserProjects();
      setProjects(res.data);
      dispatch(setProjectsStore(res.data));
      dispatch(setProjectLoading(false));
    } catch (error) {
      console.log("Failed to fetch projects");
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const isStarred = (project: IProject) =>
    project.starredBy?.includes(user?.id as string);
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div className="flex items-center justify-between p-6">
          <AddProjectForm refreshProjects={fetchProjects} />
        </div>
      </div>
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(projects) &&
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isStarred={isStarred(project)}
            />
          ))}
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <div className="flex h-screen flex-col">
      <MainLayout>
        <DashboardContent />
      </MainLayout>
    </div>
  );
}
