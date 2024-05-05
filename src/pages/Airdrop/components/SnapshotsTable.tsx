/* @ts-ignore */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Spinner from 'react-bootstrap/Spinner';
import CurrencyFormat from '../../../components/CurrencyFormat';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Pagination from '@material-ui/lab/Pagination';
import { filterSnapshots } from '../filtering';
import { SearchInput } from '../../../components/SearchModal/styleds';
import { isAddress } from '../../../utils';
import { useTranslation } from 'react-i18next';
import useAdvenceTranslation from '../../../hooks/useAdvenceTranslation';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

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

const Footer = styled.div`
  padding: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  border-bottom: 1px solid #2c2f36;
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

type SnapshotsTableProps = {
  list?: Array<any>;
  loading?: boolean;
  paginate?: number;
};
export default function SnapshotsTable({ list, loading, paginate = 10 }: SnapshotsTableProps) {
  // const block = useBlock();
  // const { account } = useActiveWeb3React();
  const { _t } = useAdvenceTranslation({ prefix: 'airdropPage:snapshotsTable' });

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredList, setFilteredList] = useState<any[]>([]);

  const pageCount = Math.ceil((list?.length || 0) / paginate);

  useEffect(() => {
    if (list) {
      setFilteredList(filterSnapshots(list, searchQuery));
    }
    console.log('useEffect');
  }, [list, searchQuery]);

  const handleChange = (event: any, value: any) => {
    setPage(value);
  };

  const handleInput = useCallback((event: any) => {
    const input = event.target.value;
    setSearchQuery(input);
    setPage(1);
    // fixedList.current?.scrollTo(0);
  }, []);

  const renderTable = () => {
    return list && filteredList ? (
      <table className="table-responsive-stack" id="">
        <thead className="thead-dark">
          <tr>
            <th scope="col" style={{ width: '50%' }}>
              {_t('address')}
            </th>
            <th scope="col" style={{ width: '20%' }}>
              {_t('balance')}
            </th>
            <th scope="col" style={{ width: '15%' }}>
              {_t('blockNum')}
            </th>
            <th scope="col" style={{ width: '10%' }}>
              {_t('transaction')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredList
            .slice(page * paginate - paginate, page * paginate)
            ?.map((data: any, index: number) => (
              <tr key={String(index)}>
                <td data-label="Address">{data?.address}</td>
                <td data-label="Balance">
                  <CurrencyFormat value={data?.balance} prefix="" last={8} />
                </td>
                <td data-label="Block Num.">{data?.block}</td>
                <td data-label="Transaction">
                  <a href={`https://bscscan.com/tx/${data?.tx}`} target="_blank" rel="noreferrer">
                    {_t('viewTX')}
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    ) : (
      <div className="d-flex justify-content-center align-items-center">
        <span>Please wait</span>
      </div>
    );
  };
  return (
    <>
      <Table>
        <Header>
          <span>{_t('snapshots')}</span>
          {/* <HeaderButtons>buttons</HeaderButtons> */}
        </Header>
        {list !== undefined && list ? (
          <>
            <div style={{ padding: '25px' }}>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={'Search...'}
                value={searchQuery}
                onChange={handleInput}
              />
            </div>
            <Body>{renderTable()}</Body>
            <Footer>
              <ThemeProvider theme={theme}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handleChange}
                  variant="outlined"
                />
              </ThemeProvider>
            </Footer>
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center p-3">
            <Spinner as="span" animation="border" role="status" aria-hidden="true" />
          </div>
        )}
      </Table>
      <div style={{ padding: '25px' }}>
        {/* <p>* {_t('notice1')}</p>
        <p>* {_t('notice2')}</p> */}
      </div>
    </>
  );
}
