import axios from "../lib/axios";

export const getProjectBoards = async (projectId: string) => {
  const response = await axios.get(`/board/project/${projectId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const addBoard = async (data: any) => {
  const response = await axios.post(`/board`, data, { withCredentials: true });
  return response.data;
};

export const getBoardById = async (boardId: string) => {
  const response = await axios.get(`/board/${boardId}`, {
    withCredentials: true,
  });
  return response.data;
};
