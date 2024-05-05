import React, { useState, useEffect } from 'react';
import { useActiveWeb3React } from '../../hooks';
import LogoDark from '../../assets/img/Ninja_Logo_DarkVer.png';

import useBlock from '../../hooks/useBlock';
// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'

export default function XNinjaStaking() {
  const block = useBlock();
  const { account } = useActiveWeb3React();

  useEffect(() => {}, []);

  return (
    <>
      <div className="main container mainContainer" id="content">
        <div
          className="row justify-content-sm-center justify-content-md-center"
          style={{ textAlign: 'center' }}
        >
          <div className="col-lg-8">
            <img className="indexImage" src={LogoDark} />
            <h1 className="subTitle">xNinja Staking Coming Soon</h1>
          </div>
        </div>
      </div>
    </>
  );
}
