import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const readAllContentsAsync = createAsyncThunk("content/readAll", async () => {
  try {
    const response = await axios.get(`/content`);
    return { contents: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const upsertContentAsync = createAsyncThunk(
  "content/upsert",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/content`, payload.content);
      return { content: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.errors);
    }
  }
);

export const deleteContentAsync = createAsyncThunk("/content/delete", async payload => {
  await axios.delete(`/content/${payload.content.id}`);
  return { id: payload.content.id };
});

export const getCollectionByPlatformAsync = createAsyncThunk(
  "/collection/getCollectionByPlatform",
  async payload => {
    const response = await axios.get(`/collection/${payload.PlatformId}`);
    return { collections: response.data };
  }
);

export const getVideoUrlByPartialNameAsync = createAsyncThunk(
  "content/getVideoUrlByPartialName",
  async payload => {
    try {
      const response = await axios.get(`/jw/${payload.partialName}`);
      return { data: response.data };
    } catch (error) {
      console.log(error);
    }
  }
);

export const contentSlice = createSlice({
  name: "content",
  initialState: {
    loading: true,
    error: null,
    contents: [],
    collections: [],
    currentContentUrl: null
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
    [readAllContentsAsync.pending]: state => {
      state.loading = true;
    },
    [readAllContentsAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.contents = action.payload.contents;
    },
    [readAllContentsAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    },
    [upsertContentAsync.pending]: state => {
      state.loading = true;
    },
    [upsertContentAsync.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.content[1]) {
        // insert
        if (action.payload.content[0]) state.contents.unshift(action.payload.content[0]);
      } else {
        // update
        state.contents = (state.contents || []).map(content =>
          content.id === action.payload.content[0].id ? action.payload.content[0] : content
        );
      }
    },
    [upsertContentAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = (action.payload || []).reduce((acc, error) => {
        acc[error.path] = `The ${error.path} field cannot be empty`;
        return acc;
      }, {});
    },
    [deleteContentAsync.pending]: state => {
      state.loading = true;
    },
    [deleteContentAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.contents = state.contents.filter(content => content.id !== action.payload.id);
    },
    [deleteContentAsync.rejected]: (state, action) => {
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
    },

    [getVideoUrlByPartialNameAsync.pending]: state => {
      state.loading = true;
    },
    [getVideoUrlByPartialNameAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.currentContentUrl = action.payload.data?.url || null;
    },
    [getVideoUrlByPartialNameAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    }
  }
});
export const { clearError, clearErrors } = contentSlice.actions;
export default contentSlice.reducer;
