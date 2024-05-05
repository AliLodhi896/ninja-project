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
import { faYoutube as fabYoutube } from '@fortawesome/free-brands-svg-icons';
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
import useYoutubeApi from '../../../hooks/useYoutubeApi';

const youtubeParser = (url: string) => {
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return false;
  }
};

export const YoutubeIcon = (props: any) => <FontAwesomeIcon {...props} icon={fabYoutube} />;

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
    name: 'content',
    renderTitle: () => <>Content creation</>,
    renderPoints: () => <>100 points</>,
    completed: false,
  },
];

type YoutubeProps = {
  status?: any;
  statusLoader?: any;
};

export default function Youtube({ status, statusLoader }: YoutubeProps) {
  const themeStyle = useContext(ThemeContext);
  const classes = useStyles();
  const [contentUrl, setContentUrl] = useState('');
  const [open, setOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskList, setTaskList] = useState(cloneDeep(TASKS));
  const isClaimable = isConnected && !!taskList.find((t) => !t.completed);
  /**
   * Bounty hooks
   */
  const { onYoutubeConnect, onDisconnect } = useBountyActionHandlers();
  const { youtube } = useBountyState();
  const bountySelectors = useBountySelectors();
  /**
   * API hooks
   */
  const youtubeApi = useYoutubeApi();

  const disconnect = () => {
    // Remove state
    onDisconnect('youtube');

    // Inform backend
    /* twitterApi.logout(); */

    // Refresh task list
    setTaskList(cloneDeep(TASKS));

    // Clear input
    setContentUrl('');
  };

  const setTaskCompleted = (taskName: string, completed: boolean = true) => {
    const foundTaskIndex = TASKS.findIndex((t) => t.name === taskName);
    if (foundTaskIndex !== -1) {
      taskList[foundTaskIndex].completed = completed;
    }
  };

  const handleChange = useCallback((event) => {
    setContentUrl(event.target.value);
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
    setContentUrl(youtube?.contentUrl || '');
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const hanleConnectionSubmit = async () => {
    const parsedId = youtubeParser(contentUrl);
    if (!parsedId) {
      alert('Please use correct link.');
      return;
    }

    setIsLoading(true);
    handleClose();
    let referral = '';

    try {
      referral = (await localStorage.getItem('bounty_referral_code')) || '';
    } catch (error) {}

    youtubeApi
      .sendContent({ contentUrl: parsedId, userWalletId: account, referralWalletId: referral })
      .then((response: any) => {
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
      status?.youtube &&
        onYoutubeConnect({ contentUrl: 'https://www.youtube.com/watch?v=' + status?.youtube });
      setTaskCompleted('content', status?.status_Youtube);
    } else {
      disconnect();
    }
  }, [account, status]);

  useEffect(() => {
    setIsConnected(bountySelectors.isConnected('youtube', (state) => !!state?.contentUrl));
  }, [youtube, account]);

  return (
    <>
      <InfoCard>
        <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
          <CardHeaderLeft>
            <IconWrapper>
              <YoutubeIcon size="2x" color="#FF0000" />
            </IconWrapper>
            <div>Youtube</div>
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
            <CardRow key={i.toString()} completed={task.completed}>
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
                  Youtube Creation
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography variant="subtitle1" color="textPrimary">
              Please enter your youtube content link.
            </Typography>
            <div style={{ height: '15px' }}></div>
            <Typography variant="subtitle2" color="textPrimary">
              Our team is going to confirm your youtube creation, please make sure your video is
              publicly visible and longer than 3 minutes. Please add your Bounty Referral Url to the description of your
              video.
            </Typography>
            <div style={{ height: '30px' }}></div>
            <TextField
              id="outlined-number"
              label={'Link'}
              type="text"
              onChange={handleChange}
              value={contentUrl}
              variant="outlined"
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
