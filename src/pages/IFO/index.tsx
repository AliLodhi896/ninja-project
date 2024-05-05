import React, { useState, useEffect } from 'react';
import { useActiveWeb3React } from '../../hooks';
import LogoDark from '../../assets/img/Ninja_Logo_DarkVer.png';
import NinjaMac from '../../assets/images/ninja-mac.png';
import styled, { ThemeContext } from 'styled-components';
import { darken, lighten } from 'polished';
import useBlock from '../../hooks/useBlock';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { faFilePowerpoint } from '@fortawesome/free-regular-svg-icons';
import { getStarterClosedPools, getStarterUpcomingPools, getStarterActivePools } from '../../utils/axios';
import { NavLink } from 'react-router-dom';
import SmallCountdown from './SmallCountdown';
import bg_image from '../../assets/images/bg_image.png';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { SeoHelmet } from '../../components/SeoHelmet';

// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'

const GridWarning = styled.div`
  background: ${({ theme }) => darken(0.1, theme.bg2)};
  background: linear-gradient(
    50deg,
    ${({ theme }) => darken(0.1, theme.bg2)} 53%,
    rgba(200, 155, 53, 0.5872724089635855) 100%
  );
  border: 1px solid ${({ theme }) => darken(0.3, theme.GrBg)};
  border-radius: 10px;
  width: 100%;
  padding: 24px;
`;

const GridSuccess = styled.div`
  background: ${({ theme }) => darken(0.1, theme.bg2)};
  background: linear-gradient(
    50deg,
    ${({ theme }) => darken(0.1, theme.bg2)} 53%,
    rgba(53, 133, 35, 0.5872724089635855) 100%
  );
  border: 1px solid ${({ theme }) => darken(0.3, theme.GrBg)};
  border-radius: 10px;
  width: 100%;
  padding: 24px;
`;

const GridDanger = styled.div`
  background: ${({ theme }) => darken(0.1, theme.bg2)};
  background: linear-gradient(
    50deg,
    ${({ theme }) => darken(0.1, theme.bg2)} 53%,
    rgba(133, 35, 35, 0.5872724089635855) 100%
  );
  border: 1px solid ${({ theme }) => darken(0.3, theme.GrBg)};
  border-radius: 10px;
  width: 100%;
  padding: 24px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Image = styled.div``;

const Timeline = styled.div`
padding: 20px;
margin-top: 20px;
text-align: center;
.timeline {
  list-style: none;
  padding: 20px 0 20px;
  position: relative;
}

  .timeline:before {
      top: 0;
      bottom: 0;
      position: absolute;
      content: " ";
      width: 3px;
      background-color: #eeeeee;
      left: 50%;
      margin-left: -1.5px;
  }

  .timeline > li {
      margin-bottom: 20px;
      position: relative;
  }

      .timeline > li:before,
      .timeline > li:after {
          content: " ";
          display: table;
      }

      .timeline > li:after {
          clear: both;
      }

      .timeline > li:before,
      .timeline > li:after {
          content: " ";
          display: table;
      }

      .timeline > li:after {
          clear: both;
      }

      .timeline > li > .timeline-panel {
          width: 46%;
          float: left;
          border: 1px solid #3d2e03;
          border-radius: 2px;
          padding: 20px;
          position: relative;
          -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);
          background-color: #15171a;
      }

          .timeline > li > .timeline-panel:before {
              position: absolute;
              top: 26px;
              right: -15px;
              display: inline-block;
              border-top: 15px solid transparent;
              border-left: 15px solid #ccc;
              border-right: 0 solid #ccc;
              border-bottom: 15px solid transparent;
              content: " ";
          }

          .timeline > li > .timeline-panel:after {
              position: absolute;
              top: 27px;
              right: -14px;
              display: inline-block;
              border-top: 14px solid transparent;
              border-left: 14px solid #fff;
              border-right: 0 solid #fff;
              border-bottom: 14px solid transparent;
              content: " ";
          }

      .timeline > li > .timeline-badge {
          color: #fff;
          width: 50px;
          height: 50px;
          line-height: 50px;
          font-size: 1.5em;
          font-weight: bold;
          text-align: center;
          position: absolute;
          top: 16px;
          left: 50%;
          margin-left: -25px;
          background-color: #f1b82e;
          z-index: 100;
          border-top-right-radius: 50%;
          border-top-left-radius: 50%;
          border-bottom-right-radius: 50%;
          border-bottom-left-radius: 50%;
      }

      .timeline > li.timeline-inverted > .timeline-panel {
          float: right;
      }

          .timeline > li.timeline-inverted > .timeline-panel:before {
              border-left-width: 0;
              border-right-width: 15px;
              left: -15px;
              right: auto;
          }

          .timeline > li.timeline-inverted > .timeline-panel:after {
              border-left-width: 0;
              border-right-width: 14px;
              left: -14px;
              right: auto;
          }

