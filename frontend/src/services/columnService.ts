import axios from "../lib/axios";
export const getColumnsByBoard = async (boardId: string) => {
  const response = await axios.get(`/column/board/${boardId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const updateColumnPositions = async (
  columnId: string,
  position: number
) => {
  const response = await axios.patch(
    `/column/reorder/${columnId}`,
    { position },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
