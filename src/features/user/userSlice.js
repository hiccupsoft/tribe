import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const readAllUsersAsync = createAsyncThunk("user/readAll", async payload => {
  try {
    const response = await axios.get(`/user`);
    return { users: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const upsertUserAsync = createAsyncThunk(
  "user/upsert",
  async (payload, { rejectWithValue }) => {
    try {
      let response;
      if (payload.PlatformId) {
        response = await axios.post(`/user`, {
          ...payload.user,
          PlatformId: payload.PlatformId
        });
      } else {
        response = await axios.post(`/user`, {
          ...payload.user
        });
      }
      return { user: response.data };
    } catch (error) {
      if ("string" === typeof error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.response.data.errors);
      }
    }
  }
);

export const deleteUserAsync = createAsyncThunk("/user/delete", async payload => {
  await axios.delete(`/user/${payload.user.id}`);
  return { id: payload.user.id };
});

export const getUsersCSVAsync = createAsyncThunk("user/csv", async (payload, extra) => {
  //const { filters, sorting } = extra.getState().seller;

  const response = await axios({
    url: "/user/export",
    method: "GET",
    responseType: "blob" // important
    //params: { filters, sorting },
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "users.csv");
  document.body.appendChild(link);
  link.click();

  //return response.data;
});

export const getAdminsAsync = createAsyncThunk("user/getAdmins", async payload => {
  try {
    const response = await axios.get(`/user/admins`, {
      params: { PlatformId: payload.PlatformId }
    });
    return { users: response.data };
  } catch (error) {
    console.log(error);
  }
});

export const banUserAsync = createAsyncThunk("/user/ban", async payload => {
  await axios.delete(`/user/ban/${payload.id}`);
  return { id: payload.id };
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    error: null,
    generalError: null,
    users: [],
    admins: []
  },
  reducers: {
    clearError: (state, action) => {
      if (state.error) state.error[action.payload.field] = null;
    },
    clearErrors: state => {
      state.error = null;
      state.generalError = null;
    }
  },
  extraReducers: {
    [readAllUsersAsync.pending]: state => {
      state.loading = true;
    },
    [readAllUsersAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
    },
    [readAllUsersAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    },
    [upsertUserAsync.pending]: state => {
      state.loading = true;
    },
    [upsertUserAsync.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.user[1]) {
        // insert
        if (action.payload.user[0]) state.users.unshift(action.payload.user[0]);
      } else {
        // update
        state.users = (state.users || []).map(user =>
          user.id === action.payload.user[0].id ? action.payload.user[0] : user
        );
      }
    },
    [upsertUserAsync.rejected]: (state, action) => {
      state.loading = false;
      if ("string" === typeof action.payload) {
        state.generalError = action.payload;
      } else {
        state.error = (action.payload || []).reduce((acc, error) => {
          acc[error.path] = `The ${error.path} field cannot be empty`;
          return acc;
        }, {});
      }
    },
    [deleteUserAsync.pending]: state => {
      state.loading = true;
    },
    [deleteUserAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = state.users.filter(user => user.id !== action.payload.id);
    },
    [deleteUserAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getAdminsAsync.pending]: state => {
      state.loading = true;
    },
    [getAdminsAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.admins = action.payload.users;
    },
    [getAdminsAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    },
    [banUserAsync.pending]: state => {
      state.loading = true;
    },
    [banUserAsync.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [banUserAsync.rejected]: (state, action) => {
      state.loading = false;
      //state.error = action.error;
    }
  }
});
export const { clearError, clearErrors } = userSlice.actions;
export default userSlice.reducer;
