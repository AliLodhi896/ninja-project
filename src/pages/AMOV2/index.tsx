import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useActiveWeb3React } from '../../hooks';
import styled, { ThemeContext } from 'styled-components';
import useBlock from '../../hooks/useBlock';
import Spinner from 'react-bootstrap/Spinner';
import { getStarterPoolDetail } from '../../utils/axios';
import { RouteComponentProps, useHistory } from 'react-router';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { AutoColumn } from '../../components/Column';
import CurrencyInputPanel from './components/CurrencyInputPanel';
import { AutoRow } from '../../components/Row';
import { ArrowWrapper } from '../../components/swap/styleds';
import { ArrowDown } from 'react-feather';
import { TYPE } from '../../theme';
import { Currency, CurrencyAmount, JSBI, Token } from '@bscswap/sdk';
import AppBody from '../AppBody';
import { filterTokens } from '../../components/SearchModal/filtering';
import { useAllTokens, useCurrency } from '../../hooks/Tokens';
import BigNumber from 'bignumber.js';
import { useCurrencyBalances } from '../../state/wallet/hooks';
import Notification from '../../components/Notification/Notification';
import CurrencyDisabledInputPanel from './components/CurrencyDisabledInputPanel';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import Button from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { GreyCard } from '../../components/Card';
import { ButtonConfirmed, ButtonLight } from '../../components/Button';
import Loader from '../../components/Loader';
import { useWalletModalToggle } from '../../state/application/hooks';
import useAdvenceTranslation from '../../hooks/useAdvenceTranslation';
import Swal from 'sweetalert2';
import { getAMOv2Contract, getBUSDContract } from '../../utils';
import Ninja_icon from '../../assets/images/Ninja_icon.png';
import Stats from './components/Stats';
import web3 from 'web3';
import {
  isTransactionRecent,
  useAllTransactions,
  useTransactionAdder,
} from '../../state/transactions/hooks';
import { MaxUint256 } from '@ethersproject/constants';
import { formatEther, parseEther, parseUnits } from '@ethersproject/units';

const BackButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center;
  `}
`;

const themeMui = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: 'rgb(240,185,11)',
    },
  },
});

const BUSD_ADDRESS = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';

