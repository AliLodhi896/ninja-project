import React, { useState, useEffect, useCallback } from 'react';
import { useActiveWeb3React } from '../../hooks';
import LogoDark from '../../assets/img/Ninja_Logo_DarkVer.png';
import NinjaMac from '../../assets/images/ninja-mac.png';
import styled, { ThemeContext } from 'styled-components';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { darken, lighten } from 'polished';
import useBlock from '../../hooks/useBlock';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import Container from '@material-ui/core/Container';
import { IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import Button from 'react-bootstrap/Button';
import { Row, Col } from 'react-bootstrap';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faFilePowerpoint } from '@fortawesome/free-regular-svg-icons';
import { getBounties, getUserStatus } from '../../utils/axios';
import { NavLink } from 'react-router-dom';
// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'
import { shortenAddress } from '../../utils';
import Notification from '../../components/Notification/Notification';
import { useWalletModalToggle } from '../../state/application/hooks';
import useTwitterApiNew from '../../hooks/useTwitterApiNew';
import useTelegramApi from '../../hooks/useTelegramApi';
import Referral from './components/Referral';
import { SeoHelmet } from '../../components/SeoHelmet';
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const useStyles = makeStyles((theme) => ({
  maxBtn: {
    backgroundColor: '#ecce77',
    padding: '13px 6px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  paper: {
    backgroundColor: '#12161c',
    borderRadius: '5px',
    boxShadow: theme.shadows[5],
    display: 'flex',
    flexDirection: 'column',
    left: '50%',
    maxWidth: 500,
    minWidth: 350,
    outline: 'none',
    padding: theme.spacing(4),
    position: 'absolute',
    top: '50%',
    transform: `translate(-50%, -50%)`,
  },
  signupButton: {
    backgroundColor: '#ebb52c',
    borderRadius: 10,
    color: 'white',
    marginBottom: 30,
    marginTop: 30,
    top: 10,
    width: '100%',
    '&:hover': {
      color: 'black',
    },
  },
  textField: {
    margin: 8,
  },
}));

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
export default function Bounties() {
  const twitterApi = useTwitterApiNew();
  const telegramApi = useTelegramApi();
  telegramApi.init();
  // const block = useBlock();
  const classes = useStyles();
  const { account } = useActiveWeb3React();
  const [bounties, setBounties] = useState<any>([]);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [teleUsername, setTeleUsername] = useState('');
  const [twitterModelOpen, setTwitterModelOpen] = useState(false);
  const [referralAddress, setReferralAddress] = useState(undefined);
  const [userStatus, setUserStatus] = useState('inactive');
  const [opState, setOpState] = useState({
    actionBtnText: '',
    msg: '',
    actionReq: '',
  });
  const history = useHistory();

  const loadPools = async () => {
    const data = await getBounties();
    console.log(JSON.stringify(data));
    setBounties(data);
  };
  const updateStatus = async () => {
    if (account) {
      const userProfle = await getUserStatus(account);

      if (userProfle?.status) {
        setUserStatus('active');
        setTeleUsername(userProfle.teleUsername);
        setTwitterUsername(userProfle.twitterUsername);
      } else {
        setUserStatus('inactive');
        setTeleUsername(userProfle.teleUsername);
        setTwitterUsername(userProfle.twitterUsername);
        if (userProfle.msg == 'Please complete your profile Connect Twitter') {
          setOpState({
            ...opState,
            actionBtnText: 'Connect Twitter',
            actionReq: 'twitter',
            msg: userProfle.msg,
          });
        }
        if (userProfle.msg == 'Please complete your profile Connect Telegram') {
          setOpState({
            ...opState,
            actionBtnText: 'Connect Telegram',
            actionReq: 'telegram',
            msg: userProfle.msg,
          });
        }
        if (userProfle.msg == 'Please complete your profile!') {
          setOpState({
            ...opState,
            actionBtnText: 'Connect Twitter',
            actionReq: 'twitter',
            msg: userProfle.msg,
          });
        }
      }
    }
  };
  const toggleWalletModal = useWalletModalToggle();

  const actionButtonClick = async () => {
    if (!account) {
      toggleWalletModal();
    }
    if (opState.actionReq == 'telegram') {
      connectTelegram();
    }
    if (opState.actionReq == 'twitter') {
      handleTwitterModalOpen();
    }
  };
  const gridClick = async (id: any) => {
    if (!account) {
      Notification.notification({
        type: 'warning',
        message: 'Please connect your wallet.',
      });
      return;
    } else {
      if (userStatus == 'active') {
        history.push(`/bounties/${id}`);
      } else {
        Notification.notification({
          type: 'warning',
          message: opState.msg,
        });
      }
    }
  };
  const handleChange = useCallback((event) => {
    setTwitterUsername(event.target.value);
    // setOpState({ ...opState, twitterUsername : event.target.value});
  }, []);
  const handleTwitterModalOpen = () => {
    setTwitterModelOpen(true);
  };

  const handleClose = useCallback(() => {
    setTwitterModelOpen(false);
  }, [handleTwitterModalOpen]);

  const hanleConnectionSubmit = async () => {
    handleClose();
    let referral = '';

    try {
      referral = (await localStorage.getItem('bounty_referral_code')) || '';
    } catch (error) {}

    twitterApi
      .sendUsername({
        twitterUsername: twitterUsername,
        userWalletId: account,
        referralWalletId: referral,
      })
      .then((data: any) => {
        if (!data.status) {
          setTwitterUsername('');
        } else {
          updateStatus();
        }
      });
  };
  const connectTelegram = async () => {
    telegramApi.login().then(async (data) => {
      let referral = '';

      try {
        referral = (await localStorage.getItem('bounty_referral_code')) || '';
      } catch (error) {}

      telegramApi
        .sendAccountData({
          auth_date: data?.auth_date,
          first_name: data?.first_name,
          hash: data?.hash,
          id: data?.id,
          last_name: data?.last_name,
          username: data?.username,
          userWalletId: account,
          referralWalletId: referral,
        })
        .then((response) => {
          if (!response.status) {
            setTeleUsername('');
          } else {
            updateStatus();
          }
        });
    });
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

  useEffect(() => {
    loadPools();
    updateStatus();
  }, []);

  useEffect(() => {
    updateStatus();
  }, [account]);

  return (
    <>
      <SeoHelmet
        title="Bounties"
        description="Ninja Bounty Campaigns Platform with automatic tasks verification system for new start up projects"
      />
      <div className="main container mainContainer" id="content">
      <PatternedBackgrond></PatternedBackgrond>
        <div className="row justify-content-center">
          <div className="col-lg-11 m-0">
              <Row>
              <Col lg="4" style={{ marginTop: '35px' }}>
                {/* <div className="col-sm-12 col-lg-4" style={{ marginTop: '35px' }}> */}
                  <div
                    className="card"
                    style={{
                      backgroundColor: '#000',
                      border: '1.5px solid rgb(30 34 39)',
                      width: '300px',
                      padding: '10px',
                    }}
                  >
                    <div className="user text-center">
                      <div className="profile">
                        {' '}
                        <img
                          src="https://data.ninjaswap.app/images/ninjaSwap_dp.jpeg"
                          className="rounded-circle"
                          width="80"
                        />{' '}
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <h4 className="mb-0">Your Profile</h4>
                      <span className="d-block mb-2">
                        {' '}
                        Address : {account ? shortenAddress(account) : '#########'}
                      </span>
                      <span className="d-block mb-2">
                        {' '}
                        Twitter : {twitterUsername == '' ? 'Not Set' : twitterUsername}
                      </span>
                      <span className="d-block mb-2">
                        {' '}
                        Telegram : {teleUsername == '' ? 'Not Set' : teleUsername}
                      </span>
                      {userStatus == 'inactive' ? (
                        <button
                          className="Zwap-btn-md-card button btn btn-primary"
                          onClick={() => actionButtonClick()}
                        >
                          {!account ? 'connect' : opState.actionBtnText}
                        </button>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  </Col>
                  <Col lg="8" style={{ marginTop: '35px' }}>
                {/* <div className="col-sm-12 col-lg-8" style={{ marginTop: '35px' }}> */}
                  <div className="text-sm-center text-md-left">
                    <h1 style={{ fontSize: '3rem' }}>Ninja Bounty Campaigns Platform</h1>
                    <p style={{ fontSize: '1rem' }}>
                      Launchped program can apply for Ninja Bounty campaigns as well
                    </p>
                    <p style={{ fontSize: '1rem' }}>
                      Bounty hunters must join our bounty channel for new updates{' '}
                      <a href="https://t.me/ninjabountyC" target="_blank">
                        @ninjabountyC
                      </a>
                    </p>
                    <p style={{ fontSize: '1rem' }}>
                      Note : only 1 account allowed for 1 ip , profile should be complete , must
                      connect twitter and telegram to join
                    </p>
                  </div>
               </Col>
              
              </Row>


            <div className="row">
              <div className="d-flex justify-content-center">
                <div className="col-sm-12 col-lg-12" style={{ marginTop: '35px' }}>
                  <Referral
                    // loading={isLoading}
                    // status={userBountyStatus}
                    setReferralAddress={setReferralAddress}
                  />
                </div>
              </div>
            </div>

            {!bounties?.length && (
              <div className="d-flex justify-content-center">
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              </div>
            )}
            {bounties?.length > 0 && (
              <>
                <h1 className="subTitle pt-2">All campaigns</h1>

                <div className="row pt-3">
                  {bounties.map((item: any, index: number) => {
                    const Grid =
                      item?.status === 'active'
                        ? GridSuccess
                        : item?.status === 'upcoming'
                        ? GridWarning
                        : item?.status === 'closed'
                        ? GridDanger
                        : GridDanger;
                    const percentage = (item?.total_reward > 0
                      ? (item?.total_reward / item?.total_reward) * 100
                      : 0
                    ).toFixed(2);
                    return (
                      <div className="col-sm-12 col-md-6 pt-4 pt-md-0" key={index.toString()}>
                        <Grid
                          style={{ cursor: 'pointer', marginTop: '10px' }}
                          onClick={() => gridClick(item?.cb_id)}
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
                            {getStatusBadge(item?.status , item?.claim_status)}
                              {/* {item?.status === 'active' && (
                                <LabelSuccess>
                                  <span>Active</span>
                                </LabelSuccess>
                              )}
                              {item?.status === 'upcoming' && (
                                <LabelUpcoming>
                                  <span>Upcoming</span>
                                </LabelUpcoming>
                              )}
                              {item?.claim_status === 'open'  && (
                                <LabelFinished>
                                  <span>Claims Open</span>
                                </LabelFinished>
                              )}
                              {item?.status === 'closed' && (
                                <LabelFinished>
                                  <span>Closed</span>
                                </LabelFinished>
                              )} */}
                            
                             
                              
                            </Label>
                          </Head>
                          <div className="align-items-left">
                            <CoinName>{item?.title}</CoinName>
                            <CoinDex>{item?.token}</CoinDex>
                            {/* <CoinDex>1 BNB = 7675.00 OOE</CoinDex> */}
                            <div className="d-flex">
                              <div>
                                <Title>Total Reward</Title>
                                <TextInfo>
                                  {item?.total_reward} {item?.token}
                                </TextInfo>
                              </div>
                              <div style={{ marginLeft: '32px' }}>
                                {/* <Title>Participants</Title>
                                <TextInfo>400</TextInfo> */}
                              </div>
                            </div>
                          </div>
                          <Footer columnLength={2}>
                            <div>
                              <TitleSmall>Participants</TitleSmall>
                              <TextInfo>{item?.participants}</TextInfo>
                            </div>
                            <div>
                              <TitleSmall>Started At</TitleSmall>
                              <TextInfo>
                                {moment.utc(item?.created_at).format('DD-MM-YYYY HH:mm')}
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
          </div>
        </div>

        {/* twitter connect model */}

        <ThemeProvider theme={theme}>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            open={twitterModelOpen}
          >
            <Container className={classes.paper}>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1}>
                  <Typography variant="h6" id="modal-title">
                    Connect Twitter
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="subtitle1" color="textPrimary">
                Please enter your twitter username.
              </Typography>
              <div style={{ height: '15px' }}></div>
              <Typography variant="subtitle2" color="textPrimary">
                Our team is going to confirm your twitter bounty steps, please make sure your
                account is publicly visible.
              </Typography>
              <div style={{ height: '30px' }}></div>
              <TextField
                id="outlined-number"
                label={'Twitter Username'}
                type="text"
                onChange={handleChange}
                value={twitterUsername}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">@</InputAdornment>,
                }}
              />
              <Button
                className={'Zwap-btn-card button ' + classes.signupButton}
                size="lg"
                block
                onClick={hanleConnectionSubmit}
              >
                Submit
              </Button>
            </Container>
          </Modal>
        </ThemeProvider>
      </div>
    </>
  );
}
