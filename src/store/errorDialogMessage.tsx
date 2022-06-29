import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ErrorDialogMessageState {
  errorDialogMessage?: string;
}

const initialState = {errorDialogMessage: undefined} as ErrorDialogMessageState;

export const errorDialogMessageSlice = createSlice({
  name: 'errorDialogMessage',
  initialState,
  reducers: {
    setErrorDialogMessage(state, action: PayloadAction<string>) {
      state.errorDialogMessage = action.payload;
    },
    removeErrorDialogMessage(state) {
      state.errorDialogMessage = undefined;
    },
  },
});

export const {setErrorDialogMessage, removeErrorDialogMessage} =
  errorDialogMessageSlice.actions;

export default errorDialogMessageSlice.reducer;
