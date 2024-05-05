import { keys } from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveWeb3React } from '../../hooks';
import { AppDispatch, AppState } from '../index';
import {
  articleConnect,
  ArticleState,
  disconnectBounty,
  gifConnect,
  GifState,
  telegramConnect,
  TelegramState,
  TelegramUserData,
  twitterConnect,
  TwitterState,
  youtubeConnect,
  YoutubeState,
} from './actions';
import { bountyInitialState, BountyState } from './reducer';

export function useBountyState(): AppState['bounty'] {
  return useSelector<AppState, AppState['bounty']>((state) => state.bounty);
}

export function useBountySelectors() {
  const dispatch = useDispatch<AppDispatch>();
  const states = useBountyState();

  const isConnected = useCallback(
    (
      bountyType: keyof BountyState,
      callback: (T: BountyState[typeof bountyType] | any) => boolean,
    ): boolean => {
      // eslint-disable-next-line react-hooks/rules-of-hooks

      const isConnectedValue = callback && callback(states[bountyType]);
      return isConnectedValue;
    },
    [dispatch, states],
  );

  return {
    isConnected,
  };
}

export function useBountyActionHandlers(): {
  onTelegramConnect: (params: TelegramUserData) => void;
  onTwitterConnect: (params: TwitterState) => void;
  onYoutubeConnect: (params: YoutubeState) => void;
  onArticleConnect: (params: ArticleState) => void;
  onGifConnect: (params: GifState) => void;
  onDisconnect: (bountyType?: keyof BountyState) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onTelegramConnect = useCallback(
    (params: TelegramUserData) => {
      dispatch(telegramConnect({ userData: params }));
    },
    [dispatch],
  );

  const onTwitterConnect = useCallback(
    (params: TwitterState) => {
      dispatch(twitterConnect(params));
    },
    [dispatch],
  );

  const onYoutubeConnect = useCallback(
    (params: YoutubeState) => {
      dispatch(youtubeConnect(params));
    },
    [dispatch],
  );

  const onArticleConnect = useCallback(
    (params: ArticleState) => {
      dispatch(articleConnect(params));
    },
    [dispatch],
  );

  const onGifConnect = useCallback(
    (params: GifState) => {
      dispatch(gifConnect(params));
    },
    [dispatch],
  );

  const onDisconnect = useCallback(
    (bountyType?: keyof BountyState) => {
      if (bountyType) {
        dispatch(disconnectBounty({ bountyType }));
      } else {
        const keysOfBounty = keys(bountyInitialState);
        keysOfBounty.map((bountyType: keyof BountyState) => {
          return dispatch(disconnectBounty({ bountyType }));
        });
      }
    },
    [dispatch],
  );

  return {
    onTelegramConnect,
    onTwitterConnect,
    onYoutubeConnect,
    onArticleConnect,
    onGifConnect,
    onDisconnect,
  };
}
