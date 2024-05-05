import React, { useState, useEffect } from 'react';
import { useActiveWeb3React } from '../../hooks';
import LogoDark from '../../assets/img/Ninja_Logo_DarkVer.png';
import styled, { ThemeContext } from 'styled-components';
import { darken, lighten } from 'polished';
import useBlock from '../../hooks/useBlock';
import Spinner from 'react-bootstrap/Spinner';
import { getStarterPoolDetail, getStarterPools } from '../../utils/axios';
import moment from 'moment';
import { RouteComponentProps, useHistory } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from 'react-bootstrap/Button';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faTint } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';
import Notification from '../../components/Notification/Notification';
import { getNinjaStarterContract, getBUSDContract } from '../../utils';
import SmallCountdown from './SmallCountdown';
import { SeoHelmet } from '../../components/SeoHelmet';
import { Alert, IAlertConfig } from "./components/Alert";

import {
  isTransactionRecent,
  useAllTransactions,
  useTransactionAdder,
} from '../../state/transactions/hooks';

export const TwitterIcon = (props: any) => <FontAwesomeIcon {...props} icon={fabTwitter} />;
// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'
// @ts-ignor
const commaNumber = require('comma-number');

const Grid = styled.div`
  background: ${({ theme }) => darken(0.1, theme.bg2)};
  background: linear-gradient(
    50deg,
    ${({ theme }) => darken(0.1, theme.bg2)} 53%,
    rgba(84, 84, 84, 0.5872724089635855) 100%
  );
  border: 1px solid ${({ theme }) => darken(0.3, theme.bg2)};
  border-radius: 10px;
  width: 90%;
  padding: 24px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Image = styled.div``;

const Label = styled.div`
  margin-left: auto;
`;

const CoinName = styled.h2`
  font-size: 28px;
  line-height: 34px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const Title = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  margin-bottom: 3px !important;
  margin-top: 6px !important;
`;

const TitleSmall = styled.p`
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  margin-bottom: 3px !important;
`;

const Ratio = styled.h2`
  font-size: 28px;
  line-height: 34px;
  font-weight: 400;
  text-transform: uppercase;
  margin-bottom: 5px !important;
  margin-top: 0;
  padding-top: 0;
`;

const Progress = styled.div`
  margin-bottom: 16px;
`;

const ProgressFooter = styled.div`
  padding-top: 6px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  display: grid;
  grid-template-columns: auto auto;
`;

const Footer = styled.div<{ columnLength: number }>`
  margin-top: 8px !important;
  display: grid;
  grid-template-columns: repeat(${({ columnLength }) => columnLength}, 1fr);
  grid-gap: 16px;
  text-align: center;
`;

const TextInfo = styled.h3`
  font-size: 17px;
  line-height: 28px;
  font-weight: 600;
  margin-bottom: 1px !important;
`;

const Table = styled.div`
  background: ${({ theme }) => darken(0.1, theme.bg2)};
  border: 1px solid ${({ theme }) => darken(0.3, theme.bg2)};
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
  background: transparent;
  border-radius: 10px;
  margin: 0px 0px;
`;

const HeaderButtons = styled.div`
  float: right;
  align-items: center;
`;

const LabelSuccess = styled.div`
  background-color: #d1fae5;
  color: #10b981;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  padding: 6px 9px;
  border-radius: 50px;
`;

const LabelUpcoming = styled.div`
  background-color: #fff3cd;
  color: #856404;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  padding: 6px 9px;
  border-radius: 50px;
`;

const LabelFinished = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  padding: 6px 9px;
  border-radius: 50px;
`;

const TokenAddress = styled.p`
  font-size: 22px;
  font-size: 1.6vw;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 3.1vw;
  `}
`;

const DetailTable = styled.table`
  width: 100%;

  th {
    padding: 10px 0 10px 0;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    td {
      text-align: left !important;
      padding-left: 8px !important;
      font-size: 3.1vw;
    }
  `}
`;

const BackButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center;
  `}
`;

const PatternedBackgrond = styled.div`
  position: absolute;
  width: 100%;
  height: 60vh;
  box-shadow: 50px 50px 113px black inset, -50px -50px 110px black inset;
  background-color: #000000;
  opacity: 0.3;
  background: radial-gradient(
      circle,
      transparent 20%,
      #000000 20%,
      #000000 80%,
      transparent 80%,
      transparent
    ),
    radial-gradient(circle, transparent 20%, #000000 20%, #000000 80%, transparent 80%, transparent)
      20px 20px,
    linear-gradient(#e8ce04 1.6px, transparent 1.6px) 0 -0.8px,
    linear-gradient(90deg, #e8ce04 1.6px, #000000 1.6px) -0.8px 0;
  background-size: 40px 40px, 40px 40px, 20px 20px, 20px 20px;
`;

const CoinDex = styled.p`
  font-size: 12px;
  line-height: 10px;
  font-weight: 600;
  color: #727480;
  margin-bottom: 16px !important;
`;

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: 'rgb(240,185,11)',
    },
  },
});

