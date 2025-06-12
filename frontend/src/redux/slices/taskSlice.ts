import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ITask } from "../../types/task.types";
import {
  getTaskById,
  getTasksByBoard,
  updateTaskPositions,
} from "../../services/taskService";

interface TaskState {
  tasks: ITask[];
  selectedTask: ITask | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
};

export const fetchTasksByBoardId = createAsyncThunk(
  "task/fetchTasksByBoardId",
  async (boardId: string, thunkAPI) => {
    try {
      const data = await getTasksByBoard(boardId);
      return data
        .map((task: any) => ({
          ...task,
          column:
            typeof task.column === "object" && task.column !== null
              ? task.column._id
              : task.column,
        }))
        .sort((a: ITask, b: ITask) => a.orderIndex - b.orderIndex);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const updateTaskOrder = createAsyncThunk(
  "task/updateTaskOrder",
  async ({ boardId, tasks }: { boardId: string; tasks: ITask[] }, thunkAPI) => {
    try {
      const payload = tasks.map((task) => ({
        _id: task._id,
        column: task.column,
        orderIndex: task.orderIndex,
      }));

      await updateTaskPositions(boardId, payload);

      return tasks;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update task order";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "task/fetchTaskById",
  async (taskId: string, thunkAPI) => {
    try {
      const task = await getTaskById(taskId);
      return {
        ...task,
        column:
          typeof task.column === "object" && task.column !== null
            ? task.column._id
            : task.column,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<ITask[]>) {
      state.tasks = action.payload;
    },
    setSelectedTask(state, action: PayloadAction<ITask | null>) {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByBoardId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByBoardId.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByBoardId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTaskOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(
        updateTaskOrder.fulfilled,
        (state, action: PayloadAction<ITask[]>) => {
          state.loading = false;
          state.tasks = action.payload;
        }
      )
      .addCase(updateTaskOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTaskById.fulfilled,
        (state, action: PayloadAction<ITask>) => {
          state.loading = false;
          state.selectedTask = action.payload;
        }
      )
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTasks, setSelectedTask } = taskSlice.actions;

export default taskSlice.reducer;
