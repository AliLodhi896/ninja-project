/* @ts-ignore */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import useWindowDimensions from '../../hooks/useWindowDimension';
import CurrencyFormat from '../../components/CurrencyFormat';
import { amountFormatter } from '../../utils';

const Table = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 10px;
  box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
  color: rgb(255, 255, 255);
  overflow: hidden;
  position: relative;
  width: 100%;

  th {
    text-align: left;
  }
`;

const Header = styled.div`
  font-size: 16px;
  padding: 24px;
  border-bottom: 1px solid #2C2F36;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & span {
    /* color: ${({ theme }) => theme.primary1}; */
    font-size: 25px;
    font-weight: 800;
  }
`;

const Body = styled.div`
  padding: 18px;

  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 10px;
  margin: 0px 0px;
`;

const HeaderButtons = styled.div`
  float: right;
  align-items: center;
`;

const getColorByTradeType = (trade: any) => {
  return trade.type === 'sell' ? 'red' : 'green';
};

type TradeTableProps = {
  data?: any;
  token?: any;
  loading?: boolean;
};
export default function TradeTable({ data, token, loading }: TradeTableProps) {
  // const block = useBlock();
  // const { account } = useActiveWeb3React();
  // const { width: screenWidth } = useWindowDimensions();

  const renderTable = () => {
    return data ? (
      <table className="table-responsive-stack" id="trade_table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Time</th>
            <th scope="col" style={{ width: '10%' }}>
              Type
            </th>
            <th scope="col">Price</th>
            <th scope="col">Value</th>
            <th scope="col">Amount</th>
            <th scope="col" style={{ width: '10%' }}>
              BSCScan
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((trade: any, index: number) => (
            <tr key={String(index)}>
              <td data-label="Time">{moment.unix(Number(trade.trade_timestamp)).fromNow()}</td>
              <td data-label="Type">
                <span style={{ color: getColorByTradeType(trade) }}>
                  {String(trade.type)
                    .charAt(0)
                    .toUpperCase() + String(trade.type).slice(1)}
                </span>
              </td>
              <td data-label="Price">
                <CurrencyFormat value={trade.price} prefix="" last={8} />
              </td>
              <td data-label="Value">
                <CurrencyFormat value={trade.quote_volume} prefix="" last={8} />
              </td>
              <td data-label="Amount">
                <CurrencyFormat value={trade.base_volume} prefix="" last={8} />
              </td>
              <td data-label="BSCScan">
                <a
                  href={`https://bscscan.com/tx/${trade.trade_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View TX
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="d-flex justify-content-center align-items-center">
        <span>Please select token pair to visualize statistics</span>
      </div>
    );
  };
  return (
    <>
      <Table>
        <Header>
          <span>Last 100 Trades</span>
          {/* <HeaderButtons>buttons</HeaderButtons> */}
        </Header>
        <Body>
          {loading !== undefined && loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner as="span" animation="border" role="status" aria-hidden="true" />
            </div>
          ) : (
            renderTable()
          )}
        </Body>
      </Table>
    </>
  );
}
