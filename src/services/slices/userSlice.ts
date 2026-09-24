import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { TRegisterData, TLoginData } from '@api';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserState {
  data: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
  isSuccessRegistration: boolean;
}

const initialState: UserState = {
  data: null,
  isAuthChecked: false,
  loading: false,
  error: null,
  isSuccessRegistration: false
};

// --- Thunks ---

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (!response.success) return rejectWithValue('Ошибка регистрации');
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    } catch (err) {
      return rejectWithValue(
        (err as { message: string }).message || 'Ошибка регистрации'
      );
    }
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (!response.success) return rejectWithValue('Ошибка входа');
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    } catch (err) {
      return rejectWithValue(
        (err as { message: string }).message || 'Ошибка входа'
      );
    }
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (err) {
      return rejectWithValue(
        (err as { message: string }).message || 'Ошибка выхода'
      );
    }
  }
);

// Алиас для App.tsx, где вызывается dispatch(getUser())
export const getUser = createAsyncThunk<TUser, void>(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch {
      return rejectWithValue('Не авторизован');
    }
  }
);

// Алиас для App.tsx, где вызывается dispatch(getUser())
export const checkUserAuth = getUser;

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (err) {
      return rejectWithValue(
        (err as { message: string }).message || 'Ошибка обновления'
      );
    }
  }
);

// --- Slice ---

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccessRegistration = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check auth (getUser)
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.data = null;
        state.isAuthChecked = true;
      })
      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, setAuthChecked } = userSlice.actions;

// --- Селекторы ---

// Для ProtectedRoute
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.data;
export const selectIsAuthChecked = (state: { user: UserState }) =>
  state.user.isAuthChecked;

// Для App.tsx (алиасы)
export const selectUser = selectCurrentUser;
export const selectUserIsRequested = (state: { user: UserState }) =>
  state.user.loading;
export const selectIsSuccessRegistrarion = (state: { user: UserState }) =>
  state.user.isSuccessRegistration;

// Общие
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
