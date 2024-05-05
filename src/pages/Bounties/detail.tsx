import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { useActiveWeb3React } from '../../hooks';
import LogoDark from '../../assets/img/Ninja_Logo_DarkVer.png';
import styled, { ThemeContext } from 'styled-components';
import { darken, lighten } from 'polished';
import useBlock from '../../hooks/useBlock';
import Spinner from 'react-bootstrap/Spinner';
import BigNumber from 'bignumber.js';
import Notification from '../../components/Notification/Notification';
import {
  getStarterPoolDetail,
  getStarterPools,
  getBountyDetail,
  getEarnings,
  getAirDrop,
} from '../../utils/axios';
import {
  isTransactionRecent,
  useAllTransactions,
  useTransactionAdder,
} from '../../state/transactions/hooks';
import web3 from 'web3';
import moment from 'moment';
import { RouteComponentProps, useHistory } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from 'react-bootstrap/Button';
import {
  CardAction,
  CardBody,
  CardHeader,
  CardRow,
  CardRowLeft,
  CheckIcon,
  IconWrapper,
  InfoCard,
  PointBadge,
  TaskStatusBadge,
  CardTaskAction,
  CardHeaderLeft,
} from './Card';
// @ts-ignore
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { stubTrue, update } from 'lodash';
import Task from './task';
import { SeoHelmet } from '../../components/SeoHelmet';
import { getBountyContract } from '../../utils';

// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'

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

