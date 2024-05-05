import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter';
// import Header from '../components/Header'
import NewHeader from '../components/Header/HeaderNew';
// import TestNet from '../components/TestNet'
import Popups from '../components/Popups';
import Web3ReactManager from '../components/Web3ReactManager';
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader';
import AddLiquidity from './AddLiquidity';
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './AddLiquidity/redirects';
import MigrateV1 from './MigrateV1';
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange';
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange';
import Pool from './Pool';
import PoolFinder from './PoolFinder';
import RemoveLiquidity from './RemoveLiquidity';
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects';
import Swap from './Swap';
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects';
import Home from './Home';
import Staking from './Staking';
import Farms from './Farms';
import Reweards from './Rewards';
import AMO from './AMO';
import Footer from '../../src/components/Footer';
import LeftSidebar from '../../src/components/LeftSidebar';
import Bounty from './Bounty';
import Ifo from './IFO';
import Airdrop from './Airdrop';
import ScrollToTop from '../components/ScrollToTop';
import PageLoader from '../components/PageLoader';
import XNinjaStaking from './XNinjaStaking';
import SwapAdvance from './SwapAdvance';
import { SidebarContextProvider } from '../hooks/useSidebar';

import { useNinjaStatsActionHandlers } from '../state/stats/hooks';
import { useApyActionHandlers } from '../state/apy/hooks';
import { getNinjaPrice } from '../utils/graphQL';
import { getStats } from '../utils/axios';
import { findBy } from '../utils/arrayUtils';
import IfoDetail from './IFO/detail';
import IfoJoin from './IFO/join';
import AMOV2 from './AMOV2'
import AMOV3 from './AMOV3'
import NinjaStarterApplication from './IFO/application';
import Bounties  from './Bounties';
import BountyDetail from './Bounties/detail';
import Pools from './Pools'
import Idopools from './Idopools';
import Locker from './locker';
import Helping from './Helping';



/* function fakeDelay(ms: number) {
  return (promise: Promise<any>) =>
    promise.then(
      (data) =>
        new Promise<any>((resolve) => {
          setTimeout(() => resolve(data), ms);
        }),
    );
}

const Staking = lazy(() => fakeDelay(1000)(import('./Staking'))); */

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

const BodyWrapper = styled.div``;

const Marginer = styled.div`
  margin-top: 4rem;
`;

