import { useCallback, useMemo } from 'react';
import { useActiveWeb3React } from '../../hooks';
import { NinjaStats, updateNinjaStats } from './actions';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, AppState } from '../index';

export function useNinaStatsState(): AppState['stats'] {
  return useSelector<AppState, AppState['stats']>((state) => state.stats);
}

export function useNinjaStatsActionHandlers(): {
  onNinjaStatsLoad: (params: NinjaStats) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onNinjaStatsLoad = useCallback(
    (params: NinjaStats) => {
      dispatch(updateNinjaStats(params));
    },
    [dispatch],
  );

  return {
    onNinjaStatsLoad,
  };
}
