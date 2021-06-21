import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const readManyChatMessagesAsync = createAsyncThunk("chat/readMany", async payload => {
  try {
    const response = await axios.get(`/chat/${payload.contentId}`);
    return { chatMessages: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const postChatMessageAsync = createAsyncThunk("chat/upsert", async payload => {
  try {
    const response = await axios.post(`/chat`, payload);
    return { chatMessage: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const deleteChatMessageAsync = createAsyncThunk("/chat/delete", async payload => {
  try {
    // delete as true = delete, delete as false = undelete
    await axios.delete(`/chat/${payload.id}/${payload.delete}`);
    return { id: payload.id };
  } catch (error) {
    console.log(error);
  }
});

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    loading: true,
    error: null,
    chatMessages: []
  },
  reducers: {},
  extraReducers: {
    [readManyChatMessagesAsync.pending]: state => {
      state.loading = true;
    },
    [readManyChatMessagesAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.chatMessages = action.payload.chatMessages;
    },
    [readManyChatMessagesAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    },
    [postChatMessageAsync.pending]: state => {
      state.loading = true;
    },
    [postChatMessageAsync.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [postChatMessageAsync.rejected]: state => {
      state.loading = false;
      console.log("postChatMessageAsync rejected");
    },
    [deleteChatMessageAsync.pending]: state => {
      state.loading = true;
    },
    [deleteChatMessageAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.chatMessages = state.chatMessages?.filter(cm => cm.id !== action.payload.id);
    },
    [deleteChatMessageAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    }
  }
});
export default chatSlice.reducer;
