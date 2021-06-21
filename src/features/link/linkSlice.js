import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const readAllLinksAsync = createAsyncThunk("link/readAll", async payload => {
  try {
    const response = await axios.get(`/link`);
    return { links: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const upsertLinkAsync = createAsyncThunk(
  "link/upsert",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/link`, payload.link);
      return { link: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.errors);
    }
  }
);

export const deleteLinkAsync = createAsyncThunk("/link/delete", async payload => {
  await axios.delete(`/link/${payload.link.id}`);
  return { id: payload.link.id };
});

export const getCollectionByPlatformAsync = createAsyncThunk(
  "/collection/getCollectionByPlatform",
  async payload => {
    const response = await axios.get(`/collection/${payload.PlatformId}`);
    return { collections: response.data };
  }
);

export const linkSlice = createSlice({
  name: "link",
  initialState: {
    loading: true,
    error: null,
    links: []
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
    [readAllLinksAsync.pending]: state => {
      state.loading = true;
    },
    [readAllLinksAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.links = action.payload.links;
    },
    [readAllLinksAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    },
    [upsertLinkAsync.pending]: state => {
      state.loading = true;
    },
    [upsertLinkAsync.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.link[1]) {
        // insert
        if (action.payload.link[0]) state.links.unshift(action.payload.link[0]);
      } else {
        // update
        state.links = (state.links || []).map(link =>
          link.id === action.payload.link[0].id ? action.payload.link[0] : link
        );
      }
    },
    [upsertLinkAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = (action.payload || []).reduce((acc, error) => {
        acc[error.path] = `The ${error.path} field cannot be empty`;
        return acc;
      }, {});
    },
    [deleteLinkAsync.pending]: state => {
      state.loading = true;
    },
    [deleteLinkAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.links = state.links.filter(link => link.id !== action.payload.id);
    },
    [deleteLinkAsync.rejected]: (state, action) => {
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
export const { clearError, clearErrors } = linkSlice.actions;
export default linkSlice.reducer;
