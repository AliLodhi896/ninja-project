import React, { useCallback, useState, useEffect } from 'react';
import bnbIcon from '../../assets/img/bnb_coin.png';
import Ninja_icon from '../../assets/images/Ninja_icon.png';
import { getNinjaAMOContract, getAMOv2Contract } from '../../../utils';
import useBlock from '../../../hooks/useBlock';
import { useActiveWeb3React } from '../../../hooks';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import AppBody from '../../AppBody';
const bn: any = new BigNumber('1e18');

const Footer = styled.div<{ columnLength: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columnLength }) => columnLength}, 1fr);
  grid-gap: 16px;
  text-align: center;
`;

const TextInfo = styled.h3`
  font-size: 17px;
  line-height: 28px;
  font-weight: 600;
  margin-bottom: 1px !important;
`;

const TitleSmall = styled.p`
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  margin-bottom: 3px !important;
`;

interface StatsProps {
  poolInfo: any;
}

const Stats: React.FC<StatsProps> = ({ poolInfo }) => {
  const { account, chainId, library } = useActiveWeb3React();
  const block = useBlock();
  const [userStats, setUserStats] = useState({
    busdDeposited: '...',
    bnbDeposited: '...',
    bought: '...',
  });

  const fetchuserStats = useCallback(async () => {
    if (!chainId || !library || !account || !poolInfo?.pool_address) return;
    const poolAddress = `${poolInfo.pool_address}`;
    const contract = getAMOv2Contract(poolAddress, chainId, library, account);
    const bnbdeposited = await contract.bnbDeposits(account);
    const busddeposited = await contract.busdDeposits(account);
    const bought = await contract.Minted(account);
    setUserStats({
      busdDeposited: `${(busddeposited / bn).toString().substring(0, 8)}`,
      bnbDeposited: `${(bnbdeposited / bn).toString().substring(0, 8)}`,
      bought: `${(bought / bn).toString().substring(0, 8)}`,
    });
  }, [account, block]);

  useEffect(() => {
    fetchuserStats();
  }, [account, block]);

  return (
    <>
      <AppBody style={{ backgroundColor: 'rgb(240, 185, 11)' }}>
        <Footer columnLength={3}>
          <div>
            <TitleSmall>Your Minted {poolInfo?.symbol}</TitleSmall>
            <TitleSmall>{userStats?.bought}</TitleSmall>
          </div>
          <div>
            <TitleSmall>Your Deposited BNB</TitleSmall>
            <TitleSmall>{userStats?.bnbDeposited}</TitleSmall>
          </div>
          <div>
            <TitleSmall>Your Deposited BUSD</TitleSmall>
            <TitleSmall>{userStats?.busdDeposited}</TitleSmall>
          </div>
        </Footer>
      </AppBody>
      {/* <div
        className="row dashboard presale justify-content-sm-center"
        style={{ marginTop: '30px' }}
      >
        <div className="col-lg-4">
          <div className="box6 light">
            <span className="title">
              <img className="boxesIcon" src={Ninja_icon} />
              Your Minted Ninja
            </span>
            <span className="sub" id="yourEthDeposited">
              {userStats.bought}
            </span>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="box6 light">
            <span className="title">
              <img className="boxesIcon" src={bnbIcon} />
              Your BNB Deposited
            </span>
            <span className="sub" id="yourEthDeposited">
              {userStats.deposited}
            </span>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="box6 light">
            <span className="title">
              <img className="boxesIcon" src={Ninja_icon} />
              Total Ninja Sold
            </span>
            <span className="sub" id="yourClaimablezwap">
              {userStats.totalNinjaSold}
            </span>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Stats;
