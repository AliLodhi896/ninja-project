/* @ts-ignore */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Spinner from 'react-bootstrap/Spinner';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Pagination from '@material-ui/lab/Pagination';
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
  border-radius: 10px;
  margin: 0px 0px;
`;

type ReferralUsersTableProps = {
  users?: Array<any>;
  loading?: boolean;
  paginate?: number;
};
export default function ReferralUsersTable({
  users,
  loading,
  paginate = 5,
}: ReferralUsersTableProps) {
  // const block = useBlock();
  // const { account } = useActiveWeb3React();
  const { _t } = useAdvenceTranslation({ prefix: 'airdropPage:snapshotsTable' });

  const [page, setPage] = useState(1);
  const [filteredList, setFilteredList] = useState<any[]>([]);

  const pageCount = Math.ceil((users?.length || 0) / paginate);

  useEffect(() => {
    if (users) {
      setFilteredList(users);
    }
    console.log('useEffect');
  }, [users]);

  const handleChange = (event: any, value: any) => {
    setPage(value);
  };

  const renderTable = () => {
    return (
      <table className="table-responsive-stack" id="">
        <thead className="thead-dark">
          <tr>
            <th scope="col" style={{ width: '70%' }}>
              User Address
            </th>
            <th scope="col" style={{ width: '30%', textAlign: 'center' }}>
              Total Points Earned
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredList
            .slice(page * paginate - paginate, page * paginate)
            ?.map((data: any, index: number) => (
              <tr key={String(index)}>
                <td data-label="User Address">{data?.walletId}</td>
                <td
                  style={{ textAlign: 'center', fontWeight: 'bold' }}
                  data-label="Total Points Earned"
                >
                  {data?.tpoints}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };
  return (
    <>
      <Table>
        <Header>
          <span></span>
          {/* <HeaderButtons>buttons</HeaderButtons> */}
        </Header>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center p-3">
            <Spinner as="span" animation="border" role="status" aria-hidden="true" />
          </div>
        ) : users !== undefined && users && users.length ? (
          <>
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
            <span>Please share your referral url more to earn more points</span>
          </div>
        )}
      </Table>
    </>
  );
}
