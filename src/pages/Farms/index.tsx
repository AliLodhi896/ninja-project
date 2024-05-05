import React, { useState, useEffect, useCallback } from 'react';
import { useActiveWeb3React } from '../../hooks';
import useBlock from '../../hooks/useBlock';
// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'
import Ninja_icon from '../../assets/images/Ninja_icon.png';
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
    title: 'NINJA-BUSD',
    APY: '...',
    Earn: 'NINJA',
    Deposit: 'NINJA-BUSD LP',
    lpAddress: '0xBFaF396D2D7A29B5C46Af0C544D89c495d258049',
    Pid: '0',
    logo1: Ninja_icon,
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png',
    ratio: '15x',
    tradeUrl:
      'https://ninjaswap.app/add/0x93e7567f277F353d241973d6f85b5feA1dD84C10/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
  {
    title: 'NINJA-BNB',
    APY: '...',
    Earn: 'NINJA',
    Deposit: 'NINJA-BNB LP',
    lpAddress: '0x5720e28DC258961e15a4445D6e6e3335dcB46e99',
    Pid: '1',
    logo1: Ninja_icon,
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
    ratio: '12x',
    tradeUrl: 'https://ninjaswap.app/add/0x93e7567f277F353d241973d6f85b5feA1dD84C10/BNB',
  },
  {
    title: 'NINJA-CAKE',
    APY: '...',
    Earn: 'NINJA',
    Deposit: 'NINJA-CAKE LP',
    lpAddress: '0x785C435B15d3Be5C5EedC5037b1da704f5a66349',
    Pid: '2',
    logo1: Ninja_icon,
    logo2:
      'https://raw.githubusercontent.com/Bscex/bscex-token-list/master/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
    ratio: '10x',
    tradeUrl:
      'https://ninjaswap.app/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0x93e7567f277F353d241973d6f85b5feA1dD84C10',
  },
  {
    title: 'CAKE-BNB',
    APY: '...',
    Earn: 'NINJA',
    Deposit: 'CAKE-BNB LP',
    lpAddress: '0x2d19458Cb3772D14b613b666968f81e608334d3d',
    Pid: '3',
    logo1:
      'https://raw.githubusercontent.com/Bscex/bscex-token-list/master/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
    ratio: '1x',
    tradeUrl: 'https://ninjaswap.app/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/BNB',
  },
  {
    title: 'BNB-BUSD',
    APY: '...',
    Earn: 'NINJA',
    Deposit: 'BNB-BUSD LP',
    lpAddress: '0xc96Fe2f696d895DfE324df83B30e3A17e15D36F9',
    Pid: '4',
    logo1:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png',
    ratio: '1x',
    tradeUrl: 'https://ninjaswap.app/add/BNB/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
  {
    title: 'BTCB-BUSD',
    APY: '...',
    Earn: 'NINJA',
    Deposit: 'BTCB-BUSD LP',
    lpAddress: '0xA4b71d458C15697DD138bb003CEbE7c83D72E7AA',
    Pid: '5',
    logo1:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/logo.png',
    logo2:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png',
    ratio: '1x',
    tradeUrl:
      'https://ninjaswap.app/add/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
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

export default function Farms() {
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
    const predicate = (apy: ApyRaw) => localApyList.map((v) => v.Pid)?.includes(apy.Pid);
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

    setApyListState(_.merge(localApyList, filteredApyList));
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
            <h1 className="subTitle">{_t('ninjaFarmsActivated')}</h1>
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
