import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface sequenceState {
  sequence: number[];
}

const initialState: sequenceState = {
  sequence: [],
};

export const sequenceSlice = createSlice({
  name: 'sequence',
  initialState,
  reducers: {
    resetUserSequence: (state) => {
      state.sequence = []
    },
    appendElement: (state, action: PayloadAction<number>) => {
      state.sequence = [...state.sequence, action.payload];
    },

  },
});

export const {appendElement, resetUserSequence} = sequenceSlice.actions;

export default sequenceSlice.reducer;
