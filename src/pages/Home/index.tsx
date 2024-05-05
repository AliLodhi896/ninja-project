import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next'
// import TestNet from '../../components/TestNet'
// import Modal from '../../components/Modal'
//import {  getcurveToken, getBallsRewardContract } from '../../utils'
import { getcurveToken } from '../../utils';
import { useActiveWeb3React } from '../../hooks';
import useBlock from '../../hooks/useBlock';
// import { useWalletModalToggle } from '../../state/application/hooks'
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import git_icon from '../../assets/images/github.png';
import fair_icon from '../../assets/images/fair.png';
import contract_icon from '../../assets/images/contract.png';
import no_team_icon from '../../assets/images/no_team.png';
import { getNinjaPrice } from '../../utils/graphQL';
import { useNinaStatsState } from '../../state/stats/hooks';
import CurrencyFormat from '../../components/CurrencyFormat';
// @ts-ignore
import { Timeline } from 'react-twitter-widgets';
import { SeoHelmet } from '../../components/SeoHelmet';

const StatsRow = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatRowLeft = styled.div`
  font-size: 17px;
  font-weight: 600;
  line-height: 1.5;
`;

const StatRowRight = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: #fff;
`;

export default function Home() {
  // const { t } = useTranslation()
  const block = useBlock();
  const { account, chainId, library } = useActiveWeb3React();
  const ninjaStats = useNinaStatsState();
  // const toggleWalletModal = useWalletModalToggle()
  // const [showReward,SetShowReward] = useState(false)
  const [totalSupply, setTotalSupply] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [tokenPrice, setTokenPrice] = useState(0);
  const [walletvalue, setWalletValue] = useState('0');
  const [txHash, setTxHash] = useState('');
  //const [perBlockReward,setPerBlockReward] = useState('0')
  useEffect(() => {
    setTimeout(() => {
      closeTourPop();
    }, 15000);
  }, []);
  useEffect(() => {
    getTokenBalance();
    checkTxHash();
    // getPerReward()
  }, [block, account]);
  function checkTxHash() {
    if (txHash.length > 0) {
      const timeInter = setInterval(() => {
        if (!library) return;

        library.getTransactionReceipt(txHash).then((res) => {
          console.log('resass--', res);
          if (res && res.status === 1) {
            getTokenBalance();
            setTxHash('');
            console.log('update----');
            clearInterval(timeInter);
          }
        });
      }, 1000);
    }
  }
  async function getTokenBalance() {
    if (!chainId || !library || !account) return;
    const ballsToken = getcurveToken(chainId, library, account);
    let tokenBalance = await ballsToken.balanceOf(account);
    let totalSupply = await ballsToken.totalSupply();
    const balance = Number(tokenBalance / 10 ** 18).toFixed(2);
    setTotalSupply(Number(totalSupply / 10 ** 18).toFixed(2));
    setTokenBalance(balance);
    let ninjaPrice = await getNinjaPrice();
    setTokenPrice(Number(ninjaPrice));
    const valb = Number(Number(balance) * Number(ninjaPrice)).toFixed(2);
    setWalletValue(valb);
  }
  async function closeTourPop() {
    var TourPop = document.getElementsByClassName('cookie-notice');
    if (TourPop[0]) {
      TourPop[0].classList.toggle('cookie-notice-hidden');
    }
  }
  return (
    <>
      <div id="klaro">
        <div className="klaro">
          <div className="cookie-notice ">
            <div className="cn-body">
              <p>Automatic Minting Offer</p>
              <p className="cn-ok">
                <NavLink exact to="/amo-v2">
                  <button className="cm-btn cm-btn-sm cm-btn-success" type="button">
                    AMO
                  </button>
                </NavLink>

                <button
                  className="cm-btn cm-btn-sm cm-btn-danger cn-decline"
                  type="button"
                  onClick={closeTourPop}
                >
                  Close
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="main container mainContainer" id="content">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center home-bg"></div>
        </div>
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-8" style={{ textAlign: 'center' }}></div>
          </div>
        </div>
        <div className="row justify-content-sm-center">
          <div className="col-md-6 col-sm-12">
            <div className="row">
              <div className="col" style={{ textAlign: 'center' }}>
                <h1 className="subTitle">
                  The first project launching via Novel AMO (Automatic Minting Offering )
                </h1>
                <NavLink exact to="/swap">
                  <Button className="Zwap-btn button">Swap</Button>
                </NavLink>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="row">
              <div className="col">
                <div className="indexBox">
                  <img src={no_team_icon} />
                  <br />
                  No Team Token preminted.
                </div>
              </div>
              <div className="col">
                <div className="indexBox">
                  <img src={fair_icon} />
                  <br />
                  Fair Launch
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="indexBox">
                  <img src={contract_icon} />
                  <br />
                  Team tokens will be minted automatically via AMO smart contract , namely only if
                  price goes higher.
                </div>
              </div>
              <div className="col">
                <div className="indexBox">
                  <img src={git_icon} />
                  <br />
                  All codes are Public on github
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-sm-center justify-content-md-center">
          <div className="col-lg-10">
            <div
              className="row dashboard overview justify-content-sm-center"
              style={{ marginTop: '50px' }}
            >
              <div className="col-lg-6" id="leftStatsPart">
                <div className="card centered">
                  <div className="card-header home-card">Wallet</div>
                  <div className="card-body">
                    <strong>Your wallet balance:</strong>
                    <br />
                    <span id="tokenBalance">{tokenBalance}</span>
                  </div>
                  <div className="farm-footer">Total Wallet value: $ {walletvalue}</div>
                </div>
                <div className="card centered mt-3">
                  <div className="card-header home-card">Stats</div>
                  <div className="card-body mt-2">
                    <StatsRow>
                      <StatRowLeft>Market Cap</StatRowLeft>
                      <StatRowRight>
                        ${<CurrencyFormat value={ninjaStats.marketcap} />}
                      </StatRowRight>
                    </StatsRow>
                    <StatsRow>
                      <StatRowLeft>Total Supply</StatRowLeft>
                      <StatRowRight>
                        {<CurrencyFormat value={ninjaStats.totalSupply} />}
                      </StatRowRight>
                    </StatsRow>
                    <StatsRow>
                      <StatRowLeft>Total Burned</StatRowLeft>
                      <StatRowRight>
                        {<CurrencyFormat value={ninjaStats.TotalBurned} />}
                      </StatRowRight>
                    </StatsRow>
                    <StatsRow>
                      <StatRowLeft>AMO Minted</StatRowLeft>
                      <StatRowRight>{<CurrencyFormat value={ninjaStats.AMOminted} />}</StatRowRight>
                    </StatsRow>
                    <StatsRow>
                      <StatRowLeft>AMO Price</StatRowLeft>
                      <StatRowRight>{ninjaStats.AMO_Price}</StatRowRight>
                    </StatsRow>
                  </div>
                  <div className="farm-footer-nocolor"></div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card centered">
                  <div className="card-header home-card">Announcements</div>
                  <div className="card-body">
                    <Timeline
                      dataSource={{ sourceType: 'profile', screenName: 'NinjaSwapApp' }}
                      options={{
                        chrome: 'noheader, nofooter',
                        borderColor: '#12161c',
                        width: '400',
                        height: '339',
                        theme: 'dark',
                      }}
                    />
                  </div>
                  <div className="farm-footer-nocolor"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
