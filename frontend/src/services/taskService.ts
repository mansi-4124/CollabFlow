import axios from "../lib/axios";

interface UpdateTaskPositionPayload {
  _id: string;
  column: string;
  orderIndex: number;
}

export const getTasksByBoard = async (boardId: string) => {
  const response = await axios.get(`/task/board/${boardId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const updateTaskPositions = async (
  boardId: string,
  tasks: UpdateTaskPositionPayload[]
) => {
  const response = await axios.patch(
    `/task/reorder/${boardId}`,
    { tasks },
    { withCredentials: true }
  );
  return response.data;
};

export const getTaskById = async (taskId: string) => {
  const response = await axios.get(`task/${taskId}`, { withCredentials: true });
  return response.data;
};
