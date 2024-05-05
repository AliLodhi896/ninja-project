import { useEffect, useState } from 'react';
import Notification from '../components/Notification/Notification';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

export default function useBountyApi() {
  const [initialized, setInitialized] = useState(false);
  const init = () => {
    if (initialized) return true;

    setInitialized(true);
  };

  const getUserBounty = async (userWalletId: string | undefined | null) => {
    if (!userWalletId) {
      return undefined;
    }
    try {
      const params = new URLSearchParams();
      params.append('userWalletId', userWalletId || '');

      const response = await axios.post(`${BACKEND_URL}/api/user/checkBounty`, params.toString(), {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Response : ', response);

      if (!response.data) {
        throw new Error('connection error');
      }

      /* 
      const a = {
        twitter: {
          follow: false,
          retweet: false,
        },
        telegram: {
          join: true,
        },
        youtube: null,
      }; */

      return response.data;
    } catch (error) {
      Notification.notification({
        type: 'error',
        message: 'Opss! Connection error!',
      });
      console.log(error);
    }
  };

  return {
    init,
    getUserBounty,
  };
}