const App = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  /* const { socket } = useSocketApi(); */
  const { onApyLoad } = useApyActionHandlers();
  const { onNinjaStatsLoad } = useNinjaStatsActionHandlers();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    /* setInterval(function() {
      if (socket.connected) {
        socket.emit('ping');
      } else {
        console.log('Socket: Connecting...');
      }
    }, 2000);

    socket.on('pong', function() {
      console.log('Socket: Connected');
    }); */

    // Call here to fast loading because Farms page is one of the most visited page.
    /* socket.on('APYStats', function(data: any) {
      console.log('APYStats loaded', data);
      onApyLoad(data);
    }); */

    loadNinjaData();

    const interval = setInterval(() => {
      loadNinjaData();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const loadNinjaData = async () => {
    const [stats] = [await getStats()];

    const findById = findBy('id')(stats);

    onNinjaStatsLoad({
      price: String(findById('NINJA')?.value),
      AMO_Price: String(findById('AMO')?.value),
      AMOminted: Number(findById('AMOminted:ninja')?.value),
      TotalBurned: Number(findById('TotalBurned:ninja')?.value),
      marketcap: String(findById('marketcap:ninja')?.value),
      totalSupply: Number(findById('totalSupply:ninja')?.value),
    });

    onApyLoad(
      [
        '0xBFaF396D2D7A29B5C46Af0C544D89c495d258049',
        '0x5720e28DC258961e15a4445D6e6e3335dcB46e99',
        '0x785C435B15d3Be5C5EedC5037b1da704f5a66349',
        '0x2d19458Cb3772D14b613b666968f81e608334d3d',
        '0xc96Fe2f696d895DfE324df83B30e3A17e15D36F9',
        '0xA4b71d458C15697DD138bb003CEbE7c83D72E7AA'
      ].map((token, i) => {
        const tokenStats = findById(token);
        const tokenValue = JSON.parse(tokenStats?.value);
        return {
          Pid: i.toString(),
          lpAddress: token,
          dailyAPY: Number(tokenValue?.dailyAPY),
          weeklyAPY: String(tokenValue?.weeklyAPY),
          monthlyAPY: Number(tokenValue?.monthlyAPY),
          yearlyAPY: Number(tokenValue?.yearlyAPY),
          total_locked_value: String(tokenValue?.total_locked_value),
        };
      }),
    );
  };

  const handleScroll = useCallback(() => {
    // find current scroll position
    const currentScrollPos = window.pageYOffset;

    // set state based on location info (explained in more detail below)
    setVisible(
      (prevScrollPos > currentScrollPos && prevScrollPos - currentScrollPos > 70) ||
        currentScrollPos < 15,
    );

    // set state to new scroll position
    setPrevScrollPos(currentScrollPos);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <Suspense fallback={null} /* fallback={<PageLoader />} */>
      {/* TODO: BrowserRouter will be used here to avoid hash url */}
      <BrowserRouter>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />

        <div style={{ flexDirection: 'row' }}>
          <NewHeader visible={visible} />
        </div>

        <div id="page-overlay"></div>

        <div id="page-container" className="side-scroll sidebar-animated-scroll">
          <HeaderWrapper>{/* <Header /> */}</HeaderWrapper>

          <div id="main-container">
            <div id="mainDiv"></div>
            <Popups />
            <div className="content">
              <LeftSidebar visible={visible} />
              <Web3ReactManager>
                <ScrollToTop>
                  <Switch>
                    <Route exact strict path="/" component={Home} />
                    <Route exact strict path="/staking">
                      <Staking />
                    </Route>
                    <Route exact strict path="/farms">
                      <Farms />
                    </Route>
                    <Route exact strict path="/pools">
                      <Pools />
                    </Route>
                    <Route exact strict path="/ido-pools">
                     <Idopools />
                    </Route>
                    <Route exact strict path="/locker">
                     <Locker />
                    </Route>
                    <Route exact strict path="/swap" component={SwapAdvance} />
                    <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                    <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                    <Route exact strict path="/find" component={PoolFinder} />
                    <Route exact strict path="/pool" component={Pool} />
                    <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                    <Route exact path="/add" component={AddLiquidity} />
                    <Route exact path="/amo" component={AMO} />
                    <Route exact path="/amo-v2" component={AMOV2} />
                    <Route exact path="/amo-v3" component={AMOV3} />
                    <Route
                      exact
                      path="/add/:currencyIdA"
                      component={RedirectOldAddLiquidityPathStructure}
                    />
                    <Route
                      exact
                      path="/add/:currencyIdA/:currencyIdB"
                      component={RedirectDuplicateTokenIds}
                    />
                    <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                    <Route
                      exact
                      strict
                      path="/remove/:tokens"
                      component={RedirectOldRemoveLiquidityPathStructure}
                    />
                    <Route
                      exact
                      strict
                      path="/remove/:currencyIdA/:currencyIdB"
                      component={RemoveLiquidity}
                    />
                    <Route exact strict path="/migrate/v1" component={MigrateV1} />
                    <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} />
                    <Route exact strict path="/rewards" component={Reweards} />
                    <Route exact strict path="/bounty" component={Bounty} />
                    <Route exact strict path="/ninja-starter" component={Ifo} />
                    <Route exact strict path="/bounties" component={Bounties} />
                    <Route exact strict path="/bounties/:id" component={BountyDetail} />
                    <Route
                      exact
                      strict
                      path="/ninja-starter/application"
                      component={NinjaStarterApplication}
                    />
                    <Route exact strict path="/ninja-starter/:symbol" component={IfoDetail} />
                    <Route exact strict path="/ninja-starter/:symbol/join" component={IfoJoin} />
                    <Route exact strict path="/cake-airdrop" component={Airdrop} />
                    <Route exact strict path="/xninja-staking" component={XNinjaStaking} />
                    <Route exact strict path="/helping" component={Helping} />
                    <Route component={RedirectPathToSwapOnly} />
                  </Switch>
                </ScrollToTop>
              </Web3ReactManager>
            </div>
            {/* <TestNet/> */}
            <Marginer />
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </Suspense>
  );
};

export default function AppProvider() {
  return (
    <SidebarContextProvider>
      <App />
    </SidebarContextProvider>
  );
}
