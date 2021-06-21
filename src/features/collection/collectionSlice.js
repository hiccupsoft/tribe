import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const readAllCollectionsAsync = createAsyncThunk("collection/readAll", async payload => {
  try {
    const response = await axios.get(`/collection`);
    return { collections: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const upsertCollectionAsync = createAsyncThunk(
  "collection/upsert",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/collection`, payload.collection);
      return { collection: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.errors);
    }
  }
);

export const deleteCollectionAsync = createAsyncThunk("/collection/delete", async payload => {
  await axios.delete(`/collection/${payload.collection.id}`);
  return { id: payload.collection.id };
});

export const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    loading: true,
    error: null,
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
    [readAllCollectionsAsync.pending]: state => {
      state.loading = true;
    },
    [readAllCollectionsAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.collections = action.payload.collections;
    },
    [readAllCollectionsAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    },
    [upsertCollectionAsync.pending]: state => {
      state.loading = true;
    },
    [upsertCollectionAsync.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.collection[1]) {
        // insert
        if (action.payload.collection[0]) state.collections.unshift(action.payload.collection[0]);
      } else {
        // update
        state.collections = (state.collections || []).map(collection =>
          collection.id === action.payload.collection[0].id
            ? action.payload.collection[0]
            : collection
        );
      }
    },
    [upsertCollectionAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = (action.payload || []).reduce((acc, error) => {
        acc[error.path] = `The ${error.path} field cannot be empty`;
        return acc;
      }, {});
    },
    [deleteCollectionAsync.pending]: state => {
      state.loading = true;
    },
    [deleteCollectionAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.collections = state.collections.filter(
        collection => collection.id !== action.payload.id
      );
    },
    [deleteCollectionAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    }
  }
});
export const { clearError, clearErrors } = collectionSlice.actions;
export default collectionSlice.reducer;
