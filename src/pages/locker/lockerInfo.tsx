const lockerInfo = {
  contractAddress: '0x513dA0a749D58398f104B732Ead7A3441506aa36',
  abi: [
    {
      constant: true,
      inputs: [{ name: '_withdrawalAddress', type: 'address' }],
      name: 'getDepositsByWithdrawalAddress',
      outputs: [{ name: '', type: 'uint256[]' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_id', type: 'uint256' }],
      name: 'withdrawTokens',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: '_tokenAddress', type: 'address' },
        { name: '_walletAddress', type: 'address' },
      ],
      name: 'getTokenBalanceByAddress',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: '', type: 'address' },
        { name: '', type: 'uint256' },
      ],
      name: 'depositsByWithdrawalAddress',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getAllDepositIds',
      outputs: [{ name: '', type: 'uint256[]' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_id', type: 'uint256' }],
      name: 'getDepositDetails',
      outputs: [
        { name: '', type: 'address' },
        { name: '', type: 'address' },
        { name: '', type: 'uint256' },
        { name: '', type: 'uint256' },
        { name: '', type: 'bool' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'depositId',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_tokenAddress', type: 'address' },
        { name: '_amount', type: 'uint256' },
        { name: '_unlockTime', type: 'uint256' },
      ],
      name: 'lockTokens',
      outputs: [{ name: '_id', type: 'uint256' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_tokenAddress', type: 'address' }],
      name: 'getTotalTokenBalance',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: '', type: 'address' },
        { name: '', type: 'address' },
      ],
      name: 'walletTokenBalance',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '', type: 'uint256' }],
      name: 'lockedToken',
      outputs: [
        { name: 'tokenAddress', type: 'address' },
        { name: 'withdrawalAddress', type: 'address' },
        { name: 'tokenAmount', type: 'uint256' },
        { name: 'unlockTime', type: 'uint256' },
        { name: 'withdrawn', type: 'bool' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '', type: 'uint256' }],
      name: 'allDepositIds',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'SentToAddress', type: 'address' },
        { indexed: false, name: 'AmountTransferred', type: 'uint256' },
      ],
      name: 'LogWithdrawal',
      type: 'event',
    },
  ],
};

export default lockerInfo;
