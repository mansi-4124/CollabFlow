import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getProjectDetails } from "../../services/projectService";
import type { IProject } from "../../types/project.types";

interface ProjectState {
  projects: IProject[];
  currentProject: IProject | null;
  loading: boolean;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
};

export const fetchProjectDetails = createAsyncThunk(
  "project/fetchProjectDetails",
  async (projectId: string) => {
    return await getProjectDetails(projectId);
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectsStore(state, action: PayloadAction<IProject[]>) {
      state.projects = action.payload;
    },
    addProject(state, action: PayloadAction<IProject>) {
      state.projects.push(action.payload);
    },
    setCurrentProject(state, action: PayloadAction<IProject>) {
      state.currentProject = action.payload;
    },
    setProjectLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setProjectsStore,
  addProject,
  setCurrentProject,
  setProjectLoading,
} = projectSlice.actions;

export default projectSlice.reducer;
