import {  useEffect, useState } from 'react'
import {useActiveWeb3React} from '../hooks'
// import debounce from 'debounce'

const useBlock = () => {
  const [block, setBlock] = useState(0)
  const { account, chainId, library } = useActiveWeb3React()

  useEffect(() => {
    if (!chainId || !library || !account) return
    const interval = setInterval(async () => {
      const latestBlockNumber = await library.getBlockNumber();
      if (block !== latestBlockNumber) {
        console.log("latestBlockNumber---",latestBlockNumber)
        setBlock(latestBlockNumber)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [account])

  return block
}

export default useBlock
