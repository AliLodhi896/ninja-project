import React, { useCallback, useState, useEffect } from 'react';
import { getNinjaAMOContract } from '../../utils';
import useBlock from '../../hooks/useBlock';
import { useActiveWeb3React } from '../../hooks';
import BigNumber from 'bignumber.js';
import useAdvenceTranslation from '../../hooks/useAdvenceTranslation';
const bn: any = new BigNumber('1e18');
interface RefStatsProps {}

const RefStats: React.FC<RefStatsProps> = () => {
  const { t, _t } = useAdvenceTranslation({ prefix: 'amoPage:refStats' });
  const { account, chainId, library } = useActiveWeb3React();
  const block = useBlock();
  const [userRefStats, setRefStats] = useState({
    totalRefferals: '0',
    totalEarned: '0.00',
  });
  const fetchuserRefStats = useCallback(async () => {
    if (!chainId || !library || !account) return;
    const contract = getNinjaAMOContract(chainId, library, account);
    const bonus = await contract.bonus(account);
    setRefStats({
      totalEarned: `${(bonus[1] / bn).toString().substring(0, 8)}`,
      totalRefferals: `${bonus[0].toString().substring(0, 8)}`,
    });
  }, [account, block]);
  useEffect(() => {
    fetchuserRefStats();
  }, [account, block]);
  return (
    <>
      <div className="row referralInfoRow justify-content-sm-center">
        <div className="col-sm">
          <div className="title">{_t('numOfReferrals')}</div>
          <div className="sub">
            <span id="numberOfReferrals">{userRefStats.totalRefferals}</span>
          </div>
        </div>
        <div className="col-sm">
          <div className="title">{_t('ninjaEarned')}</div>
          <div className="sub">
            <span id="referralEarned">{userRefStats.totalEarned}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RefStats;
