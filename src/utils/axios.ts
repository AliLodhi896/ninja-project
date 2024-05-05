import axios from 'axios';
import { BACKEND_URL } from '../constants';

export async function getPairTrades(pair: string) {
  try {
    var response = await axios.get('https://api.ninjaswap.app/trades/' + pair);

    var array = response.data;
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
      var trade = array[i];
      trade.trade_id = trade.trade_id.split('-')[0];
      trade.price = parseFloat(trade.price).toFixed(8);
      trade.base_volume = parseFloat(trade.base_volume).toFixed(8);
      trade.quote_volume = parseFloat(trade.quote_volume).toFixed(8);
      newArray.push(trade);
    }

    newArray = newArray.sort((a: any, b: any) =>
      Number(a.trade_timestamp) > Number(b.trade_timestamp)
        ? -1
        : Number(a.trade_timestamp) < Number(b.trade_timestamp)
        ? 1
        : 0,
    );

    return {
      pairId: pair,
      data: newArray,
    };
  } catch (error) {
    console.log(error);
    return { data: [], pairId: undefined };
  }
}

export async function getStats() {
  try {
    var response = await axios.get(`${BACKEND_URL}/api/stats`);

    return response.data?.status && response.data?.stats;
  } catch (error) {
    console.log(error);
    return { data: [], pairId: undefined };
  }
}

export async function submitTask(userWalletId: string , cb_id : string , ctask_id : string ) {
  try {
    const params = new URLSearchParams();
    params.append('userWalletId', userWalletId);
    params.append('cb_id', cb_id);
    params.append('ctask_id', ctask_id);

    const response = await axios.post(`${BACKEND_URL}/api/bounty/submitTask`, params.toString(), {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    var response = {
      status: false,
      msg: error
    };
    return response;
  }
}

export async function airdropClaim({ userWalletId }: { userWalletId: any }) {
  try {
    const params = new URLSearchParams();
    params.append('userWalletId', userWalletId || '');

    const response = await axios.post(`${BACKEND_URL}/api/airdrop/claim`, params.toString(), {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return { data: [], pairId: undefined };
  }
}

export async function getStarterPools() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/starter`);

    return response.data?.status ? response.data?.pools : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getStarterUpcomingPools() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/starter/upcoming`);

    return response.data?.status ? response.data?.pools : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getStarterClosedPools() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/starter/closed`);

    return response.data?.status ? response.data?.pools : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getLocks() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/starter/locks`);

    return response.data.locks;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getStarterActivePools() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/starter/active`);

    return response.data?.status ? response.data?.pools : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBounties() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/bounty`);

    return response.data?.status ? response.data?.bounties : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUserStatus(address : string) {
  try {
    const params = new URLSearchParams();
    params.append('userWalletId', address || '');

    const response = await axios.post(`${BACKEND_URL}/api/bounty/userStatus`, params.toString(), {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}


export async function getStarterPoolDetail(symbol: string) {
  try {
    const params = new URLSearchParams();
    params.append('symbol', symbol || '');

    const response = await axios.post(`${BACKEND_URL}/api/starter/getinfo`, params.toString(), {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBountyDetail(userWalletId: string , cb_id : string ) {
  try {
    const params = new URLSearchParams();
    params.append('userWalletId', userWalletId || '');
    params.append('cb_id', cb_id || '');

    const response = await axios.post(`${BACKEND_URL}/api/bounty/getTasks`, params.toString(), {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getEarnings(userWalletId: string , cb_id : string ) {
  try {
    const params = new URLSearchParams();
    params.append('userWalletId', userWalletId || '');
    params.append('cb_id', cb_id || '');

    const response = await axios.post(`${BACKEND_URL}/api/bounty/getEarnings`, params.toString(), {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getAirDrop(userWalletId: string , cb_id : string ) {
  try {
    const params = new URLSearchParams();
    params.append('userWalletId', userWalletId || '');
    params.append('cb_id', cb_id || '');

    const response = await axios.post(`${BACKEND_URL}/api/bounty/checkAddressVoltClaim`, params.toString(), {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

