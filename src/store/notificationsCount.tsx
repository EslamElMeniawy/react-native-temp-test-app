import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface NotificationsCountState {
  notificationsCount?: number;
}

const initialState = {notificationsCount: undefined} as NotificationsCountState;

export const notificationsCountSlice = createSlice({
  name: 'notificationsCount',
  initialState,
  reducers: {
    setNotificationsCount(state, action: PayloadAction<number>) {
      state.notificationsCount = action.payload;
    },
    removeNotificationsCount(state) {
      state.notificationsCount = undefined;
    },
  },
});

export const {setNotificationsCount, removeNotificationsCount} =
  notificationsCountSlice.actions;

export default notificationsCountSlice.reducer;
