import { useCallback, useMemo } from 'react';
import { useActiveWeb3React } from '../../hooks';
import { ApyRaw, updateApyList } from './actions';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, AppState } from '../index';

export function useApyState(): AppState['apy'] {
  return useSelector<AppState, AppState['apy']>((state) => state.apy);
}

export function useApyActionHandlers(): {
  onApyLoad: (params: ApyRaw[]) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onApyLoad = useCallback(
    (params: ApyRaw[]) => {
      dispatch(updateApyList({ list: params }));
    },
    [dispatch],
  );

  return {
    onApyLoad,
  };
}
