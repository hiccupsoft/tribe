import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const uploadFileAsync = createAsyncThunk("uploader/upload", async payload => {
  const formData = new FormData();
  var image = document.getElementById(payload.id);
  formData.append("image", image.files[0]);
  const response = await axios.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
});

export const uploaderSlice = createSlice({
  name: "uploader",
  initialState: {
    loading: false,
    error: null,
    latestUploadedFileUrl: null
  },
  reducers: {
    deleteFile: state => {
      state.latestUploadedFileUrl = null;
    }
  },
  extraReducers: {
    [uploadFileAsync.pending]: state => {
      state.loading = true;
    },
    [uploadFileAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.latestUploadedFileUrl = action.payload.latestUploadedFileUrl;
    },
    [uploadFileAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = "Error uploading file";
    }
  }
});

export const { deleteFile } = uploaderSlice.actions;
export default uploaderSlice.reducer;
