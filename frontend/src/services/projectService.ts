import axios from "../lib/axios";



export const addProject = async (projectData: any) => {
  const response = await axios.post("/project", projectData, {
    withCredentials: true,
  });
  return response.data;
};

export const getProjectDetails = async (projectId: string) => {
  const response = await axios.get(`/project/${projectId}`, {
    withCredentials: true,
  });
  return response.data;
};
