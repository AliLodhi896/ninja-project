import React, { useState, useEffect, useCallback } from 'react';
import { useActiveWeb3React } from '../../hooks';
import useBlock from '../../hooks/useBlock';
// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'
import Ninja_icon from '../../assets/images/Ninja_icon.png';
import XNinja_icon from '../../assets/images/xNinja_icon.png';
import NinjaTractor from '../../assets/images/tractor-transparent.gif';
import FarmActions from './Actions';
import _ from 'lodash';
import KatanaIcon from '../../assets/img/Katana.png';
import { useApyState } from '../../state/apy/hooks';
import { ApyRaw } from '../../state/apy/actions';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { darken } from 'polished';
import StatsModal from './components/StatsModal';
import CurrencyFormat from '../../components/CurrencyFormat';
import { getContract, getFarm } from '../../utils';
import { Base_url } from '../../constants';
import { Web3Provider } from '@ethersproject/providers';
import useAdvenceTranslation from '../../hooks/useAdvenceTranslation';

const localApyList = [
  {
    title: 'Stake XNINJA',
    APY: 365,
    Earn: 'XNINJA',
    Deposit: 'XNINJA',
    lpAddress: '0xE63969620AaC596f68AEe7Fa1D795026bf27Ff18',
    Pid: '1',
    logo1: Ninja_icon,
    logo2:XNinja_icon,
    ratio: '20x',
    dailyAPY: 1,
    weeklyAPY: 7,
    monthlyAPY: 30,
    yearlyAPY: 365,
    total_locked_value: 1000000,
    lockperiod : '24 hours',
    tradeUrl:
    'https://ninjaswap.app/add/0xE63969620AaC596f68AEe7Fa1D795026bf27Ff18/BNB',
  },
  {
    title: 'XNINJA-BNB',
    APY: 365,
    Earn: 'XNINJA',
    Deposit: 'XNINJA-BNB LP',
    lpAddress: '0x7830802519ece48460376Bab9CbE18553F871A65',
    Pid: '2',
    logo1: XNinja_icon,
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
    ratio: '15x',
    dailyAPY: 1,
    weeklyAPY: 7,
    monthlyAPY: 30,
    yearlyAPY: 365,
    total_locked_value: 1000000,
    lockperiod : '24 hours',
    tradeUrl: 'https://ninjaswap.app/add/0xE63969620AaC596f68AEe7Fa1D795026bf27Ff18/BNB',
  },
  {
    title: 'CBLT-BUSD',
    APY: 365,
    Earn: 'XNINJA',
    Deposit: 'CBLT-BUSD LP',
    lpAddress: '0x8adA34beB7e75bf6425d7A23330b761Eef2111F9',
    Pid: '3',
    logo1: "https://raw.githubusercontent.com/ninjaswapapp/tokens-list/master/logo/bsc/0x8Cbae8Ba8756e57496D29a67819ff96Ae2Ba8017.png",
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png',
    ratio: '15x',
    dailyAPY: 1,
    weeklyAPY: 7,
    monthlyAPY: 30,
    yearlyAPY: 365,
    total_locked_value: 1000000,
    lockperiod : '24 hours',
    tradeUrl: 'https://ninjaswap.app/add/0x8Cbae8Ba8756e57496D29a67819ff96Ae2Ba8017/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
  {
    title: 'CBLT-BNB',
    APY: 365,
    Earn: 'XNINJA',
    Deposit: 'CBLT-BNB LP',
    lpAddress: '0xC1dA281839F58F32c48cB096C11b9d881A3EbCB6',
    Pid: '4',
    logo1: "https://raw.githubusercontent.com/ninjaswapapp/tokens-list/master/logo/bsc/0x8Cbae8Ba8756e57496D29a67819ff96Ae2Ba8017.png",
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
    ratio: '15x',
    dailyAPY: 1,
    weeklyAPY: 7,
    monthlyAPY: 30,
    yearlyAPY: 365,
    total_locked_value: 1000000,
    lockperiod : '24 hours',
    tradeUrl: 'https://ninjaswap.app/add/0x8Cbae8Ba8756e57496D29a67819ff96Ae2Ba8017/BNB',
  },
  {
    title: '8BIT-BUSD',
    APY: 365,
    Earn: 'XNINJA',
    Deposit: '8BIT-BUSD LP',
    lpAddress: '0x8adA34beB7e75bf6425d7A23330b761Eef2111F9',
    Pid: '5',
    logo1: "https://raw.githubusercontent.com/ninjaswapapp/tokens-list/master/logo/bsc/0x8F661Bd044b8799fdE621079E4A48171848AD614.png",
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png',
    ratio: '15x',
    dailyAPY: 1,
    weeklyAPY: 7,
    monthlyAPY: 30,
    yearlyAPY: 365,
    total_locked_value: 1000000,
    lockperiod : '24 hours',
    tradeUrl: 'https://ninjaswap.app/add/0x8F661Bd044b8799fdE621079E4A48171848AD614/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
];

const StyledLink = styled.a`
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme }) => theme.text1};

  &.active {
    font-weight: 500;
    color: ${({ theme }) => 'rgb(240, 185, 11) !important'};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

export default function Pools() {
  const block = useBlock();
  const { list: apyList } = useApyState();
  const [apyListState, setApyListState] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(undefined);
  const { account, chainId, library } = useActiveWeb3React();
  const { _t } = useAdvenceTranslation({ prefix: 'farmsPage' });
  /* const [tradeUrl, setTradeUrl] = useState(null); */

  useEffect(() => {}, []);

  const handleDismissModal = () => {
    setModalOpen(false);
    setModalData(undefined);
  };

  const onModalOpen = (item: any) => {
    setModalOpen(true);
    setModalData({ apyRaw: item });
  };

  useEffect(() => {
    setListData();
  }, [block, account, apyList]);

  async function setListData() {
    const predicate = (apy: ApyRaw) => localApyList.map((v) => ({pid: v.Pid, ip: v.lpAddress}))?.includes({pid: apy.Pid, ip: apy.lpAddress});
    const filteredApyList = apyList.filter(predicate);
    const converter = async (p: ApyRaw) => ({
      ...p,
      APY: p?.yearlyAPY?.toFixed(2),
      Pid: p?.Pid,
      // tradeUrl: await getTokenNames(p),
    });
    for (let index = 0; index < filteredApyList.length; index++) {
      filteredApyList[index] = await converter(filteredApyList[index]);
    }

    setApyListState(localApyList);
  }

  /* const getTokenNames = useCallback(
    async (item: any) => {
      if (!chainId || !library) return item.Deposit;

      const farmToken = getFarm(item.lpAddress, chainId, library, account as string | undefined);
      let token0 = await farmToken.token0();
      let token1 = await farmToken.token1();
      if (token0 === '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c') {
        token0 = 'BNB';
      }
      if (token1 === '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c') {
        token1 = 'BNB';
      }
      return `${Base_url + '/add/' + token0 + '/' + token1}`;
    },
    [apyListState],
  ); */

  // async function getReward(pair:any) {
  //     if (!chainId || !library || !account) return
  //     const ballsRewardContract = getBallsRewardContract(chainId, library, account);
  //     let dai_active = await ballsRewardContract.viewReward(pair, account, true);
  //     return Number(dai_active[0] * 10 / 11 / 10 ** 18).toFixed(4)
  // }
  // async function getUserPeriodAmount(pair:any) {
  //     if (!chainId || !library || !account) return
  //     const ballsRewardContract = getBallsRewardContract(chainId, library, account);

  // }
  return (
    <>
      <div className="main container mainContainer" id="content">
        <div
          className="row justify-content-sm-center justify-content-md-center"
          style={{ textAlign: 'center' }}
        >
          <div className="col-lg-10">
            <img className="indexImage" src={NinjaTractor} />
            <h1 className="subTitle">XNinja Farming Started</h1>
            <p>*Note : Accurate TVL and APY sync will take few days</p>
          </div>
        </div>
        <div
          className="row justify-content-sm-center justify-content-md-center"
          style={{ paddingTop: '20px' }}
        >
          <div className="col-lg-10">
            {apyListState.length ? (
              <div
                className="row dashboard overview justify-content-sm-center"
                style={{ marginTop: '30px' }}
              >
                {apyListState.map((item, index) => {
                  return (
                    <div className="col-lg-4 col-md-4 col-sm-12" key={index}>
                      <div className="card centered farm-card">
                        <img src={KatanaIcon} className="farm-card-bg" />
                        <div className="header-wrapper-content">
                          <div className="farm-head">
                            <div className="lp-icon-wrapper">
                              <img src={item.logo1} />
                              <img src={item.logo2} />
                            </div>

                            <div className="farm-head-right">
                              <div className="farm-title">{item.title}</div>
                              <div className="xtimes-badge">{item.ratio}</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid-item-content" id="DIV_1">
                          <div className="token-info-wrapper" id="DIV_2">
                            <div className="token-info" id="DIV_3">
                              <div className="token-name" id="DIV_4">
                                {item.tradeUrl ? (
                                  <StyledLink href={item.tradeUrl}>
                                    {item.Deposit}
                                    <FontAwesomeIcon
                                      style={{ marginLeft: '5px' }}
                                      icon={faExternalLinkAlt}
                                    />
                                  </StyledLink>
                                ) : (
                                  item.Deposit
                                )}
                              </div>
                              <div className="token-desc" id="DIV_5">
                                {_t('deposit')}
                              </div>
                            </div>
                            <div className="token-info" id="DIV_6">
                              <div className="token-name" id="DIV_7">
                                {item.Earn}
                              </div>
                              <div className="token-desc" id="DIV_8">
                                {_t('earn')}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '10px',
                            }}
                          >
                            <div
                              style={{
                                font: '17px Poppins, sans-serif',
                                fontWeight: 400,
                                lineHeight: 1.5,
                                color: '#66696c',
                              }}
                            >
                              {_t('apy')}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                font: '17px Poppins, sans-serif',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              onClick={() => onModalOpen(item)}
                            >
                              {item.APY === '...' ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  role="status"
                                  aria-hidden="true"
                                  size="sm"
                                />
                              ) : (
                                <>
                                  <span style={{ zIndex: 2 }}>
                                    <FontAwesomeIcon icon={faCalculator} size="sm" />
                                  </span>
                                  <span style={{ paddingLeft: '7px' }}>
                                    <CurrencyFormat value={item.APY} />%
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          {/* <div className="percentage" id="DIV_9">
                          <div className="apy" id="DIV_10">
                            APY
                          </div>
                          <div className="perc-value" id="DIV_11">
                            <div className="amount" id="DIV_12">
                              {item.APY === '...' ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  role="status"
                                  aria-hidden="true"
                                  size="sm"
                                />
                              ) : (
                                <span id="SPAN_13">{item.APY} %</span>
                              )}
                            </div>
                          </div>
                        </div> */}
                          <FarmActions
                            farm={item.lpAddress}
                            pid={item.Pid}
                            deposit={item.Deposit}
                            lockperiod = {item.lockperiod}
                            /* onTradeUrlGenerated={(url: string) => {
                            item.tradeUrl = url;
                          }} */
                          />
                        </div>
                        <div className="farm-footer-nocolor">
                          {_t('totalLockedValue')}: <br />$
                          <CurrencyFormat value={item?.total_locked_value} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="row justify-content-center">
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      </div>
      <StatsModal isOpen={modalOpen} onDismiss={handleDismissModal} withData={modalData} />
    </>
  );
}
