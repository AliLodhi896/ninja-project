import { useEffect, useState } from 'react';
import Notification from '../components/Notification/Notification';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

export default function useTwitterApiNew() {
  const [initialized, setInitialized] = useState(false);
  const init = () => {
    if (initialized) return true;

    setInitialized(true);
  };
  const sendUsername = async (data: {
    twitterUsername: string;
    referralWalletId?: string | null;
    userWalletId?: string | null;
  }) => {
    try {
      const query = {
        ...data,
      };
      const params = new URLSearchParams();
      params.append('twitterUsername', query.twitterUsername);
      params.append('referralWalletId', query?.referralWalletId || '');
      params.append('userWalletId', query?.userWalletId || '');

      const response = await axios.post(`${BACKEND_URL}/api/bounty/saveTwitterInfo`, params.toString(), {
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

  return {
    init,
    sendUsername,
  };
}
