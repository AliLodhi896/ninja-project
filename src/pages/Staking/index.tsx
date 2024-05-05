import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useActiveWeb3React } from '../../hooks';
import NinjaIcon from '../../assets/images/Ninja_icon.png';
import NinjaMac from '../../assets/images/ninja-mac.png';
import KatanaIcon from '../../assets/img/Katana.png';
import styled, { ThemeContext } from 'styled-components';
import { darken } from 'polished';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faTelegram as fabTelegram,
  faTwitter as fabTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faCalculator, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { SeoHelmet } from '../../components/SeoHelmet';
import CurrencyFormat from '../../components/CurrencyFormat';
import StakingActions from './components/StakingActions';
import { useApyState } from '../../state/apy/hooks';
import useBlock from '../../hooks/useBlock';
import _ from 'lodash';
import { ApyRaw } from '../../state/apy/actions';

const StyledLink = styled.a`
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme }) => theme.text1};

  &.active {
    font-weight: 500;
    color: ${({ theme }) => 'rgb(240, 185, 11) !important'};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

const LIST = [
  {
    APY: '...',
    Earn: 'NINJA',
    Deposit: 'NINJA',
    lpAddress: '0x93e7567f277F353d241973d6f85b5feA1dD84C10',
    Pid: '6',
    logo1: NinjaIcon,
    ratio: '5x',
  },
];

export default function Airdrop() {
  const block = useBlock();
  const { account } = useActiveWeb3React();
  const { list: apyList } = useApyState();
  const themeStyle = useContext(ThemeContext);
  const [apyListState, setApyListState] = useState<any[]>([]);

  const setListData = useCallback(async () => {
    const converter = (p: ApyRaw): any => ({
      ...p,
      APY: p?.yearlyAPY?.toFixed(2),
      Pid: p?.Pid,
    });
    const predicate = (apy: ApyRaw) => LIST.map((v) => v.Pid)?.includes(apy.Pid);
    setApyListState(_.merge(LIST, apyList.filter(predicate).map(converter)));
  }, [apyList]);

  useEffect(() => {
    setListData();
  }, [block, account, apyList, setListData]);

  const renderBox = (item: any, index: number) => {
    return (
      <div className="col-lg-4 col-md-4 col-sm-12" key={index}>
        <div className="card centered farm-card">
          <img src={KatanaIcon} className="farm-card-bg" />
          <div className="header-wrapper-content">
            <div className="farm-head">
              <div className="lp-icon-wrapper" style={{ paddingLeft: '14px' }}>
                <img src={item.logo1} />
              </div>

              <div className="farm-head-right">
                <div className="farm-title">Stake Ninja</div>
                <div className="xtimes-badge">{item.ratio}</div>
              </div>
            </div>
          </div>
          <div className="grid-item-content" id="DIV_1">
            <div className="token-info-wrapper" id="DIV_2">
              <div className="token-info" id="DIV_3">
                <div className="token-name" id="DIV_4">
                  {item?.tradeUrl ? (
                    <StyledLink href={item?.tradeUrl}>
                      {item.Deposit}
                      <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faExternalLinkAlt} />
                    </StyledLink>
                  ) : (
                    item.Deposit
                  )}
                </div>
                <div className="token-desc" id="DIV_5">
                  Deposit
                </div>
              </div>
              <div className="token-info" id="DIV_6">
                <div className="token-name" id="DIV_7">
                  {item.Earn}
                </div>
                <div className="token-desc" id="DIV_8">
                  Earn
                </div>
              </div>
            </div>
            <div
              style={{
                /* display: 'flex', */
                display: 'none',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  font: '17px Poppins, sans-serif',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: '#66696c',
                }}
              >
                APY
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  font: '17px Poppins, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => {}}
              >
                {item.APY === '...' ? (
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    size="sm"
                  />
                ) : (
                  <>
                    <span style={{ zIndex: 2 }}>
                      <FontAwesomeIcon icon={faCalculator} size="sm" />
                    </span>
                    <span style={{ paddingLeft: '7px' }}>
                      <CurrencyFormat value={item.APY} />%
                    </span>
                  </>
                )}
              </div>
            </div>

            <StakingActions farm={item.lpAddress} pid={item.Pid} deposit={item.Deposit} />
          </div>
          <div className="farm-footer-nocolor" style={{ display: 'none' }}>
            Total locked value: <br />$
            <CurrencyFormat value={item?.total_locked_value} />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    /* if (!account) {
      return (
        <>
          <div className="d-flex justify-content-center align-items-center p-3">
            <h3 style={{ color: 'orange', textAlign: 'center' }}>
              Please connect your wallet to continue
            </h3>
          </div>
        </>
      );
    } */
    return (
      <div
        className="row dashboard overview justify-content-sm-center"
        style={{ marginTop: '30px' }}
      >
        {LIST.map(renderBox)}
      </div>
    );
  };

  return (
    <>
      <SeoHelmet title="Ninja Staking" />
      <div className="main container" id="">
        <div
          className="row justify-content-sm-center justify-content-md-center"
          style={{ textAlign: 'center' }}
        >
          <div className="col-lg-10">
            <img className="indexImage" src={NinjaMac} alt="Ninja Staking" />
            <h1 className="subTitle"> Ninja Staking</h1>
          </div>
        </div>
        {renderContent()}
      </div>
    </>
  );
}
