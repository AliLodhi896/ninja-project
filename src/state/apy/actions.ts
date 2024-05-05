import { createAction } from '@reduxjs/toolkit';

export interface ApyRaw {
  Pid: string;
  dailyAPY: number;
  lpAddress: string;
  monthlyAPY: number;
  total_locked_value: string;
  weeklyAPY: string;
  yearlyAPY: number;
}

export const updateApyList = createAction<{ list: ApyRaw[] }>('app/updateApyList');
