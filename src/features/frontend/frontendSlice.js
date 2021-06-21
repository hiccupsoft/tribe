import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getPlatformDataAsync = createAsyncThunk("frontend/getPlatformData", async payload => {
  try {
    const response = await axios.get(`/platform/${payload.subdomain}`);
    return { platformData: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const getPlatformDataByLiveDomainAsync = createAsyncThunk(
  "frontend/getPlatformDataByLiveDomain",
  async payload => {
    try {
      const response = await axios.get(`/platform/by-homepage-url/${payload.homepageUrl}`);
      return { platformData: response.data };
    } catch (error) {
      console.log(error);
    }
  }
);
export const resetPlatformTokensAsync = createAsyncThunk(
  "frontend/tokens",
  async (payload, rejectWithValue) => {
    try {
      const response = await axios.patch(`/platform/tokens/${payload.slug}`);
      return { tokens: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.errors);
    }
  }
);
export const getPlatformAnalyticsAsync = createAsyncThunk(
  "frontend/analytics",
  async (payload, payloadCreator) => {
    try {
      const { id } = payloadCreator.getState().frontend.platformData;
      // console.log(payloadCreator.getState().frontend.platformData);
      const response = await axios.get(`/platform/analytics/${id}`);
      return { ...response.data };
    } catch (error) {
      return payloadCreator.rejectWithValue(error.response.data.errors);
    }
  }
);

export const frontendSlice = createSlice({
  name: "FrontendCollections",
  initialState: {
    loading: true,
    error: null,
    platformData: {},
    platformByHomepageUrl: {},
    analytics: {}
  },
  reducers: {
    clearErrors: state => {
      state.error = null;
    }
  },
  extraReducers: {
    [getPlatformDataAsync.pending]: state => {
      state.loading = true;
    },
    [getPlatformDataAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.platformData = action.payload && action.payload.platformData;
      state.platformData.Collections = state.platformData.Collections.sort((a, b) => {
        if (a.position > b.position) return 1;
        if (a.position < b.position) return -1;
        return 0;
      });
    },
    [getPlatformDataAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getPlatformDataByLiveDomainAsync.pending]: state => {
      state.loading = true;
    },
    [getPlatformDataByLiveDomainAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.platformByHomepageUrl = action.payload && action.payload.platformData;
    },
    [getPlatformDataByLiveDomainAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [resetPlatformTokensAsync.pending]: state => {
      state.loading = true;
    },
    [resetPlatformTokensAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.platformData.basicToken = action.payload.tokens.basicToken;
      state.platformData.premiumToken = action.payload.tokens.premiumToken;
    },
    [getPlatformAnalyticsAsync.pending]: state => {
      state.loading = true;
    },
    [getPlatformAnalyticsAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.analytics = action.payload;
    }
  }
});
export const { clearErrors } = frontendSlice.actions;
export default frontendSlice.reducer;
