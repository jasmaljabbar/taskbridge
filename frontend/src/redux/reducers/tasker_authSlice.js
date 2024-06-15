import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import tasker_authService from '../actions/tasker_authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  istasker: user ? user.isadmin : false,
  isSuccess: false,
  error: null,
};

export const tasker_register = createAsyncThunk(
  'tasker/tasker_register',
  async (taskerData, thunkAPI) => {
    try {
      return await tasker_authService.tasker_register(taskerData);
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


const tasker_authSlice = createSlice({
  name: 'tasker_auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tasker_register.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when starting a new request
      })
      .addCase(tasker_register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true; // Assuming registration implies being authenticated
        state.user = action.payload;
        state.isSuccess = true;
        localStorage.setItem('tasker', JSON.stringify(action.payload));
      })
      .addCase(tasker_register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
        state.isSuccess = false;
      })
     
  },
});

export default tasker_authSlice.reducer;
