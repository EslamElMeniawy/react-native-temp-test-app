import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface NetworkStateState {
  isInternetAvailable?: boolean;
  isConnectionExpensive?: boolean;
}

const initialState = {
  isInternetAvailable: true,
  isConnectionExpensive: false,
} as NetworkStateState;

export const networkStateSlice = createSlice({
  name: 'networkState',
  initialState,
  reducers: {
    setIsInternetAvailable(state, action: PayloadAction<boolean>) {
      state.isInternetAvailable = action.payload;
    },
    setIsConnectionExpensive(state, action: PayloadAction<boolean>) {
      state.isConnectionExpensive = action.payload;
    },
    removeIsConnectionExpensive(state) {
      state.isConnectionExpensive = undefined;
    },
  },
});

export const {
  setIsInternetAvailable,
  setIsConnectionExpensive,
  removeIsConnectionExpensive,
} = networkStateSlice.actions;

export default networkStateSlice.reducer;
