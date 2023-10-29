import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface modalState {
  showModal: boolean;
}

const initialState: modalState = {
    showModal: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    hideModal: (state) => {
      state.showModal = false
    },
    showModal: (state) => {
      state.showModal = true;
    },

  },
});

export const {hideModal, showModal} = modalSlice.actions;

export default modalSlice.reducer;
