import React, { useCallback, useState, useEffect } from 'react'
import bnbIcon from '../../assets/img/bnb_coin.png'
import Ninja_icon from '../../assets/images/Ninja_icon.png'
import { getNinjaAMOContract } from '../../utils'
import useBlock from '../../hooks/useBlock'
import { useActiveWeb3React } from '../../hooks'
import BigNumber from 'bignumber.js'
const bn: any = new BigNumber('1e18')
interface StatsProps {
}

const States: React.FC<StatsProps> = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const block = useBlock()
  const [userStats, setUserStats] = useState({
    deposited: '...',
    totalNinjaSold: '...',
    bought : '...'
  })
  const fetchuserStats = useCallback(async () => {
    if (!chainId || !library || !account) return
    const contract = getNinjaAMOContract(chainId, library, account)
    const deposited = await contract.deposits(account)
    const bought = await contract.purchases(account)
    const totalNinja = await contract.totalNinjaSold();
    setUserStats({
      totalNinjaSold : `${(totalNinja / bn).toString().substring(0, 8)}`,
      deposited: `${(deposited / bn).toString().substring(0, 8)}`,
      bought: `${(bought / bn).toString().substring(0, 8)}`
    })
  }, [account, block])
  useEffect(() => {
    fetchuserStats()
  }, [account, block])
  return (
    <>
         <div className="row dashboard presale justify-content-sm-center" style={{ marginTop: '30px' }}>
         <div className="col-lg-4">
            <div className="box6 light">
              <span className="title">
                <img className="boxesIcon" src={Ninja_icon} />
                Your Minted Ninja
              </span>
              <span className="sub" id="yourEthDeposited">
              {userStats.bought}
              </span>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="box6 light">
              <span className="title">
                <img className="boxesIcon" src={bnbIcon} />
                Your BNB Deposited
              </span>
              <span className="sub" id="yourEthDeposited">
              {userStats.deposited}
              </span>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="box6 light">
              <span className="title">
                <img className="boxesIcon" src={Ninja_icon} />
               Total Ninja Sold
              </span>
              <span className="sub" id="yourClaimablezwap">
              {userStats.totalNinjaSold}
              
              </span>
            </div>
          </div>
        </div>
    
    </>
  )
}

export default States
