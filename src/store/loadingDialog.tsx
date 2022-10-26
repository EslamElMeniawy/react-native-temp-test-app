import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LoadingDialogState {
  showLoadingDialog?: boolean;
}

const initialState = {showLoadingDialog: undefined} as LoadingDialogState;

export const loadingDialogSlice = createSlice({
  name: 'loadingDialog',
  initialState,
  reducers: {
    setShowLoadingDialog(state, action: PayloadAction<boolean>) {
      state.showLoadingDialog = action.payload;
    },
    removeShowLoadingDialog(state) {
      state.showLoadingDialog = undefined;
    },
  },
});

export const {setShowLoadingDialog, removeShowLoadingDialog} =
  loadingDialogSlice.actions;

export default loadingDialogSlice.reducer;
