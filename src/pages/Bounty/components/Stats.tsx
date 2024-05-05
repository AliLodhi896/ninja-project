import React, { useEffect } from 'react';
import { Base_url } from '../../../constants';
import { decryptText, encryptText } from '../../../utils/compress';
import { getAddress, isAddress } from '@ethersproject/address';
import copy from 'copy-to-clipboard';
import Notification from '../../../components/Notification/Notification';
import useBlock from '../../../hooks/useBlock';
import { useActiveWeb3React } from '../../../hooks';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import QuestionHelper from '../../../components/QuestionHelper';

const StatsColumn = styled.div`
  /* background-color: ${({ theme }) => theme.bg2}; */
  /* padding 15px 15px 3px 15px; */
`;

const StatsRow = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const StatRowLeft = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #e8b32c;
  align-items: flex-start;
  display: flex;
  width: 70%;
  ${({ theme }) => theme.mediaWidth.upToSmall`width: 100%;`};
`;

const StatRowRight = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-align: left;
  display: flex;
  width: 30%;
  ${({ theme }) => theme.mediaWidth.upToSmall`width: 100%;`};
`;

const CardHeader = styled.div`
  margin-bottom: 0;
`;

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const useStyles = makeStyles((theme) => ({
  maxBtn: {
    backgroundColor: '#f0b92d',
    padding: '13px 6px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  textField: {
    marginTop: '20px',
  },
}));
interface StatsProps {
  status?: any;
}

const Stats: React.FC<StatsProps> = ({ status }) => {
  /* const classes = useStyles();
  const { account } = useActiveWeb3React();
  const block = useBlock(); */

  return (
    <>
      <div className="row justify-content-start align-items-center">
        <div className="col-lg-8" style={{ padding: '25px' }}>
          <CardHeader>
            <div className="mb-3 justify-content-between align-items-center">
              <div className="text-left" style={{ fontSize: '30px', fontWeight: 700 }}>
                Info
              </div>
            </div>
          </CardHeader>

          <StatsColumn>
            <StatsRow>
              <StatRowLeft>Total Points Earned from Bounty:</StatRowLeft>
              <StatRowRight>
                {status?.total_point_earned || '...'} Points{' '}
                <QuestionHelper
                  text={
                    'YouTube, Article and Gif meme links will be approve by team manually, so it can take time according to number of requests.'
                  }
                />
              </StatRowRight>
            </StatsRow>
            <StatsRow>
              <StatRowLeft>Total Points Earned From Referred:</StatRowLeft>
              <StatRowRight>{status?.refferals?.points_earn_ref || '0'} Points</StatRowRight>
            </StatsRow>
            <StatsRow>
              <StatRowLeft>Total Users Referred:</StatRowLeft>
              <StatRowRight>{status?.refferals?.total_users || '0'} Users</StatRowRight>
            </StatsRow>
            <StatsRow>
              <StatRowLeft>Total Ninja Reward:</StatRowLeft>
              <StatRowRight>
                0 NINJA <QuestionHelper text={'...'} />
              </StatRowRight>
            </StatsRow>

            {/* <StatsRow>
              <StatRowLeft>Total Ninja Claimable for AMO:</StatRowLeft>
              <StatRowRight>
                ... NINJA{' '}
                <QuestionHelper
                  text={
                    'YouTube, Article and Gif meme links will be approve by team manually, so it can take time according to number of requests.'
                  }
                />
              </StatRowRight>
            </StatsRow> */}
          </StatsColumn>

          {/* <div className="col-sm-6">
            <StatsColumn className="card">
              <StatsRow>
                <StatRowLeft>Your Wallet</StatRowLeft>
                <StatRowRight>3245 Points</StatRowRight>
              </StatsRow>
              <StatsRow>
                <StatRowLeft>Total Ninja Reward Proportion</StatRowLeft>
                <StatRowRight>134.76 NINJA</StatRowRight>
              </StatsRow>
            </StatsColumn>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Stats;
