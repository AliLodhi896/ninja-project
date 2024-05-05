import { createAction } from '@reduxjs/toolkit';

export interface NinjaStats {
  price?: string;
  marketcap?: string;
  totalSupply?: number;
  AMOminted?: number;
  AMO_Price?: string;
  TotalBurned?: number;
}

export const updateNinjaStats = createAction<NinjaStats>('app/updateNinjaStats');
