import React, { useCallback, useState, useEffect } from 'react';
import { useWalletModalToggle } from '../../state/application/hooks';
import useBlock from '../../hooks/useBlock';
import Notification from '../../components/Notification/Notification';
import Swal from 'sweetalert2';
import { useActiveWeb3React } from '../../hooks';
import { useETHBalances } from '../../state/wallet/hooks';
import { getNinjaAMOContract } from '../../utils';
import BigNumber from 'bignumber.js';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { isAddress } from '@ethersproject/address';
import web3 from 'web3';
import { useTransactionAdder } from '../../state/transactions/hooks';
import Stats from './Stats';
import Referral from './Referral';
import RefStats from './RefStats';
import Intro from './Intro';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import TextField from '@material-ui/core/TextField';
import useAdvenceTranslation from '../../hooks/useAdvenceTranslation';
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default function AMO() {
  const sleep = (delay: number = 0) => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };

  const { account, chainId, library } = useActiveWeb3React();
  const block = useBlock();
  const addTransaction = useTransactionAdder();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const toggleWalletModal = useWalletModalToggle();

  const { t, _t } = useAdvenceTranslation({ prefix: 'amoPage' });

  const [BtnStatus, setButtons] = useState({
    buy: false,
    claim: false,
  });
  const [userStats, setUserStats] = useState({
    isReferred: false,
    referralAdd: '0x',
  });
  const [opState, setOpState] = useState({
    estimatedTokens: _t('estimatedTokens'),
    estimateSpinner: false,
    bnbValid: false,
    howMuchBnb: '',
  });

  const bn: any = new BigNumber('1e18');
  const SMALLEST_UNIT = 0.000000000000000001;

  const fetchUserData = useCallback(async () => {
    if (!chainId || !library || !account) return;
    const refferal_address = localStorage.getItem('referral_code');
    setUserStats({
      isReferred: isAddress(refferal_address || '{}'),
      referralAdd: refferal_address || 'null',
    });
  }, [account, block]);

  const fetchAll = useCallback(async () => {
    fetchUserData();
  }, [fetchUserData, account, block]);

  useEffect(() => {
    fetchAll();
  }, [account, block]);
  
  const computeEstimatedTokens = async function(deposit: any) {
    let howMuchEth = deposit;
    try {
      howMuchEth = Number(howMuchEth);
      setOpState({ ...opState, estimateSpinner: true });
      await sleep(2000);
      if (!chainId || !library || !account) {
        setOpState({
          ...opState,
          bnbValid: false,
          estimatedTokens: _t('pleaseConnect'),
          estimateSpinner: false,
        });
        return;
      }
      if (howMuchEth <= SMALLEST_UNIT) {
        setOpState({
          ...opState,
          bnbValid: false,
          estimatedTokens: _t('valueMustGreater'),
          estimateSpinner: false,
        });
        return;
      }
      const enterVal = bn.multipliedBy(howMuchEth).integerValue();
      const adjustGas = bn.multipliedBy(0.002).integerValue();
      const finalbnb = enterVal.plus(adjustGas);
      const userB = bn.multipliedBy(userEthBalance?.toSignificant(4)).integerValue();
      let depositAmount = '0';
      if (finalbnb.isGreaterThan(userB)) {
        howMuchEth = userB.minus(adjustGas);
        Notification.notification({
          type: 'info',
          message: _t('maximumInvestNotify', { data: (howMuchEth / bn).toString() }),
        });
      } else {
        howMuchEth = enterVal;
      }
      setOpState({ ...opState, howMuchBnb: (howMuchEth / bn).toString() });
      depositAmount = howMuchEth.toString();
      if (!chainId || !library || !account) return;
      const contract = getNinjaAMOContract(chainId, library, account);
      let rewardAmount = await contract.getEstimatedContinuousMintReward(depositAmount);
      if (userStats.isReferred && userStats.referralAdd != account) {
      } else {
      }
      setOpState((oldState) => ({
        ...oldState,
        estimatedTokens: `${(rewardAmount / bn).toString()} Ninja`,
        estimateSpinner: false,
        bnbValid: true,
      }));
    } catch (e) {
      setOpState({ ...opState, bnbValid: false });
      return;
    }
  };
  const handleOnChange = useCallback(
    (e) => {
      let howMuchEth = e.target.value;
      computeEstimatedTokens(howMuchEth);
      return;
    },
    [computeEstimatedTokens],
  );
  const onBuy = useCallback(async () => {
    setButtons({ ...BtnStatus, buy: true });
    if (!account) {
      Notification.notification({
        type: 'error',
        message: _t('pleaseConnect'),
      });
      setButtons({ ...BtnStatus, buy: false });
      toggleWalletModal();
      return;
    }
    if (!chainId || !library || !account || !opState.bnbValid) {
      setButtons({ ...BtnStatus, buy: false });
      return;
    }
    //var receipt:any = "";
    try {
      const contract = getNinjaAMOContract(chainId, library, account);
      const _deposit = web3.utils.toWei(String(opState.howMuchBnb), 'ether');
      if (userStats.isReferred && userStats.referralAdd != account) {
        await contract
          .buyWithRef(userStats.referralAdd, _deposit, {
            from: account,
            value: _deposit,
          })
          .then((response: any) => {
            addTransaction(response, {
              summary: _t('boughtTokens'),
            });
            Notification.notification({
              type: 'success',
              message: _t('transactionSuccess'),
            });
          });
      } else {
        await contract
          .buy(_deposit, {
            from: account,
            value: _deposit,
          })
          .then((response: any) => {
            addTransaction(response, {
              summary: _t('boughtTokens'),
            });
            Notification.notification({
              type: 'success',
              message: _t('transactionSuccess'),
            });
          });
      }
      setButtons({ ...BtnStatus, buy: false });
      fetchAll();
    } catch (error) {
      fetchAll();
      console.debug(_t('buyFailed'), error);
      setButtons({ ...BtnStatus, buy: false });
      Swal.fire({
        icon: 'error',
        title: _t('transactionFail'),
        text: _t('tryLater'),
      });
    }
  }, [account, opState]);

  return (
    <>
      <div className="col-lg-10 col-md-10 col-sm-12">
        {/* <Intro /> */}
        <div className="main container mainContainer" id="content">
          <Stats />

          <div className="row purchaseRow justify-content-sm-center">
            <div className="col-sm-6">
              <div className="title">{_t('purchaseNinja')}</div>
              <p style={{ color : 'red' }}>{_t('disabledAmov1')}</p>
              <div className="sub get-estimated">
                {opState.estimateSpinner ? (
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                ) : (
                  opState.estimatedTokens
                )}
              </div>
            </div>
            <div className="col-sm-3 text-right">
              <div className="totalAmountBonus" style={{ marginTop: '36px', display: 'block' }}>
                <b>
                  {' '}
                  {_t('available')} :{' '}
                  {account && userEthBalance ? `${userEthBalance?.toSignificant(4)} BNB` : `0 BNB`}
                </b>{' '}
                <span className="bonus"></span>
              </div>
            </div>
            <div className="col-sm-3 text-right noMobile">
              <Button
                id="purchase"
                disabled={true}
                // disabled={!opState.bnbValid}
                onClick={onBuy}
                className="buy-btn Desktop-Btn"
              >
                {BtnStatus.buy ? (
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                ) : (
                  'AMO'
                )}
              </Button>
            </div>
            <br />
            <div className="col-sm-12 buy-input">
              <ThemeProvider theme={theme}>
                <TextField
                  disabled={true}
                  id="outlined-number"
                  type="number"
                  onChange={handleOnChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="input-bnb"
                  variant="outlined"
                />
              </ThemeProvider>
              <p className="purchase-error" style={{ display: 'none' }}>
                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                <span className="error-text"></span>
              </p>
            </div>
            <div className="col-sm-3 text-center noDesktop">
              <Button
                id="purchase"
                disabled={true}
               // disabled={!opState.bnbValid}
                onClick={onBuy}
                className="buy-btn MobilepurchaseBtn"
              >
                {BtnStatus.buy ? (
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                ) : (
                  _t('buyNow')
                )}
              </Button>
            </div>
          </div>
          <div style={{ marginTop: '45px' }}>
            <Referral />
          </div>

          <RefStats />
        </div>
      </div>
    </>
  );
}
