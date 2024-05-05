/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo_dark from '../../assets/img/Ninja_Logo_DarkVer.png';
import LogoDarkMini from '../../assets/images/Ninja_icon.png';
import Web3Status from '../Web3Status';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { useActiveWeb3React } from '../../hooks';
import { useETHBalances } from '../../state/wallet/hooks';
import { Text } from 'rebass';
import { darken } from 'polished';
import Spinner from 'react-bootstrap/Spinner';

import { useApyActionHandlers } from '../../state/apy/hooks';
import { useNinjaStatsActionHandlers, useNinaStatsState } from '../../state/stats/hooks';
import CurrencyFormat from '../CurrencyFormat';
import { MobileSubMenu, MobileSubMenuItem } from './components/SubMenu';
import { TWITTER_ACCOUNT_URL } from '../../constants';

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;
const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg3 : theme.GrBg)};
  border-radius: 12px;
  white-space: nowrap;

  :focus {
    border: 1px solid blue;
  }
`;

const StyledLink = styled.a`
  ${({ theme }) => theme.flexRowNoWrap}
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.active {
    font-weight: 500;
    color: ${({ theme }) => 'rgb(240, 185, 11) !important'};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

const PointBadge = styled.div`
  width: fit-content;
  /* background-color: ${({ theme }) => 'rgb(240, 185, 11) !important'}; */
  color: ${({ theme }) => theme.text6};
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 10px;
  
  
  padding: 5px 8px 5px 8px;
  font: 600 16px 'Inter var', sans-serif;

  background-color: ${({ theme }) => 'rgb(240, 185, 11) !important'};
  border: 1px solid ${({ theme }) => theme.white};
`;

type NewHeaderProps = {
  visible?: boolean;
};

export default function NewHeader(props: NewHeaderProps) {
  const [menu, toggleM] = useState(false);
  const { account } = useActiveWeb3React();

  const ninjaStats = useNinaStatsState();
  const location = useLocation();

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  function toggleMenu() {
    toggleM(!menu);
    var body = document.getElementsByTagName('body');
    var closeSidebar = document.getElementsByClassName('vertical-nav');
    closeSidebar[0].classList.toggle('active');
    body[0].classList.toggle('sidebar-open');
  }

  function setMenu(rule = false) {
    toggleM(rule);
    var body = document.getElementsByTagName('body');
    var closeSidebar = document.getElementsByClassName('vertical-nav');
    closeSidebar[0].classList.toggle('active');
    body[0].classList.toggle('sidebar-open');
  }

  function toggleSubMenu() {}

  return (
    <>
      <div className="vertical-nav" id="sidebar">
        <div className="py-3 px-3 mb-2 imgWrapper">
          <div className="media d-flex align-items-center" style={{ justifyContent: 'center' }}>
            <div className="mobile-nav-times" onClick={() => setMenu(false)}>
              <i className="fa fa-times mr-2" aria-hidden="true" />
            </div>
            <a href="/">
              <img
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '240px',
                  marginTop: '30px',
                }}
                src={logo_dark}
                alt="..."
              />
            </a>
          </div>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item" onClick={toggleMenu}>
            <NavLink activeClassName="active" exact to="/swap" className="nav-link">
              Dex
            </NavLink>
          </li>
      
          <li className="nav-item" onClick={toggleMenu}>
            <NavLink activeClassName="active" exact to="/amo-v3" className="nav-link">
              AMO v3
            </NavLink>
          </li>
          <li className="nav-item" onClick={toggleMenu}>
            <NavLink activeClassName="active" exact to="/farms" className="nav-link">
              Farms
            </NavLink>
          </li>
          <li className="nav-item" onClick={toggleMenu}>
            <NavLink activeClassName="active" exact to="/staking" className="nav-link">
            Ninja Staking
            </NavLink>
          </li>
          <MobileSubMenu
            title="Pools"
            defaultOpen={['/pools', '/ido-pools'].includes(location.pathname)}
          >
            <MobileSubMenuItem onClick={toggleMenu}>
              <NavLink activeClassName="active" exact to="/ido-pools" className="nav-main-link">
              IDO Pools
              </NavLink>
            </MobileSubMenuItem>
            <MobileSubMenuItem onClick={toggleMenu}>
              <NavLink
                activeClassName="active"
                exact
                to="/pools"
                className="nav-main-link"
              >
                xNinja Pools
              </NavLink>
            </MobileSubMenuItem>
          </MobileSubMenu>
          <li className="nav-item" onClick={toggleMenu}>
            <NavLink activeClassName="active" exact to="/bounties" className="nav-link">
              Bounty
            </NavLink>
          </li>
          <li className="nav-item" onClick={toggleMenu}>
            <NavLink activeClassName="active" exact to="/cake-airdrop" className="nav-link">
              Cake Airdrop
            </NavLink>
          </li>
          <li className="nav-item" onClick={toggleMenu}>
            <NavLink activeClassName="active" exact to="/ninja-starter" className="nav-link">
              Ninja EIDO
            </NavLink>
          </li>
          <li className="nav-item" onClick={toggleMenu}>
            <NavLink activeClassName="active" exact to="/locker" className="nav-link">
              Ninja Locker
            </NavLink>
          </li>
          <li className="nav-item" onClick={toggleMenu}>
            <a className="nav-link" href="https://info.ninjaswap.app/">
              Analytics
            </a>
          </li>
          <MobileSubMenu
            title="Disabled"
            defaultOpen={['/amo-v2', '/amo'].includes(location.pathname)}
          >
            <MobileSubMenuItem onClick={toggleMenu}>
              <NavLink activeClassName="active" exact to="/amo-v2" className="nav-main-link">
              AMO v2 
              </NavLink>
            </MobileSubMenuItem>
            <MobileSubMenuItem onClick={toggleMenu}>
              <NavLink
                activeClassName="active"
                exact
                to="/amo"
                className="nav-main-link"
              >
                AMO v1 
              </NavLink>
            </MobileSubMenuItem>
          </MobileSubMenu>
          <MobileSubMenu title="One Pager">
            <MobileSubMenuItem onClick={toggleMenu}>
              <a className="nav-link nav-main-link" target="_blank" href="/files/Ninjaswap.pdf">
                English
              </a>
            </MobileSubMenuItem>
            <MobileSubMenuItem onClick={toggleMenu}>
              <a className="nav-link nav-main-link" target="_blank" href="/files/Ninjaswap_CN.pdf">
                简体中文
              </a>
            </MobileSubMenuItem>
            <MobileSubMenuItem onClick={toggleMenu}>
              <a className="nav-link nav-main-link" target="_blank" href="/files/Ninjaswap_ITA.pdf">
                Italiano
              </a>
            </MobileSubMenuItem>
            <MobileSubMenuItem onClick={toggleMenu}>
              <a className="nav-link nav-main-link" target="_blank" href="/files/Ninjaswap_TR.pdf">
                Türkçe
              </a>
            </MobileSubMenuItem>
          </MobileSubMenu>
          <MobileSubMenu title="More">
            <MobileSubMenuItem onClick={toggleMenu}>
              <a
                className="nav-link nav-main-link"
                target="_blank"
                href="https://docs.ninjaswap.app"
              >
                API
              </a>
            </MobileSubMenuItem>
            <MobileSubMenuItem onClick={toggleMenu}>
              <a
                className="nav-link nav-main-link"
                target="_blank"
                href="https://github.com/ninjaswapapp"
              >
                GitHub
              </a>
            </MobileSubMenuItem>
          </MobileSubMenu>
        </ul>
        <ul className="nav flex-column">
          <li className="nav-item" onClick={toggleMenu}>
            <a target="_blank" rel="noreferrer" href={TWITTER_ACCOUNT_URL} className="nav-link">
              <i className="fa fa-twitter" aria-hidden="true"></i>
              Twitter
            </a>
          </li>
          <li className="nav-item" onClick={toggleMenu}>
            <a href="mailto:contact@ninjaswap.app" className="nav-link">
              <i className="fa fa-envelope" aria-hidden="true"></i>
              contact@ninjaswap.app
            </a>
          </li>
        </ul>
      </div>
      <nav
        className="navbar navbar-expand"
        style={{
          zIndex: 3000,
          transform: props.visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -64px, 0)',
        }}
      >
        <div style={{ lineHeight: '30px', marginLeft: 10 }}>
          <NavLink to="/">
            <img className="headerLogo" src={logo_dark} alt="Ninjaswap logo" />
          </NavLink>
        </div>
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            left: '190px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PointBadge>
            {ninjaStats?.price ? (
              <>
                <img
                  style={{ height: '23px', paddingRight: '3px' }}
                  src={LogoDarkMini}
                  alt="ninja icon"
                  onClick={() => {
                    window.open(
                      'https://www.bscscan.com/address/0x93e7567f277F353d241973d6f85b5feA1dD84C10',
                      '_blank',
                    );
                  }}
                />
                $
                <CurrencyFormat value={ninjaStats.price} last={3} />
              </>
            ) : (
              <Spinner size="sm" as="span" animation="border" role="status" aria-hidden="true" />
            )}
          </PointBadge>
          <PointBadge style={{ marginLeft: '10px' }}>
            {ninjaStats?.AMO_Price ? (
              <>AMO: {ninjaStats.AMO_Price}</>
            ) : (
              <Spinner size="sm" as="span" animation="border" role="status" aria-hidden="true" />
            )}
          </PointBadge>
        </div>
        <div className="container">
          <div></div>
          <div id="navbarSupportedContent">
            <ul className="navbar-nav">
              {!isMobile && (
                <AccountElement
                  active={!!account}
                  style={{ pointerEvents: 'auto', marginRight: '10px' }}
                >
                  {account && userEthBalance ? (
                    <BalanceText
                      style={{ flexShrink: 0 }}
                      pl="0.75rem"
                      pr="0.5rem"
                      fontWeight={500}
                    >
                      {userEthBalance?.toSignificant(4)} BNB
                    </BalanceText>
                  ) : null}
                </AccountElement>
              )}
              <div style={{ width: '140px' }}>
                <Web3Status />
              </div>
            </ul>
          </div>
        </div>
      </nav>
      <nav className={`mobile-nav ${menu || !props.visible ? 'open' : ''}`}>
        <div className="mobile-nav-hamburger" onClick={() => setMenu(true)}>
          <i className="fa fa-bars mr-2" aria-hidden="true" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <PointBadge>
            {ninjaStats?.price ? (
              <>
                <img style={{ height: '23px', paddingRight: '3px' }} src={LogoDarkMini} />$
                <CurrencyFormat value={ninjaStats.price} last={3} />
              </>
            ) : (
              <Spinner size="sm" as="span" animation="border" role="status" aria-hidden="true" />
            )}
          </PointBadge>
          <PointBadge style={{ marginLeft: '10px' }}>
            {ninjaStats?.AMO_Price ? (
              <>AMO: {ninjaStats.AMO_Price}</>
            ) : (
              <Spinner size="sm" as="span" animation="border" role="status" aria-hidden="true" />
            )}
          </PointBadge>
        </div>
        {/* <div id="sidebarCollapse" onClick={toggleMenu}>
          {!menu ? (
            <i className="fa fa-bars mr-2" aria-hidden="true" />
          ) : (
            <i className="fa fa-times mr-2" aria-hidden="true" />
          )}
        </div> */}
      </nav>
    </>
  );
}
