import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getBoardById } from "../../services/boardService";
import type { IBoard } from "../../types/board.types";

interface BoardState {
  boards: IBoard[];
  currentBoard: IBoard | null;
  loading: boolean;
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: false,
};

export const fetchBoardById = createAsyncThunk(
  "board/fetchBoardById",
  async (boardId: string, thunkAPI) => {
    try {
      const data = await getBoardById(boardId);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoards(state, action: PayloadAction<IBoard[]>) {
      state.boards = action.payload;
    },
    addBoard(state, action: PayloadAction<IBoard>) {
      state.boards.push(action.payload);
    },
    setCurrentBoard(state, action: PayloadAction<IBoard>) {
      state.currentBoard = action.payload;
    },
    updateCurrentBoard(state, action: PayloadAction<Partial<IBoard>>) {
      if (state.currentBoard) {
        state.currentBoard = {
          ...state.currentBoard,
          ...action.payload,
        };
      }
    },
    setBoardLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetBoards(state) {
      state.boards = [];
      state.currentBoard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardById.pending, (state) => {
        state.loading = true;
        state.currentBoard = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state) => {
        state.loading = false;
        state.currentBoard = null;
      });
  },
});

export const {
  setBoards,
  addBoard,
  setCurrentBoard,
  updateCurrentBoard,
  setBoardLoading,
  resetBoards,
} = boardSlice.actions;

export default boardSlice.reducer;
