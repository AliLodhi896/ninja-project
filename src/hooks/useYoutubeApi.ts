import { useEffect, useState } from 'react';
import Notification from '../components/Notification/Notification';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

export default function useYoutubeApi() {
  const [initialized, setInitialized] = useState(false);
  const init = () => {
    if (initialized) return true;

    setInitialized(true);
  };

  const sendContent = async (data: {
    contentUrl: string;
    referralWalletId?: string | null;
    userWalletId?: string | null;
  }) => {
    try {
      const query = {
        ...data,
      };

      const params = new URLSearchParams();
      params.append('contentUrl', query.contentUrl);
      params.append('referralWalletId', query?.referralWalletId || '');
      params.append('userWalletId', query?.userWalletId || '');

      const response = await axios.post(`${BACKEND_URL}/api/user/youtube`, params.toString(), {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Response : ', response);

      if (!response?.data) {
        throw new Error('Sorry! Try again later.');
      }

      if (!response?.data?.status) {
        throw new Error(response?.data?.msg);
      }

      Notification.notification({
        type: 'success',
        message: response?.data?.msg || 'Success',
      });

      return response.data;
    } catch (error) {
      Notification.notification({
        type: 'error',
        message: error.message || 'Sorry! Try again later.',
      });
      throw new Error('error');
    }
  };

  return {
    init,
    sendContent,
  };
}
