import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isLoggedIn: boolean;
  role: "admin" | "user" | null;
  name: string | null;
  loading: boolean;
  error: string | null;
}

const savedRole = localStorage.getItem("role");
const savedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const savedName = localStorage.getItem("name");

const initialState: AuthState = {
  isLoggedIn: savedIsLoggedIn || false,
  role:
    savedRole === "admin" || savedRole === "user"
      ? (savedRole as "admin" | "user")
      : null,
  name: savedName || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { role: "admin" | "user"; name: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) return rejectWithValue("Invalid credentials");

  if (email === "admin" && password === "admin") {
    return { role: "admin", name: "Admin" };
  } else {
    const namePart = email.split("@")[0];
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    return { role: "user", name: capitalized };
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.role = null;
      state.name = null;
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("name");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{ role: "admin" | "user"; name: string }>
        ) => {
          state.loading = false;
          state.isLoggedIn = true;
          state.role = action.payload.role;
          state.name = action.payload.name;
          localStorage.setItem("role", action.payload.role);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("name", action.payload.name);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
