import React from 'react';
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import { Helmet } from 'react-helmet';
import { useNinaStatsState } from '../../state/stats/hooks';
import CurrencyFormat from '../CurrencyFormat';

type SeoHelpetProperties = {
  title?: string;
  description?: string;
};

export function SeoHelmet({ title, description }: SeoHelpetProperties) {
  const ninjaStats = useNinaStatsState();

  const renderDefaultPrice = () => {
    return ninjaStats?.price
      ? renderToString(<CurrencyFormat value={ninjaStats?.price} last={2} prefix="$" />)
      : '';
  };

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>
        Ninja Swap {renderDefaultPrice()}{title ? ` - ${title}` : ''}
      </title>
     {/*  <meta
        name="description"
        content={
          description ?? 'The first project launching via Novel AMO (Automatic Minting Offering )'
        }
      /> */}
      {/* <meta
        name="keywords"
        content="Defi,Dex,Swap,Binance,Binance Smart Chain,BSC,Farm,StakeDefi,Dex,Swap,Binance,Binance Smart Chain,BSC,Farm,Stake"
      /> */}
    </Helmet>
  );
}
