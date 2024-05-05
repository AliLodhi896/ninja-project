import { createReducer, nanoid } from '@reduxjs/toolkit';
import { ApyRaw, updateApyList } from './actions';

export interface ApyState {
  list: ApyRaw[];
}

const initialState: ApyState = {
  list: [],
};

export default createReducer(initialState, (builder) =>
  builder.addCase(updateApyList, (state, action) => {
    const { list } = action.payload;
    return {
      list,
    };
  }),
);