.timeline-badge.primary {
  background-color: #2e6da4 !important;
}

.timeline-badge.success {
  background-color: #3f903f !important;
}

.timeline-badge.warning {
  background-color: #f0ad4e !important;
}

.timeline-badge.danger {
  background-color: #d9534f !important;
}

.timeline-badge.info {
  background-color: #5bc0de !important;
}

.timeline-title {
  margin-top: 0;
  color: inherit;
}

.timeline-body > p,
.timeline-body > ul {
  margin-bottom: 0;
}

  .timeline-body > p + p {
      margin-top: 5px;
  }

@media (max-width: 767px) {
  ul.timeline:before {
      left: 40px;
  }

  ul.timeline > li > .timeline-panel {
      width: calc(100% - 90px);
      width: -moz-calc(100% - 90px);
      width: -webkit-calc(100% - 90px);
  }

  ul.timeline > li > .timeline-badge {
      left: 15px;
      margin-left: 0;
      top: 16px;
  }

  ul.timeline > li > .timeline-panel {
      float: right;
  }

      ul.timeline > li > .timeline-panel:before {
          border-left-width: 0;
          border-right-width: 15px;
          left: -15px;
          right: auto;
      }

      ul.timeline > li > .timeline-panel:after {
          border-left-width: 0;
          border-right-width: 14px;
          left: -14px;
          right: auto;
      }
}
`;

const Label = styled.div`
  margin-left: auto;
`;

const LabelChain = styled.div`
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  padding: 4px 8px;
  border-radius: 50px;
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

