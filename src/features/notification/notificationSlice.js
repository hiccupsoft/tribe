import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    showing: false,
    icon: null,
    type: null,
    title: null,
    details: null
  },
  reducers: {
    setNotificationShowing: (state, action) => {
      state.showing = action.payload;
    },
    setNotificationState: (state, action) => {
      for (const prop in action.payload) {
        state[prop] = action.payload[prop];
      }
    }
  }
});

export const { setNotificationShowing, setNotificationState } = notificationSlice.actions;

export const flashNotificationAsync = () => dispatch => {
  dispatch(setNotificationShowing(true));
  setTimeout(() => {
    dispatch(setNotificationShowing(false));
  }, 5000);
};
export const flashDetailedNotificationAsync = (
  payload = {
    showing: false,
    icon: null,
    type: null,
    title: null,
    details: null
  }
) => dispatch => {
  dispatch(setNotificationState({ showing: true, ...payload }));
  setTimeout(() => {
    dispatch(
      setNotificationState({
        icon: null,
        type: null,
        title: null,
        details: null,
        showing: false
      })
    );
  }, 5000);
};

export default notificationSlice.reducer;
