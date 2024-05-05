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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faScroll } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from 'styled-components';
import {
  useBountyActionHandlers,
  useBountySelectors,
  useBountyState,
} from '../../../state/bounty/hooks';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import Container from '@material-ui/core/Container';
import { IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import Button from 'react-bootstrap/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import { useActiveWeb3React } from '../../../hooks';
import Notification from '../../../components/Notification/Notification';
import { cloneDeep } from 'lodash';
import useGifApi from '../../../hooks/useGifApi';

export const PaletteIcon = (props: any) => <FontAwesomeIcon {...props} icon={faPalette} />;

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
    name: 'gif_1',
    renderTitle: () => <>1th gif and meme creation</>,
    renderPoints: () => <>20 points</>,
    completed: false,
  },
  {
    name: 'gif_2',
    renderTitle: () => <>2nd gif and meme creation</>,
    renderPoints: () => <>20 points</>,
    completed: false,
  },
  {
    name: 'gif_3',
    renderTitle: () => <>3rd gif and meme creation</>,
    renderPoints: () => <>20 points</>,
    completed: false,
  },
];

type GifProps = {
  status?: any;
  statusLoader?: any;
};

export default function Gif({ status, statusLoader }: GifProps) {
  const themeStyle = useContext(ThemeContext);
  const classes = useStyles();
  const [gif1Url, setGif1Url] = useState('');
  const [gif2Url, setGif2Url] = useState('');
  const [gif3Url, setGif3Url] = useState('');
  const [open, setOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskList, setTaskList] = useState(cloneDeep(TASKS));
  const isClaimable = isConnected && !!taskList.find((t) => !t.completed);
  /**
   * Bounty hooks
   */
  const { onGifConnect, onDisconnect } = useBountyActionHandlers();
  const { gif } = useBountyState();
  const bountySelectors = useBountySelectors();
  /**
   * API hooks
   */
  const gifApi = useGifApi();

  const disconnect = () => {
    // Remove state
    onDisconnect('gif');
    // Inform backend
    /* twitterApi.logout(); */
    // Refresh task list
    setTaskList(cloneDeep(TASKS));
    // Clear input
    setGif1Url('');
    setGif2Url('');
    setGif3Url('');
  };

  const setTaskCompleted = (taskName: string, completed: boolean = true) => {
    const foundTaskIndex = TASKS.findIndex((t) => t.name === taskName);
    if (foundTaskIndex !== -1) {
      taskList[foundTaskIndex].completed = completed;
    }
  };

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
    setGif1Url(gif?.content1Url || '');
    setGif2Url(gif?.content2Url || '');
    setGif3Url(gif?.content3Url || '');
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

    gifApi
      .sendContents({
        gif1: gif1Url,
        gif2: gif2Url,
        gif3: gif3Url,
        userWalletId: account,
        referralWalletId: referral,
      })
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
      onGifConnect({
        content1Url: status?.gifmeme1 || undefined,
        content2Url: status?.gifmeme2 || undefined,
        content3Url: status?.gifmeme3 || undefined,
      });
      setTaskCompleted('gif_1', status?.status_Gifmeme1);
      setTaskCompleted('gif_2', status?.status_Gifmeme2);
      setTaskCompleted('gif_3', status?.status_Gifmeme3);
    } else {
      disconnect();
    }
  }, [account, status]);

  useEffect(() => {
    setIsConnected(
      bountySelectors.isConnected(
        'gif',
        (state) => state?.content1Url || state?.content2Url || state?.content3Url,
      ),
    );
  }, [gif, account]);

  return (
    <>
      <InfoCard>
        <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
          <CardHeaderLeft>
            <IconWrapper>
              <div className="svg-gradient-container">
                <svg width="0" height="0">
                  <linearGradient id="lgrad" x2="100%" y2="100%">
                    <stop style={{ stopColor: '#ff2400', offset: '0%' }}></stop>
                    <stop style={{ stopColor: '#e81d1d', offset: '11%' }}></stop>
                    <stop style={{ stopColor: '#e8b71d', offset: '22%' }}></stop>
                    <stop style={{ stopColor: '#e3e81d', offset: '33%' }}></stop>
                    <stop style={{ stopColor: '#1de840', offset: '44%' }}></stop>
                    <stop style={{ stopColor: '#2b1de8', offset: '55%' }}></stop>
                    <stop style={{ stopColor: '#ff2400', offset: '66%' }}></stop>
                    <stop style={{ stopColor: '#dd00f3', offset: '77%' }}></stop>
                    <stop style={{ stopColor: '#e8b71d', offset: '88%' }}></stop>
                    <stop style={{ stopColor: '#dd00f3', offset: '100%' }}></stop>
                  </linearGradient>
                </svg>
                <PaletteIcon size="2x" />
              </div>
            </IconWrapper>
            <div>Gif and Meme</div>
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
                  Gif and Meme Creation
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography variant="subtitle1" color="textPrimary">
              Please enter your gif and meme link. Max 3 creation is accepted.
            </Typography>
            <div style={{ height: '15px' }}></div>
            <Typography variant="subtitle2" color="textPrimary">
              Please add your Bounty Referral Url to the description area. Our team is going to
              confirm your creation.
            </Typography>
            <div style={{ height: '30px' }}></div>
            <TextField
              id="outlined-number"
              label={'Link 1'}
              type="text"
              onChange={(event) => setGif1Url(event.target.value)}
              value={gif1Url}
              variant="outlined"
            />
            <div style={{ height: '20px' }}></div>
            <TextField
              id="outlined-number"
              label={'Link 2'}
              type="text"
              onChange={(event) => setGif2Url(event.target.value)}
              value={gif2Url}
              variant="outlined"
            />
            <div style={{ height: '20px' }}></div>
            <TextField
              id="outlined-number"
              label={'Link 3'}
              type="text"
              onChange={(event) => setGif3Url(event.target.value)}
              value={gif3Url}
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