export default function BountyDetail({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) {
  // const block = useBlock();
  const addTransaction = useTransactionAdder();
  const themeStyle = useContext(ThemeContext);
  const [bountyDetail, setBountyDetail] = useState<any>(false);
  const [earnings, setEarnings] = useState<any>(false);
  const tasks = bountyDetail?.tasks;
  const [poolDetail, setPoolDetail] = useState<any>(false);
  const [earningStatus, setEarningStatus] = useState(false);
  const [TotalairdropReward, setTotalairdropReward] = useState(0);
  const [TotalClaimReward, setTotalClaimReward] = useState(0);
  const [claimSign , setClaimSign]  = useState('');
  const [airdropSign , setAirdropSign] = useState('');
  const [claimId , setClaimId] = useState(0);
  const [airdropId , setairdropId] = useState(0);
  const [value, setValue] = useState(0);
  const poolInfo = poolDetail?.poolInfo;
  const history = useHistory();
  const { account, chainId, library } = useActiveWeb3React();


  const loadPoolDetail = async () => {
    const data = await getBountyDetail(account ? account : '', id);
     const earns = await getEarnings(account ? account : '', id);
    console.log('data : ' + JSON.stringify(data));
    console.log('earnings : ' + JSON.stringify(earns.earnings));
    if (earns && earns.status) {
      setEarnings(earns.earnings);
      setClaimSign(earns.signature);
      setTotalClaimReward(earns.total_token_reward);
    }
    if (data && data.status) {
      setBountyDetail(data);
      if (!chainId || !library || !account) {
        setEarningStatus(false);
        setClaimId(data.campaign.claimId);
        setairdropId(data.campaign.airdropClaimId);
      } else {
        const bContract = getBountyContract(chainId, library, account);
        console.log(JSON.stringify(bountyDetail));
        const status = await bContract.processedClaim(data.campaign.claimId, account);
        console.log('earning status:' + status);
        if (status) setEarningStatus(true);
        setEarningStatus(false);
        if(data.campaign.claims == 2){
          const airdrops = await getAirDrop(account ? account : '', id);
          if (airdrops && airdrops.status) {
            let amount =  web3.utils.toWei(String(airdrops.amount), 'Gwei');
            // ethers.utils.parseUnits(String(airdrops.amount), 9);
            console.log(amount , amount.toString());
            setTotalairdropReward(airdrops.amount)
            setAirdropSign(airdrops.signature);
          }
         
        }
      }
    } else {
      history.push('/bounties');
    }
  };
  const ClaimClick = async () => {
    if (!chainId || !library  || !account) return;
    const contract = getBountyContract(chainId, library, account);
      const earns = await getEarnings(account ? account : '', id);
      const data = await getBountyDetail(account ? account : '', id);
      if (earns && earns.status) {
        let amount;
        console.log("amount : " + earns.earnings.total_token_reward + " |  address : "+account)
        if(id == 'VOLT-R-1'){
           amount =  web3.utils.toWei(String(earns.earnings.total_token_reward), 'Gwei');
          console.log(amount , amount.toString());
        } else {
           amount =  web3.utils.toWei(String(earns.earnings.total_token_reward), 'ether');
          console.log(amount , amount.toString());
        }
      
        //ethers.utils.parseUnits(String(earns.earnings.total_token_reward), 9);
        try {
          await contract.claimReward(amount, data.campaign.claimId, earns.signature).then((response: any) => {
            addTransaction(response, {
              summary: 'Reward claimed',
            });
            Notification.notification({
              type: 'success',
              message: 'Transaction Successful',
            });
          });
        }    catch (error) {
          if (error.code === -32603) {
            Notification.notification({
              type: 'error',
              message: error.data.message,
            });
        }
      }
     
      } else {
        Notification.notification({
          type: 'error',
          message: 'Something went wrong !',
        });
      }
};
const AirdropClick = async () => {
  if (!chainId || !library  || !account) return;
  const contract = getBountyContract(chainId, library, account);
    const data = await getBountyDetail(account ? account : '', id);
    const airdrops = await getAirDrop(account ? account : '', id);
    if (airdrops && airdrops.status) {
          let amount =  web3.utils.toWei(String(airdrops.amount), 'Gwei');
      console.log(amount , amount.toString());
      try {
        await contract.claimReward(amount, data.campaign.airdropClaimId, airdrops.signature).then((response: any) => {
          addTransaction(response, {
            summary: 'Airdrop claimed',
          });
          Notification.notification({
            type: 'success',
            message: 'Transaction Successful',
          });
        });
      }    catch (error) {
        if (error.code === -32603) {
          Notification.notification({
            type: 'error',
            message: error.data.message,
          });
      }
    }
   
    } else {
      Notification.notification({
        type: 'error',
        message: 'Something went wrong !',
      });
    }

};
  const getStatusBadge = (status: string , claim: string) => {
    if(status == 'active' && claim == 'closed'){
      return (
        <LabelSuccess>
          <span>Active</span>
        </LabelSuccess>
      );
    }
    if(status == 'upcoming' && claim == 'closed'){
      return (
        <LabelUpcoming>
            <span>Upcoming</span>
          </LabelUpcoming>
      );
    }
    if(status == 'closed' && claim == 'closed'){
      return (
        <LabelFinished>
          <span>Closed</span>
        </LabelFinished>
      );
    }
    if(status == 'closed' && claim == 'active'){
      return (
        <LabelFinished>
          <span>Claims Open</span>
          
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
  }, [account]);

  return (
    <ThemeProvider theme={theme}>
      <div className="main container mainContainer" id="content">
        <PatternedBackgrond></PatternedBackgrond>
        <div className="row justify-content-sm-center justify-content-md-center">
          <div className="col-xl-12 m-0 col-lg-12 col-sm-12">
            {!bountyDetail ? (
              <div className="d-flex justify-content-center">
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              </div>
            ) : (
              <>
                <SeoHelmet
                  title={bountyDetail?.campaign.title + ' Bounty Campaign'}
                  description={
                    bountyDetail?.campaign.title +
                    ' bounty campaign at ninjaswap with twitter and telegram tasks easy to use and fastly earn points'
                  }
                />
                <BackButtonWrapper>
                  <Button
                    onClick={() => history.push(`/bounties`)}
                    className="ninja-button"
                    style={{ border: '0px solid rgb(240, 185, 11)', backgroundColor: '#12161c' }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} size="1x" /> Back to campaigns
                  </Button>
                </BackButtonWrapper>

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
                        src={bountyDetail?.campaign.logo}
                        alt=""
                      />
                      <h1 className="subTitle pt-2">
                        {bountyDetail?.campaign.title}{' '}
                        {getStatusBadge(bountyDetail?.campaign.status , bountyDetail?.campaign.claim_status)}
                      </h1>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center align-items-md-end py-3">
                      <Grid>
                        <Footer columnLength={2}>
                          <div>
                            <Title>Total Tasks</Title>
                            <TextInfo>{tasks.length}</TextInfo>
                          </div>
                          <div>
                            <Title>Points Earned</Title>
                            <TextInfo>{earnings?.tpoints}</TextInfo>
                          </div>
                          <div>
                            <Title>Refferal Points</Title>
                            <TextInfo>{earnings?.total_referred_points}</TextInfo>
                          </div>
                          <div>
                            <Title>Tokens Earned</Title>
                            <TextInfo>
                              ~ {earnings?.total_token_reward} {bountyDetail?.campaign.token}
                            </TextInfo>
                          </div>
                        </Footer>
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
                    <Tab label="Tasks" />
                    <Tab label="Earning" />
                    <Tab label="About" />
                  </Tabs>
                </div>
                <TabPanel value={value} index={0}>
                  <InfoCard style={{ marginTop: '10px' }}>
                    <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
                      <CardHeaderLeft>
                        <IconWrapper>
                          <FontAwesomeIcon icon={faInfoCircle} size="2x" color="#f3ba2f" />
                        </IconWrapper>
                        <div>Instructions Box</div>
                      </CardHeaderLeft>
                    </CardHeader>
                    <CardBody>
                      <CardRow>
                        <CardRowLeft>
                          <IconWrapper>
                            <CheckIcon color={false ? 'green' : null} />
                          </IconWrapper>
                          <div>
                            <span>Task not approved</span>
                          </div>
                        </CardRowLeft>
                      </CardRow>
                      <CardRow>
                        <CardRowLeft>
                          <IconWrapper>
                            <CheckIcon color={true ? 'green' : null} />
                          </IconWrapper>
                          <div>
                            <span>Task approved and points added in your account</span>
                          </div>
                        </CardRowLeft>
                      </CardRow>
                      <CardRow>
                        <CardRowLeft>
                          <TaskStatusBadge completed={true}>New</TaskStatusBadge>
                          <div>
                            <span>New Task</span>
                          </div>
                        </CardRowLeft>
                      </CardRow>
                      <CardRow>
                        <CardRowLeft>
                          <TaskStatusBadge completed={true}>Pending</TaskStatusBadge>
                          <div>
                            <span>Task Submitted but Pending for approval</span>
                          </div>
                        </CardRowLeft>
                      </CardRow>
                      <CardRow>
                        <CardRowLeft>
                          <TaskStatusBadge completed={false}>Rejected</TaskStatusBadge>
                          <div>
                            <span>Task rejected not preformed correctly)</span>
                          </div>
                        </CardRowLeft>
                      </CardRow>
                      <p>
                        Note : After submission of task please wait for 10 minutes to verify your
                        task
                      </p>
                    </CardBody>
                  </InfoCard>
                  {tasks.map((item: any, index: number) => {
                    const content = JSON.parse(item.content);

                    return (
                      <div key={index.toString()}>
                        <Task
                          type={item.type}
                          points={item.points}
                          Link={content.Link}
                          Text={content.Text}
                          tweetId={content.tweetId}
                          status={item.status}
                          ctask_id={item.ctask_id}
                          cb_id={bountyDetail?.campaign.cb_id}
                          account={account ? account : ''}
                          bountyStatus={bountyDetail?.campaign.status}
                          updateFromChild={loadPoolDetail}
                        />
                      </div>
                    );
                  })}
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <div className="row justify-content-center pt-4">
                    <div className="col-md-10">
                      {bountyDetail?.campaign.claims == 1 && !earnings ? (
                        <div className="d-flex justify-content-center">
                          <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                        </div>
                      ) : (
                        <>
                          <table className="table-responsive-stack" id="">
                            <thead className="thead-dark">
                              <tr>
                                <th scope="col" style={{ width: '15%' }}>
                                  Total Points
                                </th>
                                <th scope="col" style={{ width: '15%' }}>
                                  Referred Users
                                </th>
                                <th scope="col" style={{ width: '15%' }}>
                                  Referral Points
                                </th>
                                <th scope="col" style={{ width: '15%' }}>
                                  Token Reward
                                </th>

                                <th scope="col" style={{ width: '20%' }}>
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{earnings?.tpoints}</td>
                                <td>{earnings?.total_referred}</td>
                                <td>{earnings?.total_referred_points}</td>
                                <td>{earnings?.total_token_reward}</td>
                                {/* <td>
                                {earnings?.tx_hash != null && earnings?.tx_hash != '' ? (
                                  <Button
                                    href={earnings?.tx_hash}
                                    target="_blank"
                                    className="Zwap-btn-md-card button"
                                    disabled={false}
                                  >
                                    Transaction
                                  </Button>
                                ) : (
                                  <p></p>
                                )}
                              </td> */}
                                <td>{earningStatus == true ? 'Claimed' : earnings?.status}</td>
                              </tr>
                            </tbody>
                          </table>
                          {(() => {
                            if (!earningStatus) {
                              return (
                                <>
                                  <div className="d-flex justify-content-center mt-5">
                                    <Button
                                      href={earnings?.tx_hash}
                                      className="Zwap-btn-md-card button"
                                      disabled={false}
                                      onClick={() => ClaimClick()}
                                    >
                                      Claim Reward
                                    </Button>
                                  </div>
                                </>
                              );
                            }
                            return null;
                          })()}
                          {(() => {
                            if (bountyDetail?.campaign.claims == 2) {
                              return (
                                <>
                                  <div className="d-flex justify-content-center mt-3">
                                    <Button
                                      href={earnings?.tx_hash}
                                      className="Zwap-btn-md-card button"
                                      disabled={false}
                                      onClick={() => AirdropClick()}
                                    >
                                      Claim Airdrop
                                    </Button>
                                    </div>
                                    <br></br>
                                    <div className="d-flex justify-content-center mt-3">
                                   <h3> Airdrop Reward : {TotalairdropReward}</h3>
                                   </div>
                                 
                                </>
                              );
                            }
                            return null;
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <div className="row justify-content-center pt-4">
                    <div className="col-md-10">
                      <Table>
                        <Header>
                          <span>About</span>
                        </Header>
                        <Body
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(bountyDetail?.campaign.about),
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
