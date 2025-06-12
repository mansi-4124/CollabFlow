import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IUserSliceType {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface IUserState {
  user: IUserSliceType | null;
  isAuthenticated: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserSliceType>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
