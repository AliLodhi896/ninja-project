/* eslint-disable react-hooks/rules-of-hooks */
/* @ts-ignore */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import useWindowDimensions from '../../hooks/useWindowDimension';
import Select from 'react-dropdown-select';
import { useAllTokens, useCurrency, useToken } from '../../hooks/Tokens';
import { isAddress } from '../../utils';
import _ from 'lodash';
const deepEqual = require('deep-equal');

const Table = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 10px;
  box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
  color: rgb(255, 255, 255);
  position: relative;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 16px 24px 16px 24px;

  & span {
    /* color: ${({ theme }) => theme.primary1}; */
    font-size: 16px;
    font-weight: 800;
    
  }
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    justify-content: center;
  `}
`;

const HeaderButtons = styled.div`
  padding-left: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    justify-content: center;
    padding-left: 0;
    padding-top: 15px;
  `}
`;

const StyledSelect = styled(Select)`
  width: 200px !important;
  align-items: center !important;
  height: 3rem !important;
  font-size: 20px !important;
  font-weight: 500 !important;
  background: rgb(44, 47, 54) !important;
  color: #ffffff !important;
  border-color: rgb(64, 68, 79) !important;
  border-width: 1px !important;
  border-radius: 12px !important;
  outline: none !important;
  user-select: none !important;
  padding: 0 0.5rem !important;
  margin: 0 !important;

  .react-dropdown-select-clear,
  .react-dropdown-select-dropdown-handle {
    color: #fff;
    align-items: center;
    justify-content: center;
    height: 17px !important;
    line-height: 0 !important;
  }
  .react-dropdown-select-option {
    border: 0 !important;
    padding: 3px 0 3px 0 !important;
  }
  .react-dropdown-select-item {
    color: #333;
  }
  .react-dropdown-select-input {
    color: #fff;
  }
  .react-dropdown-select-dropdown {
    position: absolute;
    left: -1px !important;
    width: 200px;
    padding: 15px 0 0 0 !important;
    display: flex;
    flex-direction: column;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-color: rgb(64, 68, 79) !important;
    border-width: 1px !important;
    border-top: none !important;
    max-height: 300px;
    overflow: auto;
    z-index: 9;
    background: rgb(44, 47, 54) !important;
    box-shadow: none;
    color: #fff !important;
    margin: 0 !important;
    top: 2.34rem !important;
  }
  .react-dropdown-select-item {
    color: #f2f2f2;
    border: 0 !important;

    :hover {
      color: #ffffff80;
    }
  }
  .react-dropdown-select-item.react-dropdown-select-item-selected,
  .react-dropdown-select-item.react-dropdown-select-item-active {
    background: #111;
    color: #fff;
    font-weight: bold;
  }
  .react-dropdown-select-item.react-dropdown-select-item-disabled {
    background: #777;
    color: #ccc;
  }
`;

const StyledItem = styled.div`
  color: #333;
  color: #f2f2f2;
  border: 0 !important;
  font-size: 16px !important;
  ont-weight: 800 !important;
  padding: 5px 10px !important;
  cursor: pointer !important;
  display: flex;
  align-items: center;

  .item-icon-wrapper {
    display: flex;
  }
  .item-icon-wrapper img {
    flex-shrink: 0;
    height: 18px;
  }
  .item-icon-wrapper img:first-child {
    position: relative;
    z-index: 2;
  }
  .item-icon-wrapper img:last-child {
    position: relative;
    z-index: 1;
    right: 5px;
  }

  :hover {
    color: #ffffff80;
  }
  :selected,
  :active {
    background: #111;
    color: #fff;
    font-weight: bold;
  }
  :disabled {
    background: #777;
    color: #ccc;
  }
