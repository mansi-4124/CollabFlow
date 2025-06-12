// frontend/src/redux/slices/columnSlice.ts

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { IColumn } from "../../types/column.types";
import {
  getColumnsByBoard, // Assuming this fetches columns from your backend
  updateColumnPositions, // This is the service call to your new backend reorder endpoint
} from "../../services/columnService"; // Correct path to your columnService file

// Remove this line. useDispatch can only be used inside React components.
// const dispatch = useDispatch();

interface ColumnState {
  columns: IColumn[];
  loading: boolean;
  error: string | null;
}

const initialState: ColumnState = {
  columns: [],
  loading: false,
  error: null,
};

export const fetchColumnsByBoard = createAsyncThunk(
  "column/fetchColumnsByBoard",
  async (boardId: string, thunkAPI) => {
    try {
      const data = await getColumnsByBoard(boardId);
      // Ensure data is sorted by position before returning to keep consistency
      return data.sort((a: IColumn, b: IColumn) => a.position - b.position);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch columns"
      );
    }
  }
);

export const updateColumnOrder = createAsyncThunk(
  "column/updateColumnOrder",
  async (
    // Add boardId to the payload so we can re-fetch columns for this board
    { columnId, position, boardId }: { columnId: string; position: number; boardId: string },
    { rejectWithValue, dispatch } // Destructure dispatch from thunkAPI for calling other thunks
  ) => {
    try {
      // Call the backend service to update the column's position
      await updateColumnPositions(columnId, position);

      // After a successful backend update, re-fetch all columns for this board.
      // This is crucial to ensure the frontend state is synchronized with the backend's
      // definitive re-indexed order.
      dispatch(fetchColumnsByBoard(boardId));

      // Return a minimal payload indicating success for this specific thunk
      return { columnId, position };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update column order";

      // IMPORTANT: If the backend update fails, you might want to re-fetch
      // the columns here as well to revert any optimistic UI updates.
      // Example: dispatch(fetchColumnsByBoard(boardId)); // This would revert on error
      return rejectWithValue(errorMessage);
    }
  }
);

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    // Reducers for direct state manipulation (not for async operations)
    setColumns(state, action: PayloadAction<IColumn[]>) {
      state.columns = action.payload;
    },
    addColumn(state, action: PayloadAction<IColumn>) {
      // Ensure new column is added at the correct position
      const newColumn = action.payload;
      if (newColumn.position !== undefined) {
        state.columns.splice(newColumn.position, 0, newColumn);
      } else {
        state.columns.push(newColumn); // Fallback if position is missing
      }
      // Re-sort to maintain order integrity if positions are critical
      state.columns.sort((a, b) => a.position - b.position);
    },
    resetColumns(state) {
      state.columns = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handlers for fetching columns
      .addCase(fetchColumnsByBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColumnsByBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.columns = action.payload; // Payload is the sorted IColumn[] from API
      })
      .addCase(fetchColumnsByBoard.rejected, (state, action) => {
        state.loading = false;
        state.columns = []; // Clear columns on error
        state.error = action.payload as string;
      })
      // Handlers for updating column order
      .addCase(updateColumnOrder.pending, (state) => {
        state.error = null; // Clear previous errors, possibly set a specific loading state
      })
      .addCase(
        updateColumnOrder.fulfilled,
        (state, action: PayloadAction<{ columnId: string; position: number }>) => {
          // No direct state update to `state.columns` here.
          // The `fetchColumnsByBoard` thunk (dispatched inside `updateColumnOrder`)
          // will handle the actual update to `state.columns` when it fulfills.
          console.log(`Column ${action.payload.columnId} reorder initiated. Columns will re-fetch.`);
        }
      )
      .addCase(updateColumnOrder.rejected, (state, action) => {
        state.error = action.payload as string;
        // If an optimistic update was performed on the UI, and the backend call fails,
        // you might want to re-fetch the correct state from the backend to revert the UI.
        // The `fetchColumnsByBoard(boardId)` in the `catch` block of the thunk would handle this.
      });
  },
});

export const { setColumns, addColumn, resetColumns } = columnSlice.actions;

export default columnSlice.reducer;