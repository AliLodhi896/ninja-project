/* tslint:disable */
// import { ChainId } from '@bscswap/sdk'
import React, { ReactElement, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Settings from '../Settings';
import Menu2 from '../Menu2';
import { RowBetween } from '../Row';
import Web3Status from '../Web3Status';
import LogoLight from '../../assets/img/Zwap_Logo_WhiteVer.png';
import LogoDark from '../../assets/img/Ninja_Logo_DarkVer.png';
import LogoDarkMini from '../../assets/images/Ninja_icon.png';
import { Text } from 'rebass';
import { useDarkModeManager } from '../../state/user/hooks';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faStore , faLock} from '@fortawesome/free-solid-svg-icons';

import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SubMenu,
} from 'react-pro-sidebar';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { darken } from 'polished';
import { useSidebar } from '../../hooks/useSidebar';

// import VersionSwitch from './VersionSwitch'

const removePopperFeatureForMenu = () => {
  const popperElements = document.getElementsByClassName('popper-element');
  for (let index = 0; index < popperElements.length; index++) {
    const element = popperElements[index];
    element.classList.remove('popper-element');
    console.log('element', element);
  }
};

const activeClassName = 'active';

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    font-weight: 500;
    color: ${({ theme }) => 'rgb(240, 185, 11) !important'};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

