import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const readAllAdsAsync = createAsyncThunk("ad/readAll", async payload => {
  try {
    const response = await axios.get(`/ad`);
    return { ads: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const upsertAdAsync = createAsyncThunk("ad/upsert", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/ad`, payload.ad);
    return { ad: response.data };
  } catch (error) {
    return rejectWithValue(error.response.data.errors);
  }
});

export const deleteAdAsync = createAsyncThunk("/ad/delete", async payload => {
  await axios.delete(`/ad/${payload.ad.id}`);
  return { id: payload.ad.id };
});

export const getCollectionByPlatformAsync = createAsyncThunk(
  "/collection/getCollectionByPlatform",
  async payload => {
    const response = await axios.get(`/collection/${payload.PlatformId}`);
    return { collections: response.data };
  }
);

export const adSlice = createSlice({
  name: "ad",
  initialState: {
    loading: true,
    error: null,
    ads: [],
    collections: []
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
    [readAllAdsAsync.pending]: state => {
      state.loading = true;
    },
    [readAllAdsAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.ads = action.payload.ads;
    },
    [readAllAdsAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    },
    [upsertAdAsync.pending]: state => {
      state.loading = true;
    },
    [upsertAdAsync.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.ad[1]) {
        // insert
        if (action.payload.ad[0]) state.ads.unshift(action.payload.ad[0]);
      } else {
        // update
        state.ads = (state.ads || []).map(ad =>
          ad.id === action.payload.ad[0].id ? action.payload.ad[0] : ad
        );
      }
    },
    [upsertAdAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = (action.payload || []).reduce((acc, error) => {
        acc[error.path] = `The ${error.path} field cannot be empty`;
        return acc;
      }, {});
    },
    [deleteAdAsync.pending]: state => {
      state.loading = true;
    },
    [deleteAdAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.ads = state.ads.filter(ad => ad.id !== action.payload.id);
    },
    [deleteAdAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getCollectionByPlatformAsync.pending]: state => {
      state.loading = true;
    },
    [getCollectionByPlatformAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.collections = action.payload.collections;
    },
    [getCollectionByPlatformAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    }
  }
});
export const { clearError, clearErrors } = adSlice.actions;
export default adSlice.reducer;
