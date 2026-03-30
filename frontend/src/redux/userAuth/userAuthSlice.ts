import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  phone: string;
  email: string;
  firstName: string;
  role: string;
}

interface UserAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Get user from localStorage
const getUserFromLocalStorage = (): User | null => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const initialState: UserAuthState = {
  user: getUserFromLocalStorage(),
  loading: false,
  error: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setUser, logout, setLoading, setError, clearError } =
  userAuthSlice.actions;
export default userAuthSlice.reducer;
