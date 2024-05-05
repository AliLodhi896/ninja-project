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
import { faScroll } from '@fortawesome/free-solid-svg-icons';
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
import useTwitterApi from '../../../hooks/useTwitterApi';
import { useActiveWeb3React } from '../../../hooks';
import Notification from '../../../components/Notification/Notification';
import { cloneDeep } from 'lodash';
import useArticleApi from '../../../hooks/useArticleApi';

export const ArticleIcon = (props: any) => <FontAwesomeIcon {...props} icon={faScroll} />;

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
    renderTitle: () => <>Web or social media article creation (Medium etc.)</>,
    renderPoints: () => <>50 points</>,
    completed: false,
  },
];

type ArticleProps = {
  status?: any;
  statusLoader?: any;
};

export default function Article({ status, statusLoader }: ArticleProps) {
  const themeStyle = useContext(ThemeContext);
  const classes = useStyles();
  const [articleUrl, setArticleUrl] = useState('');
  const [open, setOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskList, setTaskList] = useState(cloneDeep(TASKS));
  const isClaimable = isConnected && !!taskList.find((t) => !t.completed);
  /**
   * Bounty hooks
   */
  const { onArticleConnect, onDisconnect } = useBountyActionHandlers();
  const { article } = useBountyState();
  const bountySelectors = useBountySelectors();
  /**
   * API hooks
   */
  const articleApi = useArticleApi();

  const disconnect = () => {
    // Remove state
    onDisconnect('article');
    // Inform backend
    /* twitterApi.logout(); */
    // Refresh task list
    setTaskList(cloneDeep(TASKS));
    // Clear input
    setArticleUrl('');
  };

  const setTaskCompleted = (taskName: string, completed: boolean = true) => {
    const foundTaskIndex = TASKS.findIndex((t) => t.name === taskName);
    if (foundTaskIndex !== -1) {
      taskList[foundTaskIndex].completed = completed;
    }
  };

  const handleChange = useCallback((event) => {
    setArticleUrl(event.target.value);
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
    setArticleUrl(article?.articleUrl || '');
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

    articleApi
      .sendArticle({ articleUrl, userWalletId: account, referralWalletId: referral })
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
      status?.article && onArticleConnect({ articleUrl: status?.article });
      setTaskCompleted('content', status?.status_Article);
    } else {
      disconnect();
    }
  }, [account, status]);

  useEffect(() => {
    setIsConnected(bountySelectors.isConnected('article', (state) => !!state?.articleUrl));
  }, [article, account]);

  return (
    <>
      <InfoCard>
        <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
          <CardHeaderLeft>
            <IconWrapper>
              <ArticleIcon size="lg" color="#e1ad6d" />
            </IconWrapper>
            <div>Article</div>
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
                  Article Creation
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography variant="subtitle1" color="textPrimary">
              Please enter your article link.
            </Typography>
            <div style={{ height: '15px' }}></div>
            <Typography variant="subtitle2" color="textPrimary">
              Please add your Bounty Referral Url to the description area. Our team is going to
              confirm your creation.
            </Typography>
            <div style={{ height: '30px' }}></div>
            <TextField
              id="outlined-number"
              label={'Link'}
              type="text"
              onChange={handleChange}
              value={articleUrl}
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
