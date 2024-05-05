import React, { useCallback, useState, useEffect,useMemo } from 'react';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Backdrop from '@material-ui/core/Backdrop';
import Button from 'react-bootstrap/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import { amountFormatter, getXMasterChef } from '../../utils';
import { getFarm } from '../../utils';
import { xmasterChef } from '../../constants';
import { useActiveWeb3React } from '../../hooks';
import BigNumber from 'bignumber.js';
import Notification from '../../components/Notification/Notification';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner';
import web3 from 'web3';
import useBlock from '../../hooks/useBlock';
import { MaxUint256 } from '@ethersproject/constants';
import { Base_url } from '../../constants';
import styled from 'styled-components';
import useAdvenceTranslation from '../../hooks/useAdvenceTranslation';
import {
  isTransactionRecent,
  useAllTransactions,
  useTransactionAdder,
} from '../../state/transactions/hooks';
const bn: any = new BigNumber('1e18');

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
    margin: 8,
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

const Marginer = styled.div`
  margin-top: 20px;
`;

interface FarmsActionProps {
  farm?: string;
  pid?: string;
  deposit?: string;
  lockperiod? :string;
  onTradeUrlGenerated?: Function;
}

const FarmsActions: React.FC<FarmsActionProps> = ({ farm, pid, deposit, lockperiod }) => {
  const block = useBlock();
  const allTransactions = useAllTransactions();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort((a: any, b: any) => {
      return b.addedTime - a.addedTime;
    });
  }, [allTransactions]);
  const pendingTransactions = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const hasPendingTransactions = !!pendingTransactions.length;
  const buttonDisabled = hasPendingTransactions;
  const { account, chainId, library } = useActiveWeb3React();
  const [open, setOpen] = useState(false);
  const [action, setAction] = React.useState(1);
  const [available, setAvailable] = useState(0);
  const [stacked, setStacked] = useState(0);
  const [pendingReward, setPendingReward] = useState('0.00');
  const [allowance, setAllowance] = useState('0');
  const [inputValue, setInputVal] = useState(0);
  const addTransaction = useTransactionAdder();
  const [hash, setHash] = useState<string | undefined>()
  const { _t } = useAdvenceTranslation({ prefix: 'farmsPage:actions' });
  const [BtnStatus, setButtons] = useState({
    btn1: false,
    btn2: false,
  });
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const classes = useStyles();

  // useEffect(() => {
  //   getAlowance()
  //   getBalance()
  //   getUserInfo()
  //   getRewardInfo()
  // }, [])
  useEffect(() => {
    getAlowance();
    getBalance();
    getUserInfo();
    getRewardInfo();
  }, [block]);
  async function getAlowance() {
    if (!chainId || !library || !account || !farm) return;
    const farmToken = getFarm(farm, chainId, library, account);
    let allowance = await farmToken.allowance(account, xmasterChef);
    setAllowance(allowance);
  }
  async function getBalance() {
    if (!chainId || !library || !account || !farm) return;
    const farmToken = getFarm(farm, chainId, library, account);
    let balance = await farmToken.balanceOf(account);
    setAvailable(balance);
  }
  async function getUserInfo() {
    if (!chainId || !library || !account) return;
    const contract = await getXMasterChef(chainId, library, account);
    const userInfo = await contract.userInfo(pid, account);
    setStacked(userInfo[0]);
  }
  async function getRewardInfo() {
    if (!chainId || !library || !account) return;
    const contract = await getXMasterChef(chainId, library, account);
    const pendingReward = await contract.pendingXNINJA(pid, account);
    setPendingReward(`${amountFormatter(pendingReward)}`);
  }
  const handleChange = useCallback((event) => {
    setInputVal(parseFloat(event.target.value) * 10 ** 18);
  }, []);
  const onMax = async () => {
    if (action == 2) {
      console.log("stacked : " + stacked);
      setInputVal(stacked);
      (document.querySelector("[name='inputValue']") as HTMLInputElement).value = String(stacked / 10 ** 18);
  
    } else {
      setInputVal(available);
      (document.querySelector("[name='inputValue']") as HTMLInputElement).value = String(available / 10 ** 18);
    }
  };
  const handleClose = useCallback(() => {
    setOpen(false);
    setInputVal(0);
    (document.querySelector("[name='inputValue']") as HTMLInputElement).value = String(0);
  }, [setOpen]);
  const approveLP = async () => {
    setButtons({ ...BtnStatus, btn2: true });
    if (!chainId || !library || !account || !farm) return;
    const farmToken = getFarm(farm, chainId, library, account);
    try {
      await farmToken.approve(xmasterChef, MaxUint256).then((response: any) => {
        addTransaction(response, {
          summary: _t('approvedFarm'),
        });
        Notification.notification({
          type: 'success',
          message: _t('transactionSuccess'),
        });
      });
      setButtons({ ...BtnStatus, btn2: false });
    } catch (err) {
      setButtons({ ...BtnStatus, btn2: false });
      Swal.fire({
        icon: 'error',
        title: _t('transactionFail'),
        text: _t('tryLater'),
      });
    }
  };
  const onSubmit = useCallback(async () => {
    await handleClose();
    await getAlowance();
    if (Number(inputValue) <= 0) return;
    var enterVal = inputValue

    setButtons({ ...BtnStatus, btn2: true });
    if (!account) {
      Notification.notification({
        type: 'error',
        message: _t('connetWallet'),
      });
      setButtons({ ...BtnStatus, btn2: false });
      return;
    }
    if (!chainId || !library || !account) {
      setButtons({ ...BtnStatus, btn2: false });
      return;
    }
    const contract = await getXMasterChef(chainId, library, account);
    try {
      if (action == 1) {
        if (Number(inputValue) > Number(available)) {
          enterVal = available;
        }
        let amount = web3.utils.toBN(enterVal).toString();
        await contract.deposit(pid, amount, { from: account }).then((response: any) => {
          addTransaction(response, {
            summary: _t('depositedFarm'),
          });
          Notification.notification({
            type: 'success',
            message: _t('transactionSuccess'),
          });
        });
      } else if (action == 2) {
        if (Number(inputValue) > Number(stacked)) {
          enterVal = stacked;
        }
          console.log("enterVal : " + enterVal);
          let amount = web3.utils.toBN(enterVal).toString();
        await contract.withdraw(pid, amount, { from: account }).then((response: any) => {
          addTransaction(response, {
            summary: _t('withdrawFarm'),
          });
          Notification.notification({
            type: 'success',
            message: _t('transactionSuccess'),
          });
        });
      }
      setButtons({ ...BtnStatus, btn2: false });
    } catch (error) {
      console.debug('Tx Failed', error);
      setButtons({ ...BtnStatus, btn2: false });
      Swal.fire({
        icon: 'error',
        title: _t('transactionFail'),
        text: _t('tryLater'),
      });
    }
  }, [action, inputValue, available, stacked]);
  const onHarvest = useCallback(async () => {
    setButtons({ ...BtnStatus, btn1: true });
    if (!account) {
      Notification.notification({
        type: 'error',
        message: _t('connetWallet'),
      });
      setButtons({ ...BtnStatus, btn1: false });
      return;
    }
    if (!chainId || !library || !account) {
      setButtons({ ...BtnStatus, btn1: false });
      return;
    }
    //var receipt:any = "";
    try {
      const contract = await getXMasterChef(chainId, library, account);
      await contract.harvestFor(pid, { from: account }).then((response: any) => {
        addTransaction(response, {
          summary: _t('harvestReward'),
        });
        Notification.notification({
          type: 'success',
          message: _t('transactionSuccess'),
        });
      });

      setButtons({ ...BtnStatus, btn1: false });
    } catch (error) {
      console.debug(_t('failedHarvest'), error);
      setButtons({ ...BtnStatus, btn1: false });
      Swal.fire({
        icon: 'error',
        title: _t('transactionFail'),
        text: _t('tryLater'),
      });
    }
  }, [account]);
  return (
    <>
      <div className="single-vault-info" id="DIV_19">
        <div className="single-vault-title" id="DIV_20">
          {_t('pendingReward')}:
        </div>
        <div className="single-vault-amount" id="DIV_21">
          {pendingReward}
        </div>
      </div>
      <div className="single-vault-info" id="DIV_19">
        <div className="single-vault-title" id="DIV_20">
         Locked Period :
        </div>
        <div className="single-vault-amount" id="DIV_21">
          {lockperiod}
        </div>
      </div>
      <Marginer />

      {Number(pendingReward) > 0 ? (
        <Button
          onClick={onHarvest}
          className="Zwap-btn-md-card button"
          block
          disabled={BtnStatus.btn1}
        >
          {BtnStatus.btn1 ? (
            <Spinner as="span" animation="border" role="status" aria-hidden="true" />
          ) : (
            _t('harvest')
          )}
        </Button>
      ) : (
        <Button onClick={onHarvest} className="Zwap-btn-md-card button" block disabled={true}>
          {_t('harvest')}
        </Button>
      )}
      <Marginer />
      {Number(allowance) == 0 ? (
        <Button onClick={approveLP} className="Zwap-btn-md-card button" block>
          {BtnStatus.btn2 && buttonDisabled ? (
            <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
          ) : (
            'Allow Smart Contract'
          )}
        </Button>
      ) : (
        <Button onClick={handleOpen} className="Zwap-btn-md-card button" block>
          {BtnStatus.btn2 ? (
            <Spinner as="span" animation="border" role="status" aria-hidden="true" />
          ) : (
            _t('stakeUnstake')
          )}
        </Button>
      )}

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
                  {_t('depositLPTokens')}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography variant="caption" color="textPrimary">
            Available : {(Number(available) / 10 ** 18).toFixed(2)}
            </Typography>
            <Typography variant="caption" color="textPrimary">
            Stacked : {(Number(stacked) / 10 ** 18).toFixed(2)}
            </Typography>
            <Divider />
            <RadioGroup
              aria-label="action"
              name="action"
              value={action}
              onChange={(event) => {
                setAction(Number(event.target.value));
              }}
            >
              <FormControlLabel value={1} control={<Radio />} label={_t('stake')} />
              <FormControlLabel value={2} control={<Radio />} label={_t('unstake')} />
            </RadioGroup>
            <Divider />
            <TextField
              id="outlined-number"
              name="inputValue"
              label={deposit}
              type="number"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" onClick={onMax} className={classes.maxBtn}>
                    {_t('max')}
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <Button
              className={'Zwap-btn-card button ' + classes.signupButton}
              size="lg"
              block
              onClick={onSubmit}
            >
              {_t('submit')}
            </Button>
          </Container>
        </Modal>
      </ThemeProvider>
    </>
  );
};

export default FarmsActions;
