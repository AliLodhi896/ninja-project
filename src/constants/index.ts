import { ChainId, JSBI, Percent, Token, WETH } from '@bscswap/sdk';
import { AbstractConnector } from '@web3-react/abstract-connector';

import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors';

// export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
//goeril
// export const ROUTER_ADDRESS= '0x2F1345215010a5E02659726d23a56EE5d4692743';
// export const BallsToken = "0xa827a8d0A9F60F0A09f5C7425395FD58EDfd13D5";
// export const BallsBar = '0x46F855054eD71Aa4DF5ac75FAffBE0b50ef485bC'
// export const BallsReward = '0xDEeD81E0D905d5f61F7Dba828C48E364018A4899'
//main test
// export const ROUTER_ADDRESS= '0x889e88F6C186e90d8a4Cd9Ac4E79a26c5FF3B4F5';
// export const BallsToken = "0x609B942A62e72AA6147B053BbF0728E9f256B542";
// export const BallsBar = '0x2eff359C92804a898A9a59E64cb7714DDE5349F2'
// export const BallsReward = '0xA2f6a4d66db6B54B77c784963439E0B17AFE14AA'

export const ROUTER_ADDRESS = '0x008Ea4e222B932D29171fD0E79c7430Bca37454e';
export const ninjaToken = '0x93e7567f277F353d241973d6f85b5feA1dD84C10';
export const ninjaAMO = '0xdeDD7a0f96a8d89B5336c66fCdFB29aa885F6aC3';
export const masterChef = '0x7E6B4d7C5f3276A4A18F74a4AaFbCC2cF755Bf97';
export const xmasterChef = '0x4Dbb8A19FacB2877059078f24ddAad74a203D4C5';
export const ninjaStarter = '0x6f90Ec4E3ba08b94Bd6cB62BF9cDf63A21E6eB41';
export const BUSD = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'; // for testnet '0x385534e52e03325324164376a6f51f36300502Ba';
export const BountyAirdrop = '0xDE60846d8ded456846f65b80d8DF0561113247bE';
export const zwapBar = '0xe40c103166953a357c9aba2edb0ac1a4397d799b';
export const BallsToken = '0x616535f24Bc2A06edbe8928BaDD551431b585BC6';
export const BallsBar = '0x3B5Da16dab4dCdD4ee3B329952aa91eD0C5036D1';
export const BallsReward = '0xe99B26e4312CA087E281E9B192A81DA7AeDE298f';
// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export const DAI = new Token(
  ChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin',
);
export const USDC = new Token(
  ChainId.MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C',
);
export const USDT = new Token(
  ChainId.MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD',
);
export const COMP = new Token(
  ChainId.MAINNET,
  '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  18,
  'COMP',
  'Compound',
);
export const MKR = new Token(
  ChainId.MAINNET,
  '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  18,
  'MKR',
  'Maker',
);
export const AMPL = new Token(
  ChainId.MAINNET,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth',
);
const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.BSC_MAINNET]: [WETH[ChainId.BSC_MAINNET]],
  [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]],
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR],
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
  },
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT],
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(
        ChainId.MAINNET,
        '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
        8,
        'cDAI',
        'Compound Dai',
      ),
      new Token(
        ChainId.MAINNET,
        '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
        8,
        'cUSDC',
        'Compound USD Coin',
      ),
    ],
    [USDC, USDT],
    [DAI, USDT],
  ],
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5',
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true,
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true,
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true,
  },
};

export const NetworkContextName = 'NETWORK';

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(1000 * 5), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(1000 * 6), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(1000 * 8), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE,
); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1000 * 8),
  BIPS_BASE,
); // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 BNB
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000));
export const Base_url = 'https://ninjaswap.app';
export const TWITTER_ACCOUNT_URL = 'https://twitter.com/ninjaswapapp';
// export const Base_url = "http://localhost:3000";
export const SOCKET_URL = 'https://data.ninjaswap.app';
export const BACKEND_URL = 'https://data.ninjaswap.app';
