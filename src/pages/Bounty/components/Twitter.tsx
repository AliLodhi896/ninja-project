import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  CardAction,
  CardBody,
  CardHeader,
  CardRow,
  CardRowLeft,
  CardRowRight,
  CheckIcon,
  IconWrapper,
  InfoCard,
  PointBadge,
  CardTaskAction,
  CardHeaderLeft,
} from './Card';
import { faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeContext } from 'styled-components';
import {
  useBountyActionHandlers,
  useBountySelectors,
  useBountyState,
} from '../../../state/bounty/hooks';
import useTelegramApi from '../../../hooks/useTelegramApi';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import Container from '@material-ui/core/Container';
import { IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import Button from 'react-bootstrap/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import useTwitterApi from '../../../hooks/useTwitterApi';
import { useActiveWeb3React } from '../../../hooks';
import Notification from '../../../components/Notification/Notification';
import { cloneDeep } from 'lodash';
import { TWITTER_ACCOUNT_URL } from '../../../constants';
// @ts-ignore
import { Tweet } from 'react-twitter-widgets';
// @ts-ignore
import { TwitterTweetEmbed } from 'react-twitter-embed';

export const TwitterIcon = (props: any) => <FontAwesomeIcon {...props} icon={fabTwitter} />;

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

const TASKS = [
  {
    name: 'follow',
    renderTitle: () => (
      <>
        Follow{' '}
        <a rel="noreferrer" target="_blank" href={TWITTER_ACCOUNT_URL}>
          @NinjaSwapApp
        </a>{' '}
        account
      </>
    ),
    renderPoints: () => <>5 points</>,
    completed: false,
  },
  {
    name: 'retweet',
    renderTitle: () => (
      <>
        Retweet{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/ninjaswapapp/status/1387487910870519810"
        >
          this tweet
        </a>{' '}
        with 5 friends tag and must use these hashtags #NINJA #BNB #BSC
        {/* <Tweet
          tweetId="1387487910870519810"
          options={{
            chrome: 'noheader, nofooter',
            borderColor: '#12161c',
            theme: 'dark',
            height: '50',
          }}
        /> */}
      </>
    ),
    renderPoints: () => <>10 points</>,
    afterRow: () => (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            margin: 'auto',
          }}
        >
          {/* <TwitterTweetEmbed options={{ theme: 'dark' }} tweetId={'1387487910870519810'} /> */}
          <Tweet
            tweetId="1387487910870519810"
            options={{
              chrome: 'noheader, nofooter',
              borderColor: '#12161c',
              theme: 'dark',
            }}
          />
        </div>
      </div>
    ),
    completed: false,
  },
];

type TwitterProps = {
  status?: any;
  statusLoader?: any;
};

export default function Twitter({ status, statusLoader }: TwitterProps = {}) {
  const themeStyle = useContext(ThemeContext);
  const classes = useStyles();
  const [twitterUsername, setTwitterUsername] = useState('');
  const [open, setOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskList, setTaskList] = useState(cloneDeep(TASKS));
  const isClaimable = isConnected && !!taskList.find((t) => !t.completed);
  /**
   * Bounty hooks
   */
  const { onTwitterConnect, onDisconnect } = useBountyActionHandlers();
  const { twitter } = useBountyState();
  const bountySelectors = useBountySelectors();
  /**
   * API hooks
   */
  const twitterApi = useTwitterApi();

  const disconnect = () => {
    // Remove state
    onDisconnect('twitter');

    // Inform backend
    /* twitterApi.logout(); */

    console.log('tasks', cloneDeep(TASKS));

    // Refresh task list
    setTaskList(cloneDeep(TASKS));

    // Clear input
    setTwitterUsername('');
  };

  const setTaskCompleted = (taskName: string, completed: boolean = true) => {
    const foundTaskIndex = TASKS.findIndex((t) => t.name === taskName);
    if (foundTaskIndex !== -1) {
      taskList[foundTaskIndex].completed = completed;
    }
  };

  const handleChange = useCallback((event) => {
    setTwitterUsername(event.target.value);
  }, []);

  const hanleConnectButton = () => {
    if (!account) {
      Notification.notification({
        type: 'warning',
        message: 'Please connect your wallet.',
      });
      return;
    }
    /* if (isConnected) {
      disconnect();
      return;
    } */
    handleOpen();
  };

  const handleOpen = () => {
    setOpen(true);
    setTwitterUsername(twitter?.twitterUsername || '');
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const hanleConnectionSubmit = async () => {
    setIsLoading(true);
    handleClose();
    let referral = '';

    try {
      referral = (await localStorage.getItem('bounty_referral_code')) || '';
    } catch (error) {}

    twitterApi
      .sendUsername({ twitterUsername, userWalletId: account, referralWalletId: referral })
      .then((data: any) => {
        statusLoader && statusLoader();
      })
      .catch((error) => {
        console.log('error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (account && status) {
      status?.twitter_username && onTwitterConnect({ twitterUsername: status?.twitter_username });
      setTaskCompleted('follow', !!status?.twitter_follow);
      setTaskCompleted('retweet', !!status?.retweet_status);
    } else {
      disconnect();
    }
  }, [account, status]);

  useEffect(() => {
    setIsConnected(bountySelectors.isConnected('twitter', (state) => !!state?.twitterUsername));
  }, [twitter, account]);

  return (
    <>
      <InfoCard>
        <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
          <CardHeaderLeft>
            <IconWrapper>
              <TwitterIcon size="2x" color="#1DA1F2" />
            </IconWrapper>
            <div>Twitter</div>
          </CardHeaderLeft>
          <CardAction onClick={hanleConnectButton} connected={isConnected} disabled={isLoading}>
            {isConnected ? 'Connected' : 'Connect'}
            {/* <PointBadge completed={isConnected}>10 points</PointBadge> */}
          </CardAction>
        </CardHeader>
        <CardBody>
          {/* <CardRow completed={true}>
            <CardRowLeft>
              <CardTaskAction
                connected={isConnected}
                disabled={!isClaimable}
                style={{ marginLeft: '10px' }}
                onClick={() => {}}
              >
                {isClaimable ? 'Claim All Twitter Points' : 'You claimed all Twitter points'}
              </CardTaskAction>
            </CardRowLeft>
          </CardRow> */}
          {taskList.map((task, i) => (
            <div key={i.toString()}>
              <CardRow completed={task.completed}>
                <CardRowLeft>
                  <IconWrapper>
                    <CheckIcon color={task.completed ? 'green' : null} />
                  </IconWrapper>
                  <span>
                    {task.renderTitle()}
                    {task.renderPoints && (
                      <PointBadge completed={task.completed}>{task.renderPoints()}</PointBadge>
                    )}
                  </span>
                </CardRowLeft>

                {/* <CardTaskAction
                connected={isConnected}
                disabled={!isConnected || task.completed}
                style={{ marginLeft: '10px' }}
                onClick={() => (task.completed = true)}
              >
                {task.completed ? 'Earned' : 'Claim'} {task.renderPoints()}
              </CardTaskAction> */}
              </CardRow>
              {task?.afterRow && task?.afterRow()}
            </div>
          ))}
        </CardBody>
      </InfoCard>
      <ThemeProvider theme={theme}>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          open={open}
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
              Our team is going to confirm your twitter bounty steps, please make sure your account
              is publicly visible.
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
    </>
  );
}