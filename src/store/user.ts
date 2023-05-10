import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {User} from 'types';

interface UserState {
  user?: User;
}

const initialState = {user: undefined} as UserState;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    removeUser(state) {
      state.user = undefined;
    },
  },
});

export const {setUser, removeUser} = userSlice.actions;

export default userSlice.reducer;
