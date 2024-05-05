import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useActiveWeb3React } from '../../hooks';
import NinjaIcon from '../../assets/images/xNinja_icon.png';
import NinjaMac from '../../assets/images/ninja-mac.png';
import KatanaIcon from '../../assets/img/Katana.png';
import styled, { ThemeContext } from 'styled-components';
import { darken } from 'polished';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faTelegram as fabTelegram,
  faTwitter as fabTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { SeoHelmet } from '../../components/SeoHelmet';
import Countdown from 'react-countdown';
import SnapshotsTable from './components/SnapshotsTable';

import { data } from 'jquery';
import { filterSnapshots } from './filtering';
import { useTranslation } from 'react-i18next';
import useAdvenceTranslation from '../../hooks/useAdvenceTranslation';
import { airdropClaim } from '../../utils/axios';
import Notification from '../../components/Notification/Notification';
import Alert from '@material-ui/lab/Alert';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
const snapshotsJson = require('../../assets/json/snapshot.json');

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function convertDateToUTC(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

const StyledLink = styled.a`
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme }) => theme.text1};

  &.active {
    font-weight: 500;
    color: ${({ theme }) => 'rgb(240, 185, 11) !important'};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

const LIST = [
  {
    title: 'NINJA-CAKE',
    APY: '...',
    Earn: 'NINJA',
    Deposit: 'NINJA-CAKE LP',
    lpAddress: '0x785C435B15d3Be5C5EedC5037b1da704f5a66349',
    Pid: '2',
    logo1: NinjaIcon,
    logo2:
      'https://raw.githubusercontent.com/Bscex/bscex-token-list/master/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
  },
];

export default function Airdrop() {
  const { account } = useActiveWeb3React();
  const [snapshotData, setSnapshotData] = useState<any | undefined>(undefined);
  const { t, _t } = useAdvenceTranslation({ prefix: 'airdropPage' });
  const [loading, setLoading] = useState(false);
  const [claimData, setClaimData] = useState<any>(undefined);

  const handleClaim = async () => {
    if (!account) {
      Notification.notification({
        type: 'warning',
        message: 'Please connect your wallet.',
      });
      return;
    }
    setLoading(true);
    setClaimData((await airdropClaim({ userWalletId: account })) || undefined);
    setLoading(false);
  };

  useEffect(() => {
    /* socket.on('SnapShotStats', (data: any) => {
       if (data?.data && data.data instanceof Array) {
        data.data = data.data.sort((a: any, b: any) =>
          Number(a.trade_timestamp) > Number(b.trade_timestamp)
            ? -1
            : Number(a.trade_timestamp) < Number(b.trade_timestamp)
            ? 1
            : 0,
        );
      } 

      console.log(data);

      setSnapshotData(data);
    }); */

    setSnapshotData(snapshotsJson);

    return () => {
      // When the page changes then the pair_data event should be off otherwise it keeps downloading
      // socket.off('SnapShotStats');
    };
  }, []);

  return (
    <>
      <SeoHelmet title="Cake Airdrop" />
      <div className="main container" id="">
        <div
          className="row justify-content-sm-center justify-content-md-center"
          style={{ textAlign: 'center' }}
        >
          <div className="col-lg-10">
            <img className="indexImage" src={NinjaMac} alt="Ninja airdrop" />
            <h1 className="subTitle">{_t('airdropNinja')}</h1>
            <h4 className="">{_t('claimsStart')}</h4>

            {/* <Countdown
                date={convertDateToUTC(new Date(2021, 3, 30, 1, 1))}
                renderer={({ days, hours, minutes, seconds }) => (
                  <div className="Countdown">
                    <span className="Countdown-col">
                      <span className="Countdown-col-element">
                        <strong>{days}</strong>
                        <span>{days === 1 ? t('datetime:day') : t('datetime:days')}</span>
                      </span>
                    </span>

                    <span className="Countdown-col">
                      <span className="Countdown-col-element">
                        <strong>{hours}</strong>
                        <span>{t('datetime:hours')}</span>
                      </span>
                    </span>

                    <span className="Countdown-col">
                      <span className="Countdown-col-element">
                        <strong>{minutes}</strong>
                        <span>{t('datetime:min')}</span>
                      </span>
                    </span>

                    <span className="Countdown-col">
                      <span className="Countdown-col-element">
                        <strong>{seconds}</strong>
                        <span>{t('datetime:sec')}</span>
                      </span>
                    </span>
                  </div>
                )}
              /> */}
            <div className="d-flex justify-content-center">
              <p>This airdrop was total amount of 120k ninja tokens to Cake holders and Ninja-cake-LP staking users , with ratio to cake holders are 3:1 and Ninja-cake-LP staking users 6:1 
                transactions details are <a target="blank" href="https://github.com/ninjaswapapp/cake-snapshot#ninjaswaps-airdrop">here</a></p>

            </div>
            <div
              style={
                claimData
                  ? { margin: '30px', display: 'flex', justifyContent: 'center' }
                  : { display: 'none' }
              }
            >
              <ThemeProvider theme={theme}>
                <Alert severity={claimData?.status ? 'success' : 'warning'} variant="filled">
                  {claimData?.msg}
                </Alert>
              </ThemeProvider>
            </div>

            <div className="d-flex justify-content-center">
              <div className="col-sm-12 col-lg-10">
          
                <div className="row" style={{ marginTop: '2rem' }}>
                  <SnapshotsTable list={snapshotData?.addresses} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* renderContent() */}
      </div>
    </>
  );
}