export default function IfoDetail({
  match: {
    params: { symbol },
  },
}: RouteComponentProps<{ symbol: string }>) {
  const block = useBlock();
  const { account, chainId, library } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();
  const [poolDetail, setPoolDetail] = useState<any>(false);
  const [myVestings, setMyVestings] = useState<any>(false);
  const [claimbtn, setClaimBtn] = useState<any>(false);
  const [firstclaimbtn, setFirstclaimbtn] = useState<any>(false);
  const [myTokens, setMyTokens] = useState<any>(false);
  const [value, setValue] = useState(0);
  const poolInfo = poolDetail?.poolInfo;
  const history = useHistory();
  const [alertConfig, setAlertConfig] = useState<IAlertConfig>({
    showAlert: false,
    alertType: "danger",
    alertMessage: "",
  });
  const percentage = (poolInfo?.total_token_sale > 0
    ? (poolInfo?.total_sold / poolInfo?.total_token_sale) * 100
    : 0
  ).toFixed(2);

  const loadPoolDetail = async () => {
    console.log("Loading details : ");
    const data = await getStarterPoolDetail(symbol);
    if (data) {
      setPoolDetail(data);
      if (data.poolInfo.pool_address != null && data.poolInfo.pool_address != '') {
        await getMyvestings();
      }
    } else {
      history.push('/ninja-starter');
    }

  };
  const ClaimInitialClick = async () => {
    if (!chainId || !library || !poolInfo || !account) return;
    const contract = getNinjaStarterContract(poolInfo.pool_address, chainId, library, account);
    await contract.initialTokenClaim().then((response: any) => {
      addTransaction(response, {
        summary: 'Initial Released Tokens',
      });
      Notification.notification({
        type: 'success',
        message: 'Transaction Successful',
      });
    });

  };
  const ClaimClick = async () => {
    if (!chainId || !library || !poolInfo || !account) return;
    const contract = getNinjaStarterContract(poolInfo.pool_address, chainId, library, account);
    await contract.releaseAll().then((response: any) => {
      addTransaction(response, {
        summary: 'Released Tokens',
      });
      Notification.notification({
        type: 'success',
        message: 'Transaction Successful',
      });
    });

  };

  const getMyvestings = async () => {
    if (account) {
      if (!chainId || !library || !poolInfo || !account) return;
      const contract = getNinjaStarterContract(poolInfo.pool_address, chainId, library, account);
      const bought = await contract.purchases(account);
      const myvestings = await contract.myVestings(account);
      console.log("myvestings " + JSON.stringify(myvestings));
      console.log("myvestings.length " + myvestings.length + " bought " + Number(bought));
      if(myvestings.length == 0 && Number(bought) > 0){
        console.log("do first claim");
        setFirstclaimbtn(true);
      }
      const getTokens = await contract.myTokens();
      setMyTokens(getTokens);
      setMyVestings(myvestings);
      if ((Number(getTokens[2]) / 10 ** 18) > 0) {
        setClaimBtn(true);
      } else {
        setClaimBtn(false);
      }
    }
  };
  const JoinClick = async () => {
    if (!chainId || !library || !account) {
      Notification.notification({
        type: 'error',
        message: 'Please Connect Wallet First',
      });
    } else {
      if (poolInfo.pool_address != null && poolInfo.pool_address != '') {
        const contract = getNinjaStarterContract(poolInfo.pool_address, chainId, library, account);
        const checker = await contract.whitelistChecker();
        if (checker) {
          const isWhitelisted = await contract.isWhitelisted(account);
          const ninjaReq = await contract.NinjaStakingBalanceRequired();
          if (isWhitelisted) {
            history.push(`/ninja-starter/${symbol}/join`);
          } else {
            setAlertConfig({ ...alertConfig, showAlert: true, alertMessage: `You are not whitelisted Please Buy and Stake ${Number(Number(ninjaReq) + 1)} Ninja in ido pool` })
            Notification.notification({
              type: 'error',
              message: `You are not whitelisted Please Buy and Stake ${Number(Number(ninjaReq) + 1)} Ninja`,
            });
          }
        } else {
          history.push(`/ninja-starter/${symbol}/join`);
        }
        console.log("checker : " + checker);

      } else {
        Notification.notification({
          type: 'error',
          message: 'IDO Not Started Yet',
        });
      }

    }

  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <LabelSuccess>
            <span>Active</span>
          </LabelSuccess>
        );
      case 'upcoming':
        return (
          <LabelUpcoming>
            <span>Upcoming</span>
          </LabelUpcoming>
        );
      case 'finished':
        return (
          <LabelFinished>
            <span>Finished</span>
          </LabelFinished>
        );
    }
    return null;
  };

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    loadPoolDetail();
  }, []);
  useEffect(() => {
    loadPoolDetail();
  }, [block]);

  return (
    <ThemeProvider theme={theme}>
      <SeoHelmet title={symbol + ' EIDO'} description={poolInfo?.name + 'EIDO at Ninja EIDO lunchpad fair and fully secure'} />
      <div className="main container mainContainer" id="content">
        <PatternedBackgrond></PatternedBackgrond>
        <div className="row justify-content-sm-center justify-content-md-center">
          <div className="col-xl-12 m-0 col-lg-12 col-sm-12">
            {!poolInfo ? (
              <div className="d-flex justify-content-center">
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              </div>
            ) : (
              <>
                <BackButtonWrapper>
                  <Button
                    onClick={() => history.push(`/ninja-starter`)}
                    className="ninja-button"
                    style={{ border: '0px solid rgb(240, 185, 11)', backgroundColor: '#12161c' }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} size="1x" /> Back to Starter
                  </Button>
                </BackButtonWrapper>
                <Alert
                    dismissable={true}
                    show={alertConfig.showAlert}
                    variant={alertConfig.alertType}
                    onClose={() =>
                      setAlertConfig({ ...alertConfig, showAlert: false })
                    }
                  >
                    <span className="pr-4 pl-5">
                      {alertConfig.alertMessage}
                    </span>
                  </Alert>
                <div className="row" style={{ padding: '25px 0 0px 0' }}>
               
                  <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center py-3">
                      <img
                        style={{
                          maxWidth: '54px',
                          maxHeight: '54px',
                          borderRadius: '48px',
                          width: '48px',
                          height: '48px',
                        }}
                        src={poolInfo?.logo}
                        alt=""
                      />
                      <h1 className="subTitle pt-2">
                        {poolInfo?.name} {getStatusBadge(poolInfo?.status)}
                      </h1>
                      <div className="social-links">
                        <a
                          className="pl-1 pr-1"
                          rel="noreferrer"
                          target="_blank"
                          href={poolInfo?.twitter}
                        >
                          {' '}
                          <TwitterIcon size="3x" color="#f3ba2f" />
                        </a>
                        <a
                          className="pl-1 pr-1"
                          rel="noreferrer"
                          target="_blank"
                          href={poolInfo?.website}
                        >
                          {' '}
                          <FontAwesomeIcon icon={faGlobe} size="3x" color="#f3ba2f" />
                        </a>
                      </div>

                      {/* <TokenAddress className="pt-1">{poolInfo?.token_address}</TokenAddress> */}
                      <div className="d-flex justify-content-flex-start py-1">
                        <Button
                          onClick={() => JoinClick()}
                          className="ninja-button"
                          disabled={poolInfo?.status !== 'active'}
                        >
                          Join Pool
                        </Button>
                      </div>
                      {poolInfo?.status == 'upcoming' ? (<SmallCountdown
                        futureDate={poolInfo?.starting_at} status={'TBA'}
                      />) : ''}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center align-items-md-end py-3">
                      <Grid>
                        <div className="align-items-left">
                          <div className="d-flex justify-content-around">
                            <div>
                              <Title>Total Rise BNB</Title>
                              <Ratio>{poolInfo?.total_bnb_raise} BNB</Ratio>
                              <CoinDex style={{ textAlign: 'center' }}>
                                1 BNB = {poolInfo?.estimated_1bnb_tokens} {poolInfo?.symbol}
                              </CoinDex>
                            </div>
                            <div>
                              <Title>Total Rise BUSD</Title>
                              <Ratio>{poolInfo?.total_busd_raise} BUSD</Ratio>
                              <CoinDex style={{ textAlign: 'center' }}>
                                {poolInfo?.price_busd} BUSD = 1 {poolInfo?.symbol}
                              </CoinDex>
                            </div>
                          </div>
                        </div>
                        <Progress>
                          <Title style={{ display: 'flex', paddingBottom: '5px' }}>
                            Progress
                            <span style={{ color: '#727480', paddingLeft: '6px' }}>
                              {percentage}%
                            </span>
                          </Title>

                          <div className="progress" style={{ height: '7px' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: 'rgb(240,185,11)',
                              }}
                              aria-valuenow={Number(percentage)}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>

                          <ProgressFooter>
                            <div style={{ color: '#727480' }}>{/* (Min. 50%) */}</div>
                            <div style={{ color: '#727480', marginLeft: 'auto' }}>
                              {poolInfo?.total_sold} / {poolInfo?.total_token_sale}
                            </div>
                          </ProgressFooter>
                        </Progress>

                        <Footer columnLength={2}>
                          <div>
                            <FontAwesomeIcon icon={faDollarSign} size="3x" color="#f3ba2f" />
                            <TitleSmall>Presale Price</TitleSmall>
                            <TextInfo>{poolInfo?.price_busd} BUSD</TextInfo>
                          </div>
                          <div>
                            <FontAwesomeIcon icon={faUser} size="3x" color="#f3ba2f" />
                            <TitleSmall>Participants</TitleSmall>
                            <TextInfo>{poolInfo?.participants}</TextInfo>
                          </div>
                          <div>
                            <FontAwesomeIcon icon={faTint} size="3x" color="#f3ba2f" />
                            <TitleSmall>
                              Liquidity   {poolInfo?.liquidity}%
                            </TitleSmall>
                            <TextInfo>Locked for {poolInfo?.liquidityLock} days</TextInfo>
                          </div>
                          <div>
                            <FontAwesomeIcon icon={faTrophy} size="3x" color="#f3ba2f" />
                            <TitleSmall>
                              Reward
                            </TitleSmall>
                            <TextInfo>{poolInfo?.reward}%</TextInfo>
                          </div>

                        </Footer>
                        {poolInfo?.reward > 0 ? (
                          <p style={{ marginBottom: '0px' }}>* Note : {poolInfo?.rewardMsg}</p>
                        ) : (
                          ''
                        )}
                      </Grid>
                    </div>
                  </div>
                </div>

                <div className="row justify-content-center pt-3">
                  <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    aria-label="Pool tabs"
                  >
                    <Tab label="Details" />
                    {account ? <Tab label="Your Allocation" /> : ''}
                    <Tab label="About" />
                  </Tabs>
                </div>
                <TabPanel value={value} index={0}>
                  <div className="row justify-content-center ">
                    <div className="col-md-6 pt-4">
                      <Table>
                        <Header>
                          <span>Pool Information</span>
                        </Header>
                        <Body>
                          <DetailTable id="trade_table1">
                            <tbody>
                              <tr>
                                <th scope="row">Cap Per User</th>
                                <td style={{ textAlign: 'right' }}>
                                  {poolInfo?.max_buy_limit === 0
                                    ? 'No minimum'
                                    : poolInfo?.max_buy_limit}
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Vesting</th>
                                <td style={{ textAlign: 'right' }}>{poolInfo?.vestingMsg}</td>
                              </tr>

                              <tr>
                                <th scope="row">Address</th>
                                <td style={{ textAlign: 'right' }}>
                                  {poolInfo?.pool_address}{' '}
                                  <a
                                    target="_blank"
                                    href={`https://www.bscscan.com/address/${poolInfo?.pool_address}`}
                                  >
                                    <FontAwesomeIcon
                                      icon={faExternalLinkAlt}
                                      size="1x"
                                      color="#f3ba2f"
                                    />
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Status</th>
                                <td style={{ textAlign: 'right', textTransform: 'uppercase' }}>
                                  {poolInfo?.status}
                                </td>
                              </tr>

                            </tbody>
                          </DetailTable>
                        </Body>
                      </Table>
                    </div>
                    <div className="col-md-6 pt-4">
                      <Table>
                        <Header>
                          <span>Token Information</span>
                        </Header>
                        <Body>
                          <DetailTable id="trade_table">
                            <tbody>

                              <tr>
                                <th scope="row">Symbol</th>
                                <td style={{ textAlign: 'right' }}>{poolInfo?.symbol}</td>
                              </tr>
                              <tr>
                                <th scope="row">Decimals</th>
                                <td style={{ textAlign: 'right' }}>{poolInfo?.Decimals}</td>
                              </tr>
                              <tr>
                                <th scope="row">Address</th>
                                <td style={{ textAlign: 'right' }}>
                                  {poolInfo?.token_address}
                                  <a
                                    target="_blank"
                                    href={`https://www.bscscan.com/address/${poolInfo?.token_address}`}
                                  >
                                    <FontAwesomeIcon
                                      icon={faExternalLinkAlt}
                                      size="1x"
                                      color="#f3ba2f"
                                    />
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Total Supply</th>
                                <td style={{ textAlign: 'right' }}>{`${commaNumber(
                                  poolInfo?.total_supply,
                                )}`}</td>
                              </tr>
                            </tbody>
                          </DetailTable>
                        </Body>
                      </Table>
                    </div>
                  </div>
                </TabPanel>
                {account ? (
                  <div className="row justify-content-center ">
                    <div className="col-md-8 pt-4">
                    {firstclaimbtn ? (
                          <p style={{ fontSize: '19px', marginBottom: '0px', textAlign: 'center', letterSpacing: 'normal' }}>
                            <Button
                              onClick={() => ClaimInitialClick()}
                              className="ninja-button"
                            >
                              Claim Initial Tokens
                            </Button></p>
                        ) : ''}
                      <TabPanel value={value} index={1}>
                        <table className="table-responsive-stack" id="">
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col" style={{ width: '15%' }}>
                                ID
                              </th>
                              <th scope="col" style={{ width: '25%' }}>
                                Amount
                              </th>
                              <th scope="col" style={{ width: '35%' }}>
                                Lock Time
                              </th>
                              <th scope="col" style={{ width: '25%' }}>
                                Claim
                              </th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                          {!myVestings.length ? (
                            <div className="d-flex justify-content-center">
                              <Spinner
                                as="span"
                                animation="border"
                                role="status"
                                aria-hidden="true"
                              />
                            </div>
                          ) : (
                            myVestings.map((item: any, index: number) => {
                              return (
                                <tr key={index.toString()}>
                                  <td>{item[0].toString()}</td>
                                  <td>{(Number(item[2]) / 10 ** 18).toFixed(8)}</td>
                                  <td>
                                    <SmallCountdown futureDate={item[1].toString()} status={item[3].toString() == 'false' ? 'Unclaimed' : 'Claimed'} />
                                  </td>
                                  <td>{item[3].toString()}</td>
                                </tr>
                              );
                            })
                          )}
                        </table>
                        <p style={{ fontSize: '19px', marginBottom: '0px', textAlign: 'center', letterSpacing: 'normal' }}>Total : {myTokens ? (Number(myTokens[0]) / 10 ** 18).toFixed(8) : ' 0 '} | Claimed : {myTokens ? (Number(myTokens[1]) / 10 ** 18).toFixed(8) : '0'}</p>
                        <p style={{ fontSize: '19px', marginBottom: '0px', textAlign: 'center', letterSpacing: 'normal' }}>Available for claim : {myTokens ? (Number(myTokens[2]) / 10 ** 18).toFixed(8) : '0'} | Unclaimed : {myTokens ? (Number(myTokens[3]) / 10 ** 18).toFixed(8) : '0'}
                        </p>
                        {claimbtn ? (
                          <p style={{ fontSize: '19px', marginBottom: '0px', textAlign: 'center', letterSpacing: 'normal' }}>
                            <Button
                              onClick={() => ClaimClick()}
                              className="ninja-button"
                            >
                              Claim Tokens
                            </Button></p>
                        ) : ''}
                      </TabPanel>
                    </div></div>
                ) : (
                  ''
                )}

                <TabPanel value={value} index={account ? 2 : 1}>
                  <div className="row justify-content-center pt-4">
                    <div className="col-md-10">
                      <Table>
                        <Header>
                          <span>About</span>
                        </Header>
                        <Body
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(poolInfo?.about),
                          }}
                        ></Body>
                      </Table>
                    </div>
                  </div>
                </TabPanel>
              </>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
