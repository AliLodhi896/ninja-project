// @ts-ignore
import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import routerABI from '../constants/abis/routerABI.json';
import {
  ROUTER_ADDRESS,
  BallsToken,
  BallsBar,
  BallsReward,
  ninjaToken,
  ninjaAMO,
  masterChef,
  xmasterChef,
  ninjaStarter,
  BUSD,
  BountyAirdrop,
} from '../constants';
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@bscswap/sdk';
import { TokenAddressMap } from '../state/lists/hooks';
import ERC20ABI from '../constants/abis/erc20.json';
import BountyAirdropABI from '../constants/abis/BountyAirdropABI.json';
import BALLSBARABI from '../constants/abis/ballsBar.json';
import BallsRewardABI from '../constants/abis/ballsRwardABI.json';
import curveTokenABI from '../constants/abis/ninjaToken.json';
import ninjaAMOABI from '../constants/abis/ninjaAMO.json';
import masterChefABI from '../constants/abis/masterChef.json';
import xmasterChefABI from '../constants/abis/xmasterChef.json';
import ninjaPairABI from '../constants/abis/NinjaPair.json';
import sweeperABI from '../constants/abis/sweeper.json';
import ninjastarterABI from '../constants/abis/ninjastarter.json';
import amoV2ABI from '../constants/abis/AMOv2.json';
import amoV3ABI from '../constants/abis/AMOv3.json';
// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: 'etherscan.io',
  3: 'ropsten.etherscan.io',
  4: 'rinkeby.etherscan.io',
  5: 'goerli.etherscan.io',
  42: 'kovan.etherscan.io',
  56: 'bscscan.com',
  97: 'testnet.bscscan.com',
};
export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'block' | 'address',
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}`;

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'block': {
      return `${prefix}/block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ];
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string,
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

export function getFarm(
  address: string,
  _: number,
  library: Web3Provider,
  account?: string,
): Contract {
  return getContract(address, ninjaPairABI, library, account);
}
export function getSweeper(
  address: string,
  _: number,
  library: Web3Provider,
  account?: string,
): Contract {
  return getContract(address, sweeperABI, library, account);
}
// account is optional
export function getMasterChef(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(masterChef, masterChefABI, library, account);
}

export function getXMasterChef(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(xmasterChef, xmasterChefABI, library, account);
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS, routerABI, library, account);
}
// account is optional
export function getBallsRewardContract(
  _: number,
  library: Web3Provider,
  account?: string,
): Contract {
  return getContract(BallsReward, BallsRewardABI, library, account);
}
export function getcurveToken(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ninjaToken, curveTokenABI, library, account);
}
export function getNinjaAMOContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ninjaAMO, ninjaAMOABI, library, account);
}
export function getNinjaStarterContract(
  pool_address: string,
  _: number,
  library: Web3Provider,
  account?: string,
): Contract {
  return getContract(pool_address, ninjastarterABI, library, account);
}

export function getAMOv2Contract(
  pool_address: string,
  _: number,
  library: Web3Provider,
  account?: string,
): Contract {
  return getContract(pool_address, amoV2ABI, library, account);
}
export function getAMOV3Contract(
  pool_address: string,
  _: number,
  library: Web3Provider,
  account?: string,
): Contract {
  return getContract(pool_address, amoV3ABI, library, account);
}

//BallsToken
export function getBallsTokenContract(
  _: number,
  library: Web3Provider,
  account?: string,
): Contract {
  return getContract(BallsToken, ERC20ABI, library, account);
}
export function getBUSDContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(BUSD, ERC20ABI, library, account);
}
export function getBountyContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(BountyAirdrop, BountyAirdropABI, library, account);
}
export function getBallsBarContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(BallsBar, BALLSBARABI, library, account);
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true;
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address]);
}

export function amountFormatter(
  amount: any,
  baseDecimals = 18,
  displayDecimals = 8,
  useLessThan = true,
) {
  if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
    throw Error(
      `Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`,
    );
  }
  amount = ethers.BigNumber.from(amount);

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined;
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return '0';
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(baseDecimals));

    const minimumDisplayAmount = baseAmount.div(
      ethers.BigNumber.from(10).pow(ethers.BigNumber.from(displayDecimals)),
    );

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`;
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals);

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount;
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split('.');
        const roundedDecimalComponent = ethers.BigNumber.from(
          decimalComponent.padEnd(baseDecimals, '0'),
        )
          .toString()
          .padStart(baseDecimals, '0')
          .substring(0, displayDecimals);

        // decimals are too small to show
        if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
          return wholeComponent;
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent.toString().replace(/0*$/, '')}`;
        }
      }
    }
  }
}
