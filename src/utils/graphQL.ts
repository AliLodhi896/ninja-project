import axios from 'axios';
//import { ninjaToken } from '../constants';
const tokenAddress = '0xbfaf396d2d7a29b5c46af0c544d89c495d258049';
const SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/ninjaswapapp/ninjaswapgraphql';
export async function getNinjaPrice() {
  try {
    const query = {
      query: `{
                pair(id: "${tokenAddress}") {
                    token0Price
                    token1Price
                }
              }`,
    };
    const response = await axios.post(SUBGRAPH, query);
    // console.log('Response price : ' + parseFloat(response.data.data.pair.token1Price).toFixed(3));
    if (response.data.data.pair.token1Price === null) {
      return '0';
    }
    return parseFloat(response.data.data.pair.token1Price).toFixed(3);
  } catch (error) {
    console.log(error);
    return '0';
  }
}
export async function getAPY(Pooladdress: string) {
  try {
    let rightnow = Math.round(new Date().getTime() / 1000);
    let today = rightnow - (rightnow % 86400);
    const query = {
      query: `{
                pairDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { pairAddress:"${Pooladdress.toLowerCase()}", date_lt: ${today} }) {
              
                    reserveUSD
                    dailyVolumeUSD
                }
              }`,
    };

    const response = await axios.post(SUBGRAPH, query);
    console.log('pair data response : ' + JSON.stringify(response.data));
    console.log(
      'volumeUSD : ' + parseFloat(response.data.data.pairDayDatas[0].dailyVolumeUSD).toFixed(3),
    );
    if (response.data.data.pairDayDatas[0].dailyVolumeUSD) {
      const volume = parseFloat(response.data.data.pairDayDatas[0].dailyVolumeUSD);
      const poolReserve = parseFloat(response.data.data.pairDayDatas[0].reserveUSD);
      const fees = volume * 0.002;
      let totalApy = (fees / poolReserve) * 365 * 100;
      console.log('totalApy : ' + totalApy);
      return totalApy;
    } else {
      return '0';
    }
  } catch (error) {
    console.log(error);
    return '0';
  }
}