`;

const PAIRS: any = [
  {
    address:
      '0x93e7567f277F353d241973d6f85b5feA1dD84C10_0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    base_id: '0x93e7567f277F353d241973d6f85b5feA1dD84C10',
    base_name: 'NinjaSwap',
    base_symbol: 'NINJA',
    quote_id: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    quote_name: 'BUSD Token',
    quote_symbol: 'BUSD',
  },
  {
    address:
      '0x93e7567f277F353d241973d6f85b5feA1dD84C10_0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    base_id: '0x93e7567f277F353d241973d6f85b5feA1dD84C10',
    base_name: 'NinjaSwap',
    base_symbol: 'NINJA',
    quote_id: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    quote_name: 'Wrapped BNB',
    quote_symbol: 'BNB',
  },
  {
    address:
      '0x24C1B8c8d78CC00Ce6e0fD9c62FEC07a19E7faBE_0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    base_id: '0x24C1B8c8d78CC00Ce6e0fD9c62FEC07a19E7faBE',
    base_name: '8BIT Token',
    base_symbol: '8BIT',
    quote_id: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    quote_name: 'Wrapped BNB',
    quote_symbol: 'BNB',
  },
  {
    address:
      '0x8Cbae8Ba8756e57496D29a67819ff96Ae2Ba8017_0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    base_id: '0x8Cbae8Ba8756e57496D29a67819ff96Ae2Ba8017',
    base_name: 'Cobalt Lend',
    base_symbol: 'CBLT',
    quote_id: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    quote_name: 'BUSD Token',
    quote_symbol: 'BUSD',
  },
  {
    address:
      '0xE63969620AaC596f68AEe7Fa1D795026bf27Ff18_0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    base_id: '0xE63969620AaC596f68AEe7Fa1D795026bf27Ff18',
    base_name: 'XNINJASwap',
    base_symbol: 'XNINJA',
    quote_id: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    quote_name: 'Wrapped BNB',
    quote_symbol: 'BNB',
  },
  {
    address:
      '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c_0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    base_id: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    base_name: 'Wrapped BNB',
    base_symbol: 'BNB',
    quote_id: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    quote_name: 'BUSD Token',
    quote_symbol: 'BUSD',
  },
].map((p) => ({ ...p, label: `${p?.base_symbol} / ${p?.quote_symbol}` }));

export default function TradePairSelect({ onSelect }: { onSelect?: (params: any) => void }) {
  // const block = useBlock();
  // const { account } = useActiveWeb3React();
  const [searchQuery, setSearchQuery] = useState<any | undefined>(undefined);
  const [firstToken, secondToken] = [
    useCurrency(searchQuery?.firstTokenId) ?? undefined,
    useCurrency(searchQuery?.secondTokenId) ?? undefined,
  ];

  const { width: screenWidth } = useWindowDimensions();

  // const bnbCurrency = useCurrency('BNB');

  const onSelectedPairChange = (value: any) => {
    value = _.cloneDeep(value[0]);
    if (value?.base_symbol === 'BNB') {
      value.base_id = 'BNB';
    } else if (value?.quote_symbol === 'BNB') {
      value.quote_id = 'BNB';
    } else {
      value.base_id = isAddress(value?.base_id);
      value.quote_id = isAddress(value?.quote_id);
    }

    setSearchQuery({
      firstTokenId: value?.base_id || '',
      secondTokenId: value?.quote_id || '',
      pairData: value,
    });
  };

  useEffect(() => {
    if (firstToken) {
      console.log('Traid pair selecting');
      onSelect && onSelect({ firstToken, secondToken, pairData: searchQuery?.pairData });
    }
  }, [firstToken, secondToken]);

  useEffect(() => {
    // initialize with Ninja/BNB
    //socket.once('pong', function() {
    onSelectedPairChange([PAIRS[1]]);
    // });
  }, []);

  return (
    <>
      <Table>
        <Header>
          <span>Select Token Pair:</span>
          <HeaderButtons>
            <StyledSelect
              values={[PAIRS[1]]}
              options={PAIRS}
              labelField="label"
              valueField="address"
              searchable={false}
              color="#333"
              dropdownGap={0}
              onChange={(value) => onSelectedPairChange(value)}
              itemRenderer={({ item, methods }: any) => (
                <StyledItem>
                  <div className="item-icon-wrapper">
                    <img
                      src={`https://raw.githubusercontent.com/ninjaswapapp/tokens-list/master/logo/bsc/${item.base_id}.png`}
                      alt={item.base_name}
                    />
                    <img
                      src={`https://raw.githubusercontent.com/ninjaswapapp/tokens-list/master/logo/bsc/${item.quote_id}.png`}
                      alt={item.quote_name}
                    />
                  </div>
                  {item.disabled ? (
                    <span className="react-dropdown-select-item" aria-disabled>
                      {item.label}
                    </span>
                  ) : (
                    <span
                      className="react-dropdown-select-item"
                      onClick={() => methods.addItem(item)}
                    >
                      {item.label}
                    </span>
                  )}
                </StyledItem>
              )}
            />
          </HeaderButtons>
        </Header>
      </Table>
    </>
  );
}