const StyledLink = styled.a`
  ${({ theme }) => theme.flexRowNoWrap}
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    font-weight: 500;
    color: ${({ theme }) => 'rgb(240, 185, 11) !important'};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

type LeftSidebarProps = {
  visible?: boolean;
};

export default function LeftSidebar(props: LeftSidebarProps) {
  // const { account } = useActiveWeb3React()
  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager();
  const { t } = useTranslation();
  const location = useLocation();

  const { collapsed, setCollapsed } = useSidebar();
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    // removePopperFeatureForMenu();
  }, []);

  const handleToggleSidebar = (value: any) => {
    // removePopperFeatureForMenu();
    setToggled(value);
  };

  const collapse = (isCollepsed = true) => {
    // removePopperFeatureForMenu();
    const pageContainer = document.getElementById('page-container');
    if (isCollepsed) {
      if (pageContainer?.classList.contains('sidebar-o'))
        pageContainer?.classList.remove('sidebar-o');
    } else {
      if (!pageContainer?.classList.contains('sidebar-o'))
        pageContainer?.classList.add('sidebar-o');
    }
    setCollapsed(isCollepsed);
  };

  const renderFooter = () => {
    return null;
    return (
      <SidebarFooter>
        <Menu>
          <MenuItem className="unhighlited" active={false}>
            <div className="closemenu sidebar-animated-header unhighlited" onClick={() => {}}>
              {/* changing menu collapse icon on click */}
              {collapsed ? (
                <i className="fa fa-arrow-right"></i>
              ) : (
                <i className="fa fa-arrow-left"></i>
              )}
            </div>
          </MenuItem>
        </Menu>
      </SidebarFooter>
    );
  };

  return (
    <>
      <div id="leftSidebar" className="">
        <ProSidebar
          collapsed={collapsed}
          toggled={toggled}
          onToggle={handleToggleSidebar}
          onMouseEnter={() => {
            collapse(false);
          }}
          onMouseLeave={() => {
            collapse(true);
          }}
        >
          <SidebarHeader className="sidebar-animated-header" style={{}}>
            {collapsed ? (
              <div
                style={{
                  lineHeight: '64px',
                  marginLeft: 20,
                  height: '64px',
                }}
              >
                <NavLink to="/">
                  <img style={{ height: '35px' }} src={LogoDarkMini} />
                </NavLink>
              </div>
            ) : (
              <div
                style={{
                  lineHeight: '64px',
                  marginLeft: 10,
                  height: '64px',
                }}
              >
                <NavLink to="/">
                  <img style={{ height: '35px' }} src={LogoDark} />
                </NavLink>
              </div>
            )}
          </SidebarHeader>
          <SidebarContent>
            <Menu>
              <MenuItem
                active={location.pathname === '/swap'}
                icon={<i className="fa fa-exchange"></i>}
              >
                <StyledNavLink activeClassName={activeClassName} exact to="/swap" className="">
                  Dex
                </StyledNavLink>
              </MenuItem>
              <MenuItem
                active={location.pathname === '/amo-v3'}
                icon={<i className="fa fa-cogs"></i>}
              >
                <StyledNavLink activeClassName={activeClassName} exact to="/amo-v3" className="">
                  AMO
                </StyledNavLink>
              </MenuItem>
              <MenuItem
                active={location.pathname === '/farms'}
                icon={<i className="fa fa-pagelines"></i>}
              >
                <StyledNavLink activeClassName={activeClassName} exact to="/farms" className="">
                  Farms
                </StyledNavLink>
              </MenuItem>
              <MenuItem
                active={location.pathname === '/staking'}
                icon={<i className="fa fa-pagelines"></i>}
              >
                <StyledNavLink activeClassName={activeClassName} exact to="/staking" className="">
                Ninja Staking
                </StyledNavLink>
              </MenuItem>
              <SubMenu
                defaultOpen={['/pools', '/ido-pools'].includes(location.pathname)}
                title="Pools"
                icon={<i className="fa fa-ticket" aria-hidden="true"></i>}
              >
                <MenuItem active={location.pathname === '/ido-pools'}>
                  <StyledNavLink activeClassName={activeClassName} exact to="/ido-pools" className="">
                   IDO Pools
                  </StyledNavLink>
                </MenuItem>
                <MenuItem active={location.pathname === '/pools'}>
                  <StyledNavLink
                    activeClassName={activeClassName}
                    exact
                    to="/pools"
                    className=""
                  >
                    xNinja Pools
                  </StyledNavLink>
                </MenuItem>
              </SubMenu>
     
              <MenuItem
                active={location.pathname === '/bounties'}
                icon={<i className="fa fa-trophy"></i>}
              >
                <StyledNavLink activeClassName={activeClassName} exact to="/bounties" className="">
                  Bounty
                </StyledNavLink>
              </MenuItem>

              <MenuItem
                active={location.pathname === '/cake-airdrop'}
                icon={<FontAwesomeIcon icon={faGift} />}
              >
                <StyledNavLink
                  activeClassName={activeClassName}
                  exact
                  to="/cake-airdrop"
                  className=""
                >
                  Cake Airdrop
                </StyledNavLink>
              </MenuItem>
                
              <MenuItem
                active={location.pathname.includes('/ninja-starter')}
                icon={<FontAwesomeIcon icon={faStore} />}
              >
                <StyledNavLink activeClassName={activeClassName} to="/ninja-starter" className="">
                Ninja EIDO
                </StyledNavLink>
              </MenuItem>
              <MenuItem
                active={location.pathname.includes('/locker')}
                icon={<FontAwesomeIcon icon={faLock} />}
              >
                <StyledNavLink activeClassName={activeClassName} to="/locker" className="">
               Ninja Locker
                </StyledNavLink>
              </MenuItem>

              <MenuItem active={false} icon={<i className="fa fa-line-chart"></i>}>
                <StyledLink href="https://info.ninjaswap.app/">Analytics</StyledLink>
              </MenuItem>
              <SubMenu
                defaultOpen={['/amo-v2', '/amo'].includes(location.pathname)}
                title="Disabled"
                icon={<i className="fa  fa-chain-broken" aria-hidden="true"></i>}
              >
                <MenuItem active={location.pathname === '/amo-v2'}>
                  <StyledNavLink activeClassName={activeClassName} exact to="/amo-v2" className="">
                    AMO v2 
                  </StyledNavLink>
                </MenuItem>
                <MenuItem active={location.pathname === '/amo'}>
                  <StyledNavLink
                    activeClassName={activeClassName}
                    exact
                    to="/amo"
                    className=""
                  >
                   AMO v1
                  </StyledNavLink>
                </MenuItem>
              </SubMenu>
              <SubMenu title="One Pager" icon={<i className="fa fa-file-o" aria-hidden="true"></i>}>
                <MenuItem>
                  <StyledLink target="_blank" href="/files/Ninjaswap.pdf">
                    English
                  </StyledLink>
                </MenuItem>
                <MenuItem>
                  <StyledLink target="_blank" href="/files/Ninjaswap_CN.pdf">
                    简体中文
                  </StyledLink>
                </MenuItem>
                <MenuItem>
                  <StyledLink target="_blank" href="/files/Ninjaswap_ITA.pdf">
                    Italiano
                  </StyledLink>
                </MenuItem>
                <MenuItem>
                  <StyledLink target="_blank" href="/files/Ninjaswap_TR.pdf">
                    Türkçe
                  </StyledLink>
                </MenuItem>
              </SubMenu>

              <SubMenu title="More" icon={<i className="fa fa-ellipsis-h" aria-hidden="true"></i>}>
                <MenuItem icon={<i className="fa fa-book" aria-hidden="true"></i>}>
                  <StyledLink href="https://docs.ninjaswap.app">API</StyledLink>
                </MenuItem>
                <MenuItem icon={<i className="fa fa-github" aria-hidden="true"></i>}>
                  <StyledLink href="https://github.com/ninjaswapapp">GitHub</StyledLink>
                </MenuItem>
              </SubMenu>
            </Menu>
          </SidebarContent>
          {renderFooter()}
          {/* <Menu iconShape="square">
            <MenuItem icon={() => <i className="fa fa-pencil" aria-hidden="true"></i>}>
              Dashboard
            </MenuItem>
            <SubMenu
              title="Components"
              icon={() => <i className="fa fa-pencil" aria-hidden="true"></i>}
            >
              <MenuItem>Component 1</MenuItem>
              <MenuItem>Component 2</MenuItem>
            </SubMenu>
          </Menu> */}
        </ProSidebar>
      </div>
    </>
  );
}