const CoinName = styled.h2`
  font-size: 28px;
  line-height: 34px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const CoinDex = styled.p`
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  color: #727480;
  margin-bottom: 16px !important;
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
  margin-bottom: 16px;
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
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: 'rgb(240,185,11)',
    },
  },
});
export default function Ifo() {
  // const block = useBlock();
  // const { account } = useActiveWeb3React();
  
  const [pools, setPools] = useState<any>([]);
  const [uPpools, setUpPools] = useState<any>([]);
  const [apools, setAPools] = useState<any>([]);
  const history = useHistory();
  const [value, setValue] = useState(0);

  const loadPools = async () => {
    const data = await getStarterClosedPools();
    const upcoming = await getStarterUpcomingPools();
    const active = await getStarterActivePools();
    console.log("upcoming : " + JSON.stringify(upcoming));
    setPools(data);
    setUpPools(upcoming);
    setAPools(active);
  };

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    loadPools();
  }, []);

  return (
   
      <ThemeProvider theme={theme}>
        <SeoHelmet title="Ninja EIDO" description="lunchpad at bsc by ninjaswap fully secure audited for new projects at bsc" />
      <div className="main container mainContainer" id="content">
        <div className="row justify-content-center">
          <div className="col-lg-11 m-0">
          
            <div
              style={{ zIndex: 2 }}
              className="d-md-flex justify-content-around align-items-center pt-2"
            >
              <div
                style={{ zIndex: 2 }}
                className="d-flex flex-column justify-content-md-start justify-content-sm-center align-items-center"
              >
                <div className="text-sm-center text-md-left">
                  <h1 style={{ fontSize: '3rem' }}>Ninja Enhanced IDO (EIDO)</h1>
                  <p style={{ fontSize: '1rem' }}>
                    Launchped program for new protocols on BSC network
                  </p>
                </div>
                <div
                  style={{ zIndex: 2 }}
                  className="d-flex flex-column flex-sm-row justify-content-sm-center justify-content-md-start align-items-center"
                >
                  <div className="pr-md-3">
                    <Button
                      size="sm"
                      onClick={() => window.open('/files/ninja-audit.pdf', '_blank')}
                      className="ninja-button"
                      style={{
                        border: '1.5px solid rgb(240, 185, 11)',
                        backgroundColor: '#12161c',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        width: '160px',
                      }}
                    >
                      <FontAwesomeIcon icon={faFilePdf} size="1x" /> Security Audit
                    </Button>
                  </div>
                  <div className="pr-md-3">
                    <Button
                      size="sm"
                      onClick={() => window.open('/files/EIDO_Presentation.pdf', '_blank')}
                      className="ninja-button"
                      style={{
                        border: '1px solid rgb(240, 185, 11)',
                        backgroundColor: '#12161c',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        width: '160px',
                      }}
                    >
                      <FontAwesomeIcon icon={faFilePowerpoint} size="1x" /> Presentation
                    </Button>
                  </div>
                  <div className="pr-md-3">
                    <NavLink exact to="/ninja-starter/application">
                      <Button
                        size="sm"
                        className="ninja-button"
                        style={{
                          border: '1px solid rgb(240, 185, 11)',
                          backgroundColor: '#12161c',
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          width: '160px',
                        }}
                      >
                        <FontAwesomeIcon icon={faFilePowerpoint} size="1x" /> Apply
                      </Button>
                    </NavLink>
                  </div>
                </div>
              </div>
              <div>
                <img className="indexImage" src={NinjaMac} alt="Ninja airdrop" />
              </div>

              {/* <img className="indexImage" src={LogoDark} alt="" /> */}
            </div>
            <div className="row justify-content-center pt-3">
                  <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    aria-label="Pool tabs"
                  >
                    <Tab label="Recent EIDOs" />
                   
                    <Tab label="Funded EIDos" />
                  </Tabs>
                </div>
                <TabPanel value={value} index={0}>
                {!pools?.length && (
              <div className="d-flex justify-content-center">
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              </div>
            )}
            {apools?.length > 0 && (
              <>
                <h1 className="subTitle pt-2">Active Sales</h1>

                <div className="row pt-3">
                  {apools.map((item: any, index: number) => {
                    const Grid =
                      item?.status === 'active'
                        ? GridSuccess
                        : item?.status === 'upcoming'
                          ? GridWarning
                          : item?.status === 'closed'
                            ? GridDanger
                            : GridDanger;
                    const percentage = (item?.total_token_sale > 0
                      ? (item?.total_sold / item?.total_token_sale) * 100
                      : 0
                    ).toFixed(2);
                    return (
                      <div className="col-sm-12 col-md-6 pt-4 pt-md-0" key={index.toString()} style={{ marginTop: '10px' }}>
                        <Grid
                          style={{ cursor: 'pointer' }}
                          onClick={() => history.push(`/ninja-starter/${item?.symbol}`)}
                        >
                          <Head>
                            <Image>
                              <img
                                alt=""
                                style={{
                                  maxWidth: '54px',
                                  maxHeight: '54px',
                                  borderRadius: '48px',
                                  width: '48px',
                                  height: '48px',
                                }}
                                src={item?.logo}
                              />
                            </Image>

                            <Label>
                              {item?.status === 'active' && (
                                <LabelSuccess>
                                  <span>Active</span>
                                </LabelSuccess>
                              )}
                              {item?.status === 'upcoming' && (
                                <LabelUpcoming>
                                  <span>Upcoming</span>
                                </LabelUpcoming>
                              )}
                              {item?.status === 'closed' && (
                                <LabelFinished>
                                  <span>Closed</span>
                                </LabelFinished>
                              )}
                            </Label>
                          </Head>
                          <div className="align-items-left">
                            <CoinName>{item?.name}</CoinName>
                            <CoinDex>{item?.symbol}</CoinDex>
                            {/* <CoinDex>1 BNB = 7675.00 OOE</CoinDex> */}
                            <div className="d-flex">
                              <div>
                                <Title>Total Rise BNB</Title>
                                <Ratio>{item?.total_bnb_raise} BNB</Ratio>
                              </div>
                              <div style={{ marginLeft: '32px' }}>
                                <Title>Total Rise BUSD</Title>
                                <Ratio>{item?.total_busd_raise} BUSD</Ratio>
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
                                {item?.total_sold} / {item?.total_token_sale}
                              </div>
                            </ProgressFooter>
                          </Progress>

                          <Footer columnLength={2}>
                            <div>
                              <TitleSmall>Participants</TitleSmall>
                              <TextInfo>{item?.participants}</TextInfo>
                            </div>
                            <div>
                              <TitleSmall>Started At</TitleSmall>
                              <TextInfo>
                                {moment.utc(item?.starting).format('DD-MM-YYYY HH:mm')}
                              </TextInfo>
                            </div>
                            {/* <div>
                               <TitleSmall>Participants</TitleSmall>
                               <TextInfo>314</TextInfo>
                             </div>
                             <div>
                               <TitleSmall>Participants</TitleSmall>
                               <TextInfo>314</TextInfo>
                             </div> */}
                          </Footer>
                        </Grid>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {uPpools?.length > 0 && (
              <>
                <h1 className="subTitle pt-2">Upcoming Projects</h1>

                <div className="row pt-3">
                  {uPpools.map((item: any, index: number) => {
                    const Grid =
                      item?.status === 'active'
                        ? GridSuccess
                        : item?.status === 'upcoming'
                          ? GridWarning
                          : item?.status === 'paused'
                            ? GridSuccess
                            : item?.status === 'closed'
                              ? GridDanger
                              : GridDanger;
                    const percentage = (item?.total_token_sale > 0
                      ? (item?.total_sold / item?.total_token_sale) * 100
                      : 0
                    ).toFixed(2);
                    return (
                      <div className="col-sm-12 col-md-6 pt-4 pt-md-0" key={index.toString()} style={{ marginTop: '10px' }}>
                        <Grid
                          style={{ cursor: 'pointer' }}
                          onClick={() => history.push(`/ninja-starter/${item?.symbol}`)}
                        >
                          <Head>
                            <Image>
                              <img
                                alt=""
                                style={{
                                  maxWidth: '54px',
                                  maxHeight: '54px',
                                  borderRadius: '48px',
                                  width: '48px',
                                  height: '48px',
                                }}
                                src={item?.logo}
                              />
                            </Image>

                            <Label>
                              {item?.status === 'active' && (
                                <LabelSuccess>
                                  <span>Active</span>
                                </LabelSuccess>
                              )}
                              {item?.status === 'upcoming' && (
                                <LabelUpcoming>
                                  <span>Upcoming</span>
                                </LabelUpcoming>
                              )}
                              {item?.status === 'paused' && (
                                <LabelUpcoming>
                                  <span>Paused</span>
                                </LabelUpcoming>
                              )}
                              {item?.status === 'closed' && (
                                <LabelFinished>
                                  <span>Closed</span>
                                </LabelFinished>
                              )}
                            </Label>
                          </Head>
                          <div className="align-items-left">
                            <CoinName>{item?.name}</CoinName>
                            <CoinDex>{item?.symbol}</CoinDex>
                            {/* <CoinDex>1 BNB = 7675.00 OOE</CoinDex> */}
                            <div className="d-flex">
                              <div>
                                <Title>Total Rise BNB</Title>
                                <Ratio>{item?.total_bnb_raise} BNB</Ratio>
                              </div>
                              <div style={{ marginLeft: '32px' }}>
                                <Title>Total Rise BUSD</Title>
                                <Ratio>{item?.total_busd_raise} BUSD</Ratio>
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
                                {item?.total_sold} / {item?.total_token_sale}
                              </div>
                            </ProgressFooter>
                          </Progress>

                          <Footer columnLength={2}>
                            <div>
                              <TitleSmall>Participants</TitleSmall>
                              <TextInfo>{item?.participants}</TextInfo>
                            </div>
                            <div>
                              <TitleSmall>Starting At</TitleSmall>
                              <TextInfo>
                                <SmallCountdown
                                  futureDate={item?.starting_at}  status={'TBA'}
                                />
                              </TextInfo>
                            </div>
                            {/* <div>
                               <TitleSmall>Participants</TitleSmall>
                               <TextInfo>314</TextInfo>
                             </div>
                             <div>
                               <TitleSmall>Participants</TitleSmall>
                               <TextInfo>314</TextInfo>
                             </div> */}
                          </Footer>
                        </Grid>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

<Timeline>
              <h3 className="title">How To Take Part</h3>
              <ul className="timeline">
                <li>
                  <div className="timeline-badge">1</div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Buy NinjaSwap (Ninja) Token</h4>
                    </div>
                    <div className="timeline-body">
                      <p>Buy NinjaSwap (Ninja) Token from dex with BNB or BUSD</p>
                      <NavLink exact to="/swap">
                      <Button
                        // onClick={processTask}
                        className="Zwap-btn-md-card button"
                        disabled={false}
                      >
                        Buy Ninja
                      </Button>
                        </NavLink>
                    </div>
                  </div>
                </li>
                <li className="timeline-inverted">
                  <div className="timeline-badge">2</div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Join XNinja Farm</h4>
                    </div>
                    <div className="timeline-body">
                      <p>Lock Ninja Token and earn xninja</p>
                      <NavLink exact to="/ido-pools">
                      <Button
                        // onClick={processTask}
                        className="Zwap-btn-md-card button"
                        disabled={false}
                      >
                        Stake Ninja
                      </Button>
                      </NavLink>
                 
                    </div>
                  </div>
                </li>
                <li>
                  <div className="timeline-badge">3</div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Join the ido pool</h4>
                    </div>
                    <div className="timeline-body">
                      <p>when ido pool is active you can join pool</p>
                      
                    </div>
                  </div>
                </li>
                <li className="timeline-inverted">
                  <div className="timeline-badge">4</div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Claim your tokens</h4>
                    </div>
                    <div className="timeline-body">
                      <p>Afer Joining pool you will receive tokens immediately or at end of idea according to ido settings and schedule </p>
                     
                    </div>
                  </div>
                </li>
              </ul>
            </Timeline>   
                </TabPanel>
                <TabPanel value={value} index={1}>
                <h1 className="subTitle pt-2">Funded Projects</h1>

<div className="row pt-3">
  {pools.map((item: any, index: number) => {
    const Grid =
      item?.status === 'active'
        ? GridSuccess
        : item?.status === 'upcoming'
          ? GridWarning
          : item?.status === 'closed'
            ? GridDanger
            : GridDanger;
    const percentage = (item?.total_token_sale > 0
      ? (item?.total_sold / item?.total_token_sale) * 100
      : 0
    ).toFixed(2);
    return (
      <div className="col-sm-12 col-md-6 pt-4 pt-md-0" key={index.toString()} style={{ marginTop: '10px' }}>
        <Grid
          style={{ cursor: 'pointer' }}
          onClick={() => history.push(`/ninja-starter/${item?.symbol}`)}
        >
          <Head>
            <Image>
              <img
                alt=""
                style={{
                  maxWidth: '54px',
                  maxHeight: '54px',
                  borderRadius: '48px',
                  width: '48px',
                  height: '48px',
                }}
                src={item?.logo}
              />
            </Image>

            <Label>
              {item?.status === 'active' && (
                <LabelSuccess>
                  <span>Active</span>
                </LabelSuccess>
              )}
              {item?.status === 'upcoming' && (
                <LabelUpcoming>
                  <span>Upcoming</span>
                </LabelUpcoming>
              )}
              {item?.status === 'closed' && (
                <LabelFinished>
                  <span>Closed</span>
                </LabelFinished>
              )}
            </Label>
          </Head>
          <div className="align-items-left">
            <CoinName>{item?.name}</CoinName>
            <CoinDex>{item?.symbol}</CoinDex>
            {/* <CoinDex>1 BNB = 7675.00 OOE</CoinDex> */}
            <div className="d-flex">
              <div>
                <Title>Total Rise BNB</Title>
                <Ratio>{item?.total_bnb_raise} BNB</Ratio>
              </div>
              <div style={{ marginLeft: '32px' }}>
                <Title>Total Rise BUSD</Title>
                <Ratio>{item?.total_busd_raise} BUSD</Ratio>
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
                style={{ width: `${percentage}%`, backgroundColor: 'rgb(240,185,11)' }}
                aria-valuenow={Number(percentage)}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>

            <ProgressFooter>
              <div style={{ color: '#727480' }}>{/* (Min. 50%) */}</div>
              <div style={{ color: '#727480', marginLeft: 'auto' }}>
                {item?.total_sold} / {item?.total_token_sale}
              </div>
            </ProgressFooter>
          </Progress>

          <Footer columnLength={2}>
            <div>
              <TitleSmall>Participants</TitleSmall>
              <TextInfo>{item?.participants}</TextInfo>
            </div>
            <div>
              <TitleSmall>Started</TitleSmall>
              <TextInfo>
                {moment(item?.starting_at * 1000).fromNow()}
              </TextInfo>
            </div>
            {/* <div>
              <TitleSmall>Participants</TitleSmall>
              <TextInfo>314</TextInfo>
            </div>
            <div>
              <TitleSmall>Participants</TitleSmall>
              <TextInfo>314</TextInfo>
            </div> */}
          </Footer>
        </Grid>
      </div>
    );
  })}
</div>
                </TabPanel>
               
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