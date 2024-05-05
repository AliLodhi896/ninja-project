import { createReducer } from '@reduxjs/toolkit';
import {
  articleConnect,
  ArticleState,
  disconnectBounty,
  gifConnect,
  GifState,
  telegramConnect,
  TelegramState,
  twitterConnect,
  TwitterState,
  youtubeConnect,
  YoutubeState,
} from './actions';

export interface BountyState {
  readonly telegram?: TelegramState;
  readonly twitter?: TwitterState;
  readonly youtube?: YoutubeState;
  readonly article?: ArticleState;
  readonly gif?: GifState;
}

export const bountyInitialState: BountyState = {
  telegram: undefined,
  twitter: undefined,
  youtube: undefined,
  article: undefined,
  gif: undefined,
};

export default createReducer<BountyState>(bountyInitialState, (builder) =>
  builder
    .addCase(telegramConnect, (state, { payload: { userData } }) => {
      return {
        ...state,
        telegram: { userData },
      };
    })
    .addCase(disconnectBounty, (state, { payload: { bountyType } }) => {
      const newState = {
        ...state,
      };
      newState[bountyType] = undefined;
      return newState;
    })
    .addCase(twitterConnect, (state, { payload: { twitterUsername } }) => {
      return {
        ...state,
        twitter: { twitterUsername },
      };
    })
    .addCase(youtubeConnect, (state, { payload }) => {
      return {
        ...state,
        youtube: payload,
      };
    })
    .addCase(articleConnect, (state, { payload }) => {
      return {
        ...state,
        article: payload,
      };
    })
    .addCase(gifConnect, (state, { payload }) => {
      return {
        ...state,
        gif: payload,
      };
    }),
);
