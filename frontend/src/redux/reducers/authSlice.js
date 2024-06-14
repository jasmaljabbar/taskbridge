import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../actions/authService';
import {jwtDecode} from "jwt-decode"

const user = JSON.parse(localStorage.getItem('user'));
const token = JSON.parse(localStorage.getItem('token'));
const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isLoading: false,
    isAuthenticated: !!user,
    isadmin: user ? user.isadmin : false,
    is_staff: user ? user.is_staff : false,
    isSuccess: false,
    token: token ? token : null,
    refreshToken: refreshToken ? refreshToken : null,
    message: '',
};

export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try {
        return await authService.login(user);
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) || 
                error.message ||
                error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const admin_login = createAsyncThunk("action/admin_login", async (user, thunkAPI) => {
    try {
        return await authService.admin_login(user);
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) || 
                error.message ||
                error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            await authService.logout();
            localStorage.removeItem('user');
            return true;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateToken(state, action) {
            state.token = action.payload;
            const updatedUser = { ...state.user, accessToken: action.payload };
            state.user = updatedUser;
            localStorage.setItem('user', JSON.stringify(updatedUser));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = action.payload;
                state.token = action.payload.access;
                state.refreshToken = action.payload.refresh;
                state.isSuccess = true;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.isSuccess = false;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(login.fulfilled, (state, action) => {
                const user = jwtDecode(action.payload.access)
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = user;
                state.token = action.payload.access;
                state.refreshToken = action.payload.refresh;
                // state.isSuccess = true;
                // state.isadmin = user.isadmin; 
                state.is_staff = user.is_staff;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', JSON.stringify(action.payload.access));
                localStorage.setItem('refreshToken', JSON.stringify(action.payload.refresh));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.isSuccess = false;
            })
            .addCase(admin_login.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(admin_login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = action.payload.access;
                state.isadmin = true;
                state.refreshToken = action.payload.refresh;
                state.isSuccess = true;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', JSON.stringify(action.payload.access));
                localStorage.setItem('refreshToken', JSON.stringify(action.payload.refresh));
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(admin_login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.isSuccess = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.refreshToken = null;
                state.user = null;
                state.isSuccess = true;
                state.isadmin = false; 
                localStorage.clear();
            })
            .addCase(logout.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
                state.isSuccess = false;
            });
    },
});

export const { updateToken } = authSlice.actions;
export default authSlice.reducer;
