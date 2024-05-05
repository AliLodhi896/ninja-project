import { createReducer, nanoid } from '@reduxjs/toolkit';
import { NinjaStats, updateNinjaStats } from './actions';

export interface StatsState extends NinjaStats {}

const initialState: StatsState = {};

export default createReducer(initialState, (builder) =>
  builder.addCase(updateNinjaStats, (state, action) => {
    const stats = action.payload;
    return {
      ...stats,
    };
  }),
);
