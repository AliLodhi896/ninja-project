import { createAction } from '@reduxjs/toolkit';
import { BountyState } from './reducer';

export interface TelegramUserData {
  auth_date?: number;
  first_name?: string;
  hash?: string;
  id?: number;
  last_name?: string;
  username?: string;
}

export interface TelegramState {
  userData?: TelegramUserData;
}

export interface TwitterState {
  twitterUsername?: string;
}

export interface YoutubeState {
  contentUrl?: string;
}

export interface ArticleState {
  articleUrl?: string;
}

export interface GifState {
  content1Url?: string;
  content2Url?: string;
  content3Url?: string;
}

export const telegramConnect = createAction<TelegramState>('bounty/telegramConnect');

export const twitterConnect = createAction<TwitterState>('bounty/twitterConnect');

export const youtubeConnect = createAction<YoutubeState>('bounty/youtubeConnect');

export const articleConnect = createAction<ArticleState>('bounty/articleConnect');

export const gifConnect = createAction<GifState>('bounty/gifConnect');

export const disconnectBounty = createAction<{ bountyType: keyof BountyState }>(
  'bounty/disconnectBounty',
);
