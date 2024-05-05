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
import { getAMOV3Contract, getBUSDContract } from '../../utils';
import Ninja_icon from '../../assets/images/Ninja_icon.png';
import Stats from './components/Stats';
import SmallCountdown from './SmallCountdown';
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

export default function AMOV3() {

  const block = useBlock();
  const { _t } = useAdvenceTranslation({ prefix: 'amoPage' });
  const { account, chainId, library } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const addTransaction = useTransactionAdder();
  const theme = useContext(ThemeContext);
  const [poolDetail, setPoolDetail] = useState<any>(false);
 // const poolInfo = poolDetail?.poolInfo;
 const poolInfo = { name : "NinjaSwap " , symbol : "NINJA", logo : Ninja_icon,  decimals : 18 , pool_address : "0xB3C652D7e69763C7bC5190c9b360bA5F2e57d3A6", estimated_1bnb_tokens: 51656.88 };
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
  const [showTable, setShowTable] = useState(false);
  const [myVestings, setMyVestings] = useState<any>(false);
  const [claimbtn, setClaimBtn] = useState<any>(false);
  const [myTokens, setMyTokens] = useState<any>(false);
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
        const contract = getAMOV3Contract(
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
          const contract = getAMOV3Contract(
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
    await getMyvestings();
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
        const contract = getAMOV3Contract(poolAddress, chainId, library, account);
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
        const contract = getAMOV3Contract(poolAddress, chainId, library, account);
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
  const getMyvestings = async () => {
    if (account) {
      if (!chainId || !library || !poolInfo || !account) return;
      const poolAddress = `${poolInfo.pool_address}`;
      const contract = getAMOV3Contract(poolAddress, chainId, library, account);
      const myvestings = await contract.myVestings(account);
      const getTokens = await contract.myTokens();
      setMyTokens(getTokens);
      setMyVestings(myvestings);
      if ((Number(getTokens[0]) / 10 ** 18) > 0) {
        setShowTable(true);
     } else {
      setShowTable(false);
     }
      if ((Number(getTokens[2]) / 10 ** 18) > 0) {
         setClaimBtn(true);
      } else {
         setClaimBtn(false);
      }
    }
  };
  const ClaimClick = async () => {
    if (!chainId || !library || !poolInfo || !account) return;
    const poolAddress = `${poolInfo.pool_address}`;
    const contract = getAMOV3Contract(poolAddress, chainId, library, account);
    await contract.releaseAll().then((response: any) => {
      addTransaction(response, {
        summary: 'Released Tokens',
      });
      Notification.notification({
        type: 'success',
        message: 'Transaction Successful',
      });
    });

  };
  useEffect(() => {
    loadPoolDetail();
  }, []);
  useEffect(() => {
    loadPoolDetail();
  }, [account]);

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
                  <h1 className="subTitle pt-2">NinjaSwap AMO v3</h1>
                  <p>Mint more Ninja Tokens and grow ninjas community</p>
                  <p>50% ninja minted tokens immediately transfer and 50% vesting for 1 week</p>
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
                {showTable ? ( 
                  <div>
                       <table className="table-responsive-stack" id="">
                       <thead className="thead-dark">
                         <tr>
                           <th scope="col" style={{ width: '15%' }}>
                             ID
                           </th>
                           <th scope="col" style={{ width: '25%' }}>
                             Amount
                           </th>
                           <th scope="col" style={{ width: '35%' }}>
                             Lock Time
                           </th>
                           <th scope="col" style={{ width: '25%' }}>
                             Claim
                           </th>
                         </tr>
                       </thead>
                       <tbody></tbody>
                       {!myVestings.length ? (
                         <div className="d-flex justify-content-center">
                           <Spinner
                             as="span"
                             animation="border"
                             role="status"
                             aria-hidden="true"
                           />
                         </div>
                       ) : (
                         myVestings.map((item: any, index: number) => {
                           return (
                             <tr key={index.toString()}>
                               <td>{item[0].toString()}</td>
                               <td>{(Number(item[2]) / 10 ** 18).toFixed(8)}</td>
                               <td>
                                 <SmallCountdown futureDate={item[1].toString()} status={item[3].toString() == 'false' ? 'Unclaimed' : 'Claimed'} />
                               </td>
                               <td>{item[3].toString()}</td>
                             </tr>
                           );
                         })
                       )}
                     </table>
                     <p style={{ fontSize: '19px', marginBottom: '0px', textAlign: 'center', letterSpacing: 'normal' }}>Total : {myTokens ? (Number(myTokens[0]) / 10 ** 18).toFixed(8) : ' 0 '} | Claimed : {myTokens ? (Number(myTokens[1]) / 10 ** 18).toFixed(8) : '0'}</p>
                     <p style={{ fontSize: '19px', marginBottom: '0px', textAlign: 'center', letterSpacing: 'normal' }}>Available for claim : {myTokens ? (Number(myTokens[2]) / 10 ** 18).toFixed(8) : '0'} | Unclaimed : {myTokens ? (Number(myTokens[3]) / 10 ** 18).toFixed(8) : '0'}
                     </p>
                     {claimbtn ? (
                       <p style={{ fontSize: '19px', marginBottom: '0px', textAlign: 'center', letterSpacing: 'normal' }}>
                         <Button
                           onClick={() => ClaimClick()}
                           className="ninja-button"
                         >
                           Claim Tokens
                         </Button></p>
                     ) : ''}
                </div>) : '' }
                
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
