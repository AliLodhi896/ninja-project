import React, { useEffect, useState } from 'react';
import { useActiveWeb3React } from '../../hooks';
import NinjaIcon from '../../assets/images/Ninja_icon.png';
import Referral from './components/Referral';
import { useBountyActionHandlers } from '../../state/bounty/hooks';
import Stats from './components/Stats';
import Spinner from 'react-bootstrap/Spinner';
import { BodyWrapper, CardSection } from './components/Card';
import Telegram from './components/Telegram';
import Twitter from './components/Twitter';
import { SeoHelmet } from '../../components/SeoHelmet';
import useBountyApi from '../../hooks/useBountyApi';
import Youtube from './components/Youtube';
import Article from './components/Article';
import Gif from './components/Gif';
import ReferralUsersTable from './components/ReferralUsersTable';

// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'

export default function Bounty() {
  const { account } = useActiveWeb3React();

  const { onDisconnect } = useBountyActionHandlers();
  const { getUserBounty } = useBountyApi();

  const [referralAddress, setReferralAddress] = useState(undefined);
  const [userBountyStatus, setUserBountyStatus] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const loadBountyStatus = () => {
    if (account) {
      //setUserBountyStatus(undefined);
      // setIsLoading(true);
      getUserBounty(account).then((data) => {
        setUserBountyStatus(data);
        setIsLoading(false);
      });
    } else {
      onDisconnect();
      setUserBountyStatus(undefined);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBountyStatus();
  }, [account]);

  const renderContent = () => {
    /* if (!account) {
      return (
        <>
          <div className="d-flex justify-content-center align-items-center p-3">
            <h3 style={{ color: 'orange', textAlign: 'center' }}>
              Please connect your wallet to continue
            </h3>
          </div>
        </>
      );
    } */
    return (
      <>
        <CardSection>
          <Telegram status={userBountyStatus} statusLoader={loadBountyStatus} />
          <Twitter status={userBountyStatus} statusLoader={loadBountyStatus} />
          <Youtube status={userBountyStatus} statusLoader={loadBountyStatus} />
          <Article status={userBountyStatus} statusLoader={loadBountyStatus} />
          <Gif status={userBountyStatus} statusLoader={loadBountyStatus} />
        </CardSection>
        {/*  <div className="profile-form">
          <ThemeProvider theme={theme}>
            <div className="field">
              <div className="label">Email:</div>
              <TextField
                type="text"
                onChange={() => {}}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                variant="outlined"
                className="text-input"
              />
            </div>
          </ThemeProvider>
        </div> */}
      </>
    );
  };

  /* return (
    <>
      <SeoHelmet title="Bounty" />
      <div className="main container" id="">
        <div className="d-flex justify-content-center">
          <BodyWrapper className="col-sm-12 col-lg-10">
            <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
              <img alt="..." className="profile-icon" src={NinjaIcon} />
              <h2 className="subTitle">Ninja Bounty</h2>
              <span className="subTitle">Coming soon on 25th April</span>
            </div>
          </BodyWrapper>
        </div>
      </div>
    </>
  );
 */
  return (
    <>
      <SeoHelmet title="Bounty" />
      <div className="main container" id="">
        <div className="d-flex justify-content-center">
          <BodyWrapper className="col-sm-12 col-lg-10">
            <div style={{ textAlign: 'center', marginBottom: '15px', marginTop: '30px' }}>
              <img alt="..." className="profile-icon" src={NinjaIcon} />
              <h2 className="subTitle" style={{ marginBottom: '20px' }}>
                Ninja Bounty
              </h2>
              <p style={{ textAlign: 'justify', padding: '0 23px 10px 23px', margin: 0 }}>
                If you think you have completed the tasks, please refresh the page after connect
                your accounts.
              </p>
              <p style={{ textAlign: 'justify', padding: '0 23px 5px 23px', margin: 0 }}>
                If someone collects points using your bounty referral link, 10% of the points
                collected by the person who use your referral will be added to your total points.
                Don't forget to share your referral link.
              </p>
            </div>

            {/* {referralAddress && (
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center',
                  marginTop: '5px',
                  marginBottom: '20px',
                }}
              >
                <span className="" style={{ fontSize: 18, fontWeight: 700, color: 'orange' }}>
                  Congratulations! You have referred url. You will earn more points.
                </span>
              </div>
            )}
 */}
            {account && isLoading ? (
              <div className="row justify-content-center">
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              </div>
            ) : (
              renderContent()
            )}

            <p
              className="subTitle"
              style={{ fontSize: 18, fontWeight: 700, padding: '20px', textAlign: 'center' }}
            >
              * YouTube, Article and Gif meme links will be approved by team manually, so it can
              take time according to number of requests.
            </p>
          </BodyWrapper>
        </div>
        <div className="d-flex justify-content-center">
          <div className="col-sm-12 col-lg-10" style={{ marginTop: '35px' }}>
            <Referral
              loading={isLoading}
              status={userBountyStatus}
              setReferralAddress={setReferralAddress}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <BodyWrapper className="col-sm-12 col-lg-10" style={{ marginTop: '35px' }}>
            <Stats status={userBountyStatus} />
          </BodyWrapper>
        </div>
      </div>
    </>
  );
}
