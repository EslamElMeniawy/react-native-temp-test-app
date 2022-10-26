import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ErrorDialogState {
  errorDialogTitle?: string;
  errorDialogMessage?: string;
}

const initialState = {
  errorDialogTitle: undefined,
  errorDialogMessage: undefined,
} as ErrorDialogState;

export const errorDialogSlice = createSlice({
  name: 'errorDialog',
  initialState,
  reducers: {
    setErrorDialogMessage(state, action: PayloadAction<string>) {
      state.errorDialogTitle = undefined;
      state.errorDialogMessage = action.payload;
    },
    setErrorDialogTitleMessage(
      state,
      action: PayloadAction<{title: string; message: string}>,
    ) {
      state.errorDialogTitle = action.payload.title;
      state.errorDialogMessage = action.payload.message;
    },
    removeErrorDialogMessage(state) {
      state.errorDialogTitle = undefined;
      state.errorDialogMessage = undefined;
    },
  },
});

export const {
  setErrorDialogMessage,
  setErrorDialogTitleMessage,
  removeErrorDialogMessage,
} = errorDialogSlice.actions;

export default errorDialogSlice.reducer;
