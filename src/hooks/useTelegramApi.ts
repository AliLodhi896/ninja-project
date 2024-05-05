import { useEffect, useState } from 'react';
import Notification from '../components/Notification/Notification';
import crypto from 'crypto';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

const BOT_TOKEN = '5082315693:AAFJFAfbp0Eym7CaBcBhWLvmrtf8tv_40Ag';

interface Options {
  bot_id: string;
  request_access?: boolean;
  lang?: string;
}

interface Data {
  auth_date?: number;
  first_name?: string;
  hash?: string;
  id?: number;
  last_name?: string;
  username?: string;
}

type Callback = (dataOrFalse: Data | false) => void;

declare global {
  interface Window {
    Telegram: any;
  }
}

export default function useTelegramApi() {
  const [initialized, setInitialized] = useState(false);
  const init = () => {
    if (initialized) return true;
    var head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?14';
    script.async = true;
    head.appendChild(script);
    setInitialized(true);
  };

  const login = (): Promise<Data> => {
    return new Promise((resolve) => {
      window.Telegram?.Login.auth({ bot_id: BOT_TOKEN, request_access: true }, (data: any) => {
        if (!data) {
          // authorization failed
          /*  Notification.notification({
            type: 'error',
            message: 'Sorry! We can not connect your Telegram account.',
          }); */
          return;
        }

        /*  Notification.notification({
          type: 'success',
          message: 'Your Telegram username saved succesfully.',
        }); */

        resolve(data);
      });
    });
  };

  const sendAccountData = async (data: {
    auth_date: any;
    first_name: any;
    hash: any;
    id: any;
    last_name: any;
    username: any;
    referralWalletId?: string | null;
    userWalletId?: string | null;
  }) => {
    try {
      const query = {
        ...data,
      };

      const params = new URLSearchParams();
      params.append('auth_date', String(query.auth_date));
      params.append('first_name', String(query.first_name));
      params.append('hash', String(query.hash));
      params.append('id', String(query.id));
      params.append('last_name', String(query.last_name));
      params.append('username', String(query.username));
      params.append('referralWalletId', query?.referralWalletId || '');
      params.append('userWalletId', query?.userWalletId || '');

      const response = await axios.post(`${BACKEND_URL}/api/bounty/saveTelegramInfo`, params.toString(), {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Response : ', response);

      if (!response?.data) {
        Notification.notification({
          type: 'error',
          message:'Sorry! Try again later.',
        });
      }

      if (response?.data?.status) {
        Notification.notification({
          type: 'success',
          message: response?.data?.msg || 'Success',
        });
      }
      else {
        Notification.notification({
          type: 'error',
          message: response?.data?.msg || 'Sorry! Try again later.',
        });
      }
      

      return response.data;
    } catch (error) {
      Notification.notification({
        type: 'error',
        message: error.message || 'Sorry! Try again later.',
      });
     
    }
  };

  const checkAuthorization = (data: any) => {
    /* console.info('Telegram API: checking authorization'); */
    if (!data) return false;
    const botToken = BOT_TOKEN;
    const secret = crypto
      .createHash('sha256')
      .update(botToken)
      .digest();
    let array = [];

    for (let key in data) {
      if (key !== 'hash' && data[key] !== 'undefined') {
        array.push(key + '=' + data[key]);
      }
    }
    const check_hash = crypto
      .createHmac('sha256', secret)
      .update(array.sort().join('\n'))
      .digest('hex');

    return check_hash === data.hash;
  };

  return {
    init,
    login,
    sendAccountData,
    checkAuthorization,
  };
}
