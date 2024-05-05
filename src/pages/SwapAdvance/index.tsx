import React, { useCallback, useEffect, useState } from 'react';
import { useActiveWeb3React } from '../../hooks';
import styled from 'styled-components';

import useBlock from '../../hooks/useBlock';
import { createMuiTheme } from '@material-ui/core/styles';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faTelegram as fabTelegram,
  faTwitter as fabTwitter,
} from '@fortawesome/free-brands-svg-icons';
import SwapCard from './SwapCard';
import TradeTable from './TradeTable';
import TradeChart from './TradeChart';
import TradePairSelect from './TradePairSelect';
import { useSwapActionHandlers } from '../../state/swap/hooks';
import { Field } from '../../state/swap/actions';
import { SeoHelmet } from '../../components/SeoHelmet';

import { getPairTrades } from '../../utils/axios';

library.add(farCheckCircle, fabTelegram, fabTwitter);

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'

const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  @media (max-width: 769px) {
    padding: 0px;
  }
`;

const Left = styled.div`
  padding-right: 12px;
  padding-left: 12px;
  @media (max-width: 769px) {
    padding: 0;
  }
`;

const Right = styled.div`
  padding-right: 12px;
  padding-left: 12px;
  @media (max-width: 769px) {
    padding: 0;
  }
`;

export default function SwapAdvance() {
  const block = useBlock();
  const { account } = useActiveWeb3React();
  const { onCurrencySelection } = useSwapActionHandlers();
  const [selectedTokens, setSelectedTokens] = useState<any | undefined>(undefined);
  const [pairData, setPairData] = useState<any | undefined>(undefined);

  const isLoading = !pairData || !selectedTokens;

  useEffect(() => {
    /* socket.on('pair_data', (data: any) => {
      console.log('pair_data', data);

      if (data?.data && data.data instanceof Array) {
        data.data = data.data.sort((a: any, b: any) =>
          Number(a.trade_timestamp) > Number(b.trade_timestamp)
            ? -1
            : Number(a.trade_timestamp) < Number(b.trade_timestamp)
            ? 1
            : 0,
        );
      }

      console.log('pair_data', data);
      setPair(data);
    }); */

    /* socket.on('connected', function() {
      socket.emit(
        'subscribe',
        '0x93e7567f277F353d241973d6f85b5feA1dD84C10_0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      );
    }); */

    return () => {
      //socket.off('pair_data');
    };
  }, []);

  const loadPairTrades = async (pair: string) => {
    const data = await getPairTrades(pair);
    
    setPairData(data);
  };

  /* useEffect(() => {
    console.log('selectedTokens', selectedTokens);
    console.log('pair', pair);

    if (selectedTokens && pair) {
      const currentSelectedTokensName = selectedTokens?.pairData?.address;

      if (currentSelectedTokensName === pair.pairId) {
        console.log('Selected Pair is ', pair);
        setSelectedTokenPairData(pair);
      }
    }
  }, [pair]); */

  const handlePairSelect = (tokens: any) => {
    console.log('subscribe for ', tokens?.pairData?.address);
    setSelectedTokens(tokens);
    setPairData(undefined);
    loadPairTrades(tokens?.pairData?.address);
    /* socket.on('pong', function() {
      socket.emit('subscribe', tokens?.pairData?.address);
    }); */
    onCurrencySelection(Field.INPUT, tokens.firstToken);
    onCurrencySelection(Field.OUTPUT, tokens.secondToken);
  };

  // if () return null;

  return (
    <>
      <SeoHelmet title="Swap" description="AMM advanced version of dex with cool UI and trading charts by NinjaSwap" />
      <div className="main body-wrapper" id="">
        <div className="d-flex justify-content-center">
          {/* col-sm-12 col-lg-10 col-xl-12 */}
          <BodyWrapper className="row justify-content-center">
            <Left className="col-sm-12 col-md-12 col-lg-4 mb-4">
              <div className="d-flex justify-content-center">
                <SwapCard />
              </div>
            </Left>
            <Right className="col-sm-12 col-md-12 col-lg-8">
              <div className="d-flex justify-content-center mb-4">
                <TradePairSelect onSelect={handlePairSelect} />
              </div>
              <div className="d-flex justify-content-center mb-4">
                <TradeChart data={pairData} loading={isLoading} />
              </div>
              <div className="d-flex justify-content-center">
                <TradeTable data={pairData} loading={isLoading} />
              </div>
            </Right>
          </BodyWrapper>
        </div>
      </div>
    </>
  );
}
