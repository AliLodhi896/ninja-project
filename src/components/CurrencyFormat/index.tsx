import React from 'react';
import styled from 'styled-components';
const Currency = require('react-currency-format');

type CurrencyFormatProps = {
  last?: number;
  value?: number | string;
  prefix?: string;
};

export default function CurrencyFormat({ last, value, ...rest }: CurrencyFormatProps) {
  return (
    <Currency
      {...rest}
      value={Number(value ?? '...').toFixed(last ?? 2)}
      displayType={'text'}
      thousandSeparator={true}
      renderText={(value: any) => value}
    />
  );
}