export default function AMOV2() {

  const block = useBlock();
  const { _t } = useAdvenceTranslation({ prefix: 'amoPage' });
  const { account, chainId, library } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const addTransaction = useTransactionAdder();
  const theme = useContext(ThemeContext);
  const [poolDetail, setPoolDetail] = useState<any>(false);
 // const poolInfo = poolDetail?.poolInfo;
 const poolInfo = { name : "NinjaSwap " , symbol : "NINJA", logo : Ninja_icon,  decimals : 18 , pool_address : "0x2463B2ac7165C36CD3471023F93E59d4D5e3E8e0", estimated_1bnb_tokens: 51656.88 };
  const history = useHistory();
  const allTokensPre = useAllTokens();
  // BUSD and BNB is allowed
  const allTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokensPre), BUSD_ADDRESS);
  }, [allTokensPre]);
  const bnbCurrency = useCurrency('BNB');
  // const [typedField, setTypedField] = useState<'input' | 'output'>('input');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [inputCurrency, setInputCurrency] = useState<Currency | null>(bnbCurrency ?? null);
  const outputCurrency = useMemo(() => poolInfo, [poolDetail]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);
  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    relevantTokenBalances[0] || undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  // const [parsedAmountTo, setParsedAmountTo] = useState('0');
  const [allowance, setAllowance] = useState('0');
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
  const buttonDisabled =
    isLoading || !outputValue?.length || outputValue === '0' || hasPendingTransactions;

  const bn: any = new BigNumber('1e18');
  const SMALLEST_UNIT = 0.000000000000000001;

  const loadEstimatedToken = async (fieldTyping: 'input' | 'output', value: any) => {
    setErrorMessage(null);
    if (!chainId || !library || !poolInfo) return;
    let calculatedAmount = new BigNumber('0');

    try {
      if (fieldTyping === 'input') {
        setInputValue(value);
        // typing on input field
        const contract = getAMOv2Contract(
          poolInfo.pool_address,
          chainId,
          library,
          account ?? undefined,
        );
        const typedValue = value || '0';
        const bigNumberUserInput = new BigNumber(typedValue);
        const bigNumberInAccount = new BigNumber(Number(maxAmountInput?.toExact() || '0'));

        if (inputCurrency?.symbol === 'BNB') {
          const estimatedAmount = await contract.getEstimatedTokensMintWithBNB(
            parseEther(typedValue),
          );
          const bigNumberAmount = new BigNumber(formatEther(estimatedAmount.toString()));
          calculatedAmount = bigNumberAmount.decimalPlaces(8);
        } else if (inputCurrency?.symbol === 'BUSD') {
          const buyPrice = await contract.mintPrice();
          const bigNumberBuyPrice = new BigNumber(formatEther(buyPrice.toString()));
          calculatedAmount = bigNumberUserInput.dividedBy(bigNumberBuyPrice).decimalPlaces(8);
        }

        if (bigNumberUserInput.isGreaterThan(bigNumberInAccount)) {
          setErrorMessage('Insufficient balance');
        }

        setOutputValue(calculatedAmount.toString());
      } else if (fieldTyping === 'output') {
        setOutputValue(value);
        // typing on output field
        const typedValue = value || '0';
        const bigNumberUserInput = new BigNumber(typedValue);
        const bigNumberInAccount = new BigNumber(Number(maxAmountInput?.toExact() || '0'));

        if (inputCurrency?.symbol === 'BNB') {
          const bigNumberAmount = new BigNumber(poolInfo?.estimated_1bnb_tokens);
          calculatedAmount = bigNumberUserInput.dividedBy(bigNumberAmount).decimalPlaces(8);
        } else if (inputCurrency?.symbol === 'BUSD') {
          const contract = getAMOv2Contract(
            poolInfo.pool_address,
            chainId,
            library,
            account ?? undefined,
          );
          const buyPrice = await contract.buyPrice();
          const bigNumberBuyPrice = new BigNumber(formatEther(buyPrice.toString()));
          const bigNumberUserInput = new BigNumber(typedValue);
          calculatedAmount = bigNumberUserInput.multipliedBy(bigNumberBuyPrice).decimalPlaces(8);
        }
        if (calculatedAmount.isGreaterThan(bigNumberInAccount)) {
          setErrorMessage('Insufficient balance');
        }

        setInputValue(calculatedAmount.toString());
      }
    } catch (error) {}
  };

  const handleInputCurrencySelect = (selectedCurrency: Currency) => {
    setInputCurrency(selectedCurrency);
  };

  const loadPoolDetail = async () => {
    const data = await getStarterPoolDetail('CRA');
    setPoolDetail(data);
    // if (data && data?.poolInfo?.status === 'active') {
    //   setPoolDetail(data);
    // } else {
    //   history.push(`/ninja-starter/CRA`);
    // }
  };

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      // setInputValue(maxAmountInput.toSignificant(8));
      // handleChange('input', maxAmountInput.toSignificant(8));
      // setInputValue(maxAmountInput.toSignificant(8));
      // setTypedField('input');
      loadEstimatedToken('input', maxAmountInput.toSignificant(8));
    }
  }, [maxAmountInput]);

  const getAlowance = async () => {
    if (!chainId || !library || !account || !poolInfo?.pool_address) return;
    // setIsLoading(true);
    const busdContract = getBUSDContract(chainId, library, account);
    let allowance = await busdContract.allowance(account, poolInfo?.pool_address);
    setAllowance(allowance);
    // setIsLoading(false);
  };

  const approve = async () => {
    try {
      if (!chainId || !library || !account || !poolInfo?.pool_address) return;
      // setIsLoading(true);
      const busdContract = getBUSDContract(chainId, library, account);

      await busdContract.approve(poolInfo?.pool_address, MaxUint256).then((response: any) => {
        addTransaction(response, {
          summary: 'Approved',
        });
        Notification.notification({
          type: 'success',
          message: _t('transactionSuccess'),
        });
      });

      await getAlowance();
    } catch (error) {
      Notification.notification({
        type: 'error',
        message: _t('transactionFail'),
      });
    } finally {
      // setIsLoading(false);
    }
  };

  const onBuy = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    if (!account) {
      Notification.notification({
        type: 'error',
        message: _t('pleaseConnect'),
      });
      setErrorMessage(_t('pleaseConnect'));
      toggleWalletModal();
      return;
    }
    if (!chainId || !library || !account) {
      setErrorMessage('Something wrong');
      return;
    }

    try {
      /*  let howMuchEth = Number(inputValue);
      const enterVal = bn.multipliedBy(howMuchEth).integerValue(); */

      if (inputCurrency?.symbol === 'BNB') {
        const poolAddress = `${poolInfo.pool_address}`;
        const contract = getAMOv2Contract(poolAddress, chainId, library, account);
        const _deposit = web3.utils.toWei(String(inputValue), 'ether');

        await contract
          .mintWithBNB(account, {
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
      } else if (inputCurrency?.symbol === 'BUSD') {
        await getAlowance();

        const poolAddress = `${poolInfo.pool_address}`;
        const contract = getAMOv2Contract(poolAddress, chainId, library, account);
        const _deposit = web3.utils.toWei(String(inputValue), 'ether');
        await contract
          .mintWithBUSD(_deposit, {
            from: account,
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

      setInputValue('');
      setErrorMessage(null);
    } catch (error) {
      console.debug(_t('buyFailed'), error);
      /* setErrorMessage(error.message); */
      Swal.fire({
        icon: 'error',
        title: _t('transactionFail'),
        text: _t('tryLater'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, inputValue, inputCurrency]);

  /* const handleChange = (type: 'input' | 'output', value: any) => {
    if (type === 'input') {
      setInputValue(value);
    } else {
      setOutputValue(value);
    }
  }; */

  useEffect(() => {
    loadPoolDetail();
  }, []);

  useEffect(() => {
    getAlowance();
  }, [block]);

  useEffect(() => {
    loadEstimatedToken('output', outputValue);
  }, [inputCurrency]);

  /*
  useEffect(() => {
    loadEstimatedToken('output');
  }, [outputValue, setOutputValue]); */

  return (
    <ThemeProvider theme={themeMui}>
      <div className="main container mainContainer" id="content">
        {/*  <PatternedBackgrond></PatternedBackgrond> */}
        <div className="row justify-content-sm-center justify-content-md-center">
          <div className="col-lg-11 m-0">
            {!poolInfo ? (
              <div className="d-flex justify-content-center">
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', padding: '25px 0 25px 0' }}>
                  <img
                    style={{
                      maxWidth: '54px',
                      maxHeight: '54px',
                      borderRadius: '48px',
                      width: '48px',
                      height: '48px',
                    }}
                    src={Ninja_icon}
                    alt=""
                  />
                  <h1 className="subTitle pt-2">NinjaSwap AMO v2</h1>
                  <h1 className="subTitle pt-2">Disabled</h1>
                </div>
                <div>
                  <div className="d-flex flex-column align-items-center py-3">
                    <Stats poolInfo={poolInfo} />
                  </div>
                </div>
                <div className="row justify-content-center">
                  <AppBody>
                    <AutoColumn gap={'md'}>
                      <CurrencyInputPanel
                        label="From"
                        value={inputValue}
                        showMaxButton={true}
                        currency={inputCurrency}
                        onUserInput={(value: any) => {
                          loadEstimatedToken('input', value);
                        }}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputCurrencySelect}
                        otherCurrency={outputCurrency}
                        id="swap-currency-input"
                        allTokens={allTokens}
                      />
                      <AutoColumn justify="space-between">
                        <AutoRow justify="center" style={{ padding: '.7rem' }}>
                          <ArrowWrapper clickable>
                            {/* <ArrowDown
                              style={{ display: 'flex' }}
                              size="16"
                              onClick={() => {
                
                              }}
                              color={theme.text2}
                            /> */}
                          </ArrowWrapper>
                        </AutoRow>
                      </AutoColumn>
                      <CurrencyDisabledInputPanel
                        value={outputValue}
                        onUserInput={(value: any) => {
                          loadEstimatedToken('output', value);
                        }}
                        label="To"
                        currency={outputCurrency}
                        otherCurrency={inputCurrency}
                        id="swap-currency-output"
                      />
                    </AutoColumn>
                    <div className="d-flex py-3">
                      {!account ? (
                        <ButtonLight
                          style={{
                            width: '100%',
                            height: '43px',
                            color: 'white',
                            backgroundColor: '#f0b90b',
                          }}
                          onClick={onBuy}
                        >
                          Connect Wallet
                        </ButtonLight>
                      ) : errorMessage ? (
                        <GreyCard style={{ textAlign: 'center' }}>
                          <TYPE.main mb="4px">{errorMessage}</TYPE.main>
                        </GreyCard>
                      ) : inputCurrency?.symbol === 'BUSD' && Number(allowance) === 0 ? (
                        <ButtonConfirmed
                          style={{
                            width: '100%',
                            height: '43px',
                            color: 'white',
                            backgroundColor: '#f0b90b',
                          }}
                          onClick={approve}
                          disabled={buttonDisabled}
                          width="48%"
                          altDisabledStyle={buttonDisabled} // show solid button while waiting
                          confirmed={false}
                        >
                          {isLoading ? (
                            <AutoRow gap="6px" justify="center">
                              Approving <Loader stroke="white" />
                            </AutoRow>
                          ) : (
                            'Approve'
                          )}
                        </ButtonConfirmed>
                      ) : (
                        <ButtonConfirmed
                          style={{
                            width: '100%',
                            height: '43px',
                            color: 'white',
                            backgroundColor: '#f0b90b',
                          }}
                          onClick={onBuy}
                          disabled={buttonDisabled}
                          width="48%"
                          altDisabledStyle={buttonDisabled} // show solid button while waiting
                          confirmed={false}
                        >
                          {isLoading || hasPendingTransactions ? (
                            <AutoRow gap="6px" justify="center">
                              <Loader stroke="white" />
                            </AutoRow>
                          ) : (
                            'Mint Ninjas'
                          )}
                        </ButtonConfirmed>
                      )}
                    </div>
                  </AppBody>
                </div>
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
