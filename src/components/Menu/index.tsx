import React, { useRef } from 'react'
// import { Info, BookOpen, Code, PieChart, MessageCircle } from 'react-feather'

import styled from 'styled-components'
import MenuIcon  from '../../assets/images/menu.png'
import MenuIcon_light  from '../../assets/images/menu_light.png'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from '../../theme'
import { NavLink  } from 'react-router-dom'
import {useDarkModeManager} from '../../state/user/hooks'


const activeClassName = 'ACTIVE'
const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  width:20%;
  text-align:center;
  display:inline-table;
  align-items: center;
  justify-content: center;
  padding:5px;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({theme})=>theme.text1};
  font-size: 16px;
  font-weight:600;

  &.${activeClassName} {
    border-radius: 12px;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: red;
  }
  @media (max-width:480px){
    font-size:14px;
    width:100%;
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled(ExternalLink)`
width: 100%;
text-align: center;
  flex: 1;
   color:${({theme})=>theme.text1};
    font-size: 14px;
    font-weight: 600;
  padding:5px;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`


// const CODE_LINK = 'https://github.com/Uniswap/uniswap-interface'

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)
  const { t } = useTranslation();
  const [isDark] = useDarkModeManager()

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <img style={{width:'20px'}} src={isDark?MenuIcon_light:MenuIcon}/>
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <StyledNavLink to="/">
            {t('home')}
          </StyledNavLink>
          <StyledNavLink to="/swap">
            {t('exchange')}
          </StyledNavLink>
          <StyledNavLink to="/staking">
            {t('staking')}
          </StyledNavLink>
          <StyledNavLink  to="/rewards">
            {t('rewards')}
          </StyledNavLink>
          <MenuItem id="link" href="https://Zwap.info/">
            {t('charts')}
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
