import React, { useState, useEffect } from 'react';
import { useActiveWeb3React } from '../../hooks';
import LogoDark from '../../assets/img/Ninja_Logo_DarkVer.png';
import web3 from 'web3';
import useBlock from '../../hooks/useBlock';
import lockerInfo from './lockerInfo';
import { getLocks } from '../../utils/axios';
import Spinner from 'react-bootstrap/Spinner';
import { formatFixedDecimals } from '../../utils/bignumber';
import SmallCountdown from './SmallCountdown';
import { SeoHelmet } from '../../components/SeoHelmet';

// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'

export default function Locker() {
  const block = useBlock();
  const { account } = useActiveWeb3React();
  const [locks, setLocks] = useState<any>([]);

  const loadLocks = async () => {
    const data = await getLocks();
    console.log("Locksdata : " + JSON.stringify(data));
    setLocks(data);
  };


  useEffect(() => {
    loadLocks();
  }, []);

  return (
    <>
    <SeoHelmet title="Ninja Locker" description="Ninja Locker service use to lock liquidity LP and tokens for NinjaSwap and new startup projects" />
      <div className="main container mainContainer" id="content">
        <div
          className="row justify-content-sm-center justify-content-md-center"
          style={{ textAlign: 'center' }}
        >
          <div className="col-lg-8 col-lg-12">
            <img className="indexImage" src={LogoDark} />
            <h1 className="subTitle">Ninja Locker</h1>
            <p>Smart contract : 0x83c5347892087b7b272aaB79075BD922792CeBDe</p>
            <p>Locks can be verify with ids <a target="_blank" href="https://www.bscscan.com/address/0x83c5347892087b7b272aaB79075BD922792CeBDe#readContract">here</a> at smart contract</p>
            <div className="row justify-content-center pt-4">
              <div className="col-md-12">
                <table className="table-responsive-stack" id="">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col" style={{ width: '5%' }}>
                        ID
                      </th>
                      <th scope="col" style={{ width: '15%' }}>
                        Token Name
                      </th>
                      <th scope="col" style={{ width: '10%' }}>
                        Amount
                      </th>
                      <th scope="col" style={{ width: '40%' }}>
                        Receiver Address
                      </th>
                      <th scope="col" style={{ width: '10%' }}>
                        Claim
                      </th>
                      <th scope="col" style={{ width: '20%' }}>
                        Lock Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!locks.length ? (
                      <div className="d-flex justify-content-center">
                        <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                      </div>
                    ) : (
          
                            locks.map((item: any, index: number) => {
                              return (
                                <tr  key={index.toString()} >
                                <td>{item.id}</td>
                                <td>{item.TokenName}</td>
                                <td>{formatFixedDecimals(web3.utils.fromWei(String(item.amount), 'ether') , 2)}</td>
                                <td>{item.receiverAddress}</td>
                                <td>{item.claim ? 'Yes' : 'No'}</td>
                                <td>
                                <SmallCountdown
                                  futureDate={item.LockTime}
                                />
                                </td>
                                
                              </tr>
                              );
                            })
                    
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}
