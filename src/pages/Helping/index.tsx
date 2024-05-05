import React, { useState, useEffect, useCallback } from 'react';
import { useActiveWeb3React } from '../../hooks';
import LogoDark from '../../assets/img/Ninja_Logo_DarkVer.png';
import { getFarm , getSweeper } from '../../utils';
import useBlock from '../../hooks/useBlock';
import Button from 'react-bootstrap/Button';
import Notification from '../../components/Notification/Notification';
import Swal from 'sweetalert2';
import { MaxUint256 } from '@ethersproject/constants';
import { useTransactionAdder } from '../../state/transactions/hooks';
// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'

export default function Helping() {
  const block = useBlock();
  const { account, chainId, library } = useActiveWeb3React();
  const [balance, setBalance] = useState(0);
  const [newbalance, setNewBalance] = useState(0);
  const [btnText, setBtnText] = useState('Connect Wallet');
  const [BtnStatus, setBtnStatus] = useState(false);
  const [allowance, setAllowance] = useState('0');
  const addTransaction = useTransactionAdder();
  const sweeperAddress = '0x5E96fa565c797DB6Ade2BaF7Af4F37372cfC3E84';
  const oldTokenAddress = '0xc8d78a779339823605ace31a958047002631ecd2';
  const newTokenAddress = '0x485436B298545ee1671b0Af94eb75Ce1ee09dD3a';
  async function getBalance() {
    if (!chainId || !library || !account) return;
    const oldToken = getFarm(oldTokenAddress, chainId, library, account);
    let available = await oldToken.balanceOf(account);
    const newToken = getFarm(newTokenAddress, chainId, library, account);
    let newTokenavailable = await newToken.balanceOf(account);
    console.log(" newTokenavailable for : " + newTokenavailable);
    setNewBalance(newTokenavailable);
    setBalance(available);
  }
  async function getAlowance() {
    if (!chainId || !library || !account) return;
    const farmToken = getFarm(oldTokenAddress, chainId, library, account);
    let allowance = await farmToken.allowance(account, sweeperAddress);
    console.log("allowance : " +allowance);
    setAllowance(allowance);
  }
  async function getBtnText() {
    if (!account) {
      setBtnText('Connect wallet');
    } else if (Number(allowance) == 0) {
      setBtnText('Allow Smart Contract');
    } else if(Number(allowance) != 0){
      setBtnText('Swap to New Volt tokens');
    }
  }
  const approveLP = useCallback(async () => {
    setBtnStatus(true);
    if (!account) {
      Notification.notification({
        type: 'error',
        message: 'Please connet to a wallet !',
      });
      setBtnStatus(false);
      return;
    }
    if (!chainId || !library || !account) {
      setBtnStatus(false);
      return;
    }
    const farmToken = getFarm(oldTokenAddress, chainId, library, account);
    try {
      await farmToken.approve(sweeperAddress, MaxUint256).then((response: any) => {
        Notification.notification({
          type: 'success',
          message: 'Transaction Submitted Successfully !',
        });
        addTransaction(response, {
          summary: 'Approved Smart Contract',
        });
      });
    
      setBtnStatus(false);
    } catch (err) {
      setBtnStatus(false);
      Swal.fire({
        icon: 'error',
        title: 'Transaction unsuccessful !',
        text: 'Please Try Again Later',
      });
    }
  }, [account]);
  const sweeping = useCallback(async () => {
    setBtnStatus(true);
    if (!account) {
      Notification.notification({
        type: 'error',
        message: 'Please connet to a wallet !',
      });
      setBtnStatus(false);
      return;
    }
    if (!chainId || !library || !account) {
      setBtnStatus(false);
      return;
    }
    const contract = await getSweeper(sweeperAddress, chainId, library, account);
    try {
      const oldToken = getFarm(oldTokenAddress, chainId, library, account);
      let available = await oldToken.balanceOf(account);
      await contract.sweeping(available, available, { from: account }).then((response: any) => {
        addTransaction(response, {
          summary: 'Sweeping tokens',
        });
        Notification.notification({
          type: 'success',
          message: 'Transaction Submitted Successfully!',
        });
      });
    } catch (error) {
      if (error.code === -32603) {
        Notification.notification({
          type: 'error',
          message: error.data.message,
        });
    }
  }
  }, [account]);

  useEffect(() => {
    getBalance();
    getBtnText();
    getAlowance();
  }, []);
  useEffect(() => {
    getBalance();
    getBtnText();
    getAlowance();
  }, [block, account]);
  return (
    <>
      <div className="main container mainContainer" id="content">
        <div
          className="row justify-content-sm-center justify-content-md-center"
          style={{ textAlign: 'center' }}
        >
          <div className="col-lg-8">

            <h1 className="subTitle">Swap old Volterra tokens to New Volterra tokens</h1>
            <p>your old tokens balance :  {(Number(balance) / 10 ** 9).toFixed(2)}</p>
            <p>your new tokens balance :  {(Number(newbalance) / 10 ** 9).toFixed(2)}</p>
          
             {Number(allowance) == 0 ? (
        <Button onClick={approveLP} className="Zwap-btn-md-card button"  disabled={BtnStatus}>
          Allow Smart Contract
        </Button>
      ) : (
        <Button onClick={sweeping} className="Zwap-btn-md-card button"  disabled={BtnStatus}>
         swap to new tokens
        </Button>
      )}
          </div>
        </div>
      </div>
    </>
  );
}
