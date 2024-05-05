import { useEffect, useState } from 'react';
import Notification from '../components/Notification/Notification';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

export default function useGifApi() {
  const [initialized, setInitialized] = useState(false);
  const init = () => {
    if (initialized) return true;

    setInitialized(true);
  };

  const sendContents = async (data: {
    gif1?: string;
    gif2?: string;
    gif3?: string;
    referralWalletId?: string | null;
    userWalletId?: string | null;
  }) => {
    try {
      const query = {
        ...data,
      };

      const params = new URLSearchParams();
      params.append('memeUrl1', query.gif1 || '');
      params.append('memeUrl2', query.gif2 || '');
      params.append('memeUrl3', query.gif3 || '');
      params.append('referralWalletId', query?.referralWalletId || '');
      params.append('userWalletId', query?.userWalletId || '');

      const response = await axios.post(`${BACKEND_URL}/api/user/meme`, params.toString(), {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Response : ', response);

      if (!response.data) {
        Notification.notification({
          type: 'error',
          message: 'Sorry! Try again later.',
        });
        return;
      }

      Notification.notification({
        type: 'success',
        message: response?.data?.msg || 'Success',
      });

      return response.data;
    } catch (error) {
      Notification.notification({
        type: 'error',
        message: 'Sorry! Try again later.',
      });
      throw new Error('Twitter error');
    }
  };

  return {
    init,
    sendContents,
  };
}
