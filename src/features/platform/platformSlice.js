import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const readAllPlatformsAsync = createAsyncThunk("platform/readAll", async payload => {
  try {
    const response = await axios.get(`/platform`);
    return { platforms: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const upsertPlatformAsync = createAsyncThunk(
  "platform/upsert",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/platform`, payload.platform);
      return { platform: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.errors);
    }
  }
);

export const deletePlatformAsync = createAsyncThunk("/platform/delete", async payload => {
  await axios.delete(`/platform/${payload.platform.id}`);
  return { id: payload.platform.id };
});

export const platformSlice = createSlice({
  name: "platform",
  initialState: {
    loading: true,
    error: null,
    platforms: []
  },
  reducers: {
    clearError: (state, action) => {
      if (state.error) state.error[action.payload.field] = null;
    },
    clearErrors: state => {
      state.error = null;
    }
  },
  extraReducers: {
    [readAllPlatformsAsync.pending]: state => {
      state.loading = true;
    },
    [readAllPlatformsAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.platforms = action.payload.platforms;
    },
    [readAllPlatformsAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    },
    [upsertPlatformAsync.pending]: state => {
      state.loading = true;
    },
    [upsertPlatformAsync.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.platform[1]) {
        // insert
        if (action.payload.platform[0]) state.platforms.unshift(action.payload.platform[0]);
      } else {
        // update
        state.platforms = (state.platforms || []).map(platform =>
          platform.id === action.payload.platform[0].id ? action.payload.platform[0] : platform
        );
      }
    },
    [upsertPlatformAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = (action.payload || []).reduce((acc, error) => {
        acc[error.path] = `The ${error.path} field cannot be empty`;
        return acc;
      }, {});
    },
    [deletePlatformAsync.pending]: state => {
      state.loading = true;
    },
    [deletePlatformAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.platforms = state.platforms.filter(platform => platform.id !== action.payload.id);
    },
    [deletePlatformAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    }
  }
});
export const { clearError, clearErrors } = platformSlice.actions;
export default platformSlice.reducer;
