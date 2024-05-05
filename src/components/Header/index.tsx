// import { ChainId } from '@bscswap/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'
import { NavLink  } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
// import menu_dark from '../../assets/svg/menu_dark.png'
// import Logo from '../../assets/svg/logo.svg'
// import LogoDark from '../../assets/svg/logo_white.svg'
// import Wordmark from '../../assets/svg/wordmark.svg'
// import WordmarkDark from '../../assets/svg/wordmark_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

// import { YellowCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'
import Menu2 from '../Menu2'

import { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import logo_light from '../../assets/img/Zwap_Logo_WhiteVer.png'
import logo_dark from '../../assets/img/Ninja_Logo_DarkVer.png'
// import VersionSwitch from './VersionSwitch'

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
  height: 3rem;
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
    color: #f0b90b;
  }
  @media (max-width:480px){
    font-size:14px;
  }
`
const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

// const TitleText = styled(Row)`
//   width: fit-content;
//   white-space: nowrap;
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     display: none;
//   `};
// `

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.GrBg : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;

  :focus {
    border: 1px solid blue;
  }
`

// const TestnetWrapper = styled.div`
//   white-space: nowrap;
//   width: fit-content;
//   margin-left: 10px;
//   pointer-events: auto;
// `

// const NetworkCard = styled(YellowCard)`
//   width: fit-content;
//   margin-right: 10px;
//   border-radius: 12px;
//   padding: 8px 12px;
// `

const UniIcon = styled.div`
  width:130px;
  padding-top:5px;
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `};
  
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding:10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
  @media (max-width:480px){
    position: absolute;
    right: 0;
    top: 20px;
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const MenuText = styled.div`
  width:100%;
  line-height: 50px;
  flex-direction: row;
  height: 50px;
  align-items:center;
  @media (max-width:480px){
    width: 280px;
    z-index: 100;
    position: absolute;
    top: 90%;
    left:0;
  }
`

// const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
//   [ChainId.MAINNET]: null,
//   [ChainId.RINKEBY]: 'Rinkeby',
//   [ChainId.ROPSTEN]: 'Ropsten',
//   [ChainId.GÖRLI]: 'Görli',
//   [ChainId.KOVAN]: 'Kovan'
// }

// const MobileMenu = styled.div`
// width: 10%;
// position: absolute;
// right: 0%;
// img{
//   width: 60%;
// }
// `
const InfoLinkSty = styled.span`
display: inline-block;
margin-left: 5%;
a{    text-decoration: dashed;
  color:${({theme})=>theme.text1}
  font-weight: bold;
  font-size: 16px;}
a:hover{
  color: #f0b90b;
}
`
export default function Header() {
  const { account } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()
  const { t } = useTranslation();

  return (
    <>
      <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <div style={{width:'20%'}}>
          <HeaderElement>
            <Title href=".">
              <UniIcon>
                {/* <img src={isDark ? LogoDark : Logo} alt="logo" /> */}
                <img style={{ marginLeft: '4px', marginTop: '4px', maxWidth: '150px' }} src={isDark?logo_dark:logo_light}/>
              </UniIcon>
              {/* // <TitleText>
              //   <img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" />
              // </TitleText> */}
            </Title>
          </HeaderElement>
        </div>
        {/* {isMobile?(<MobileMenu>
        <img src={menu_dark}/>
      </MobileMenu>):(
        <>
        
        </>
      )} */}
      
        {isMobile?(<></>):(<div style={{width:'40%',textAlign:isMobile?"left":'right'}}>
          <HeaderElement>
            <MenuText>
                <StyledNavLink to="/">{t('home')}</StyledNavLink> 
                <StyledNavLink to="/swap">{t('exchange')}</StyledNavLink> 
                <StyledNavLink to="/staking">{t('staking')}</StyledNavLink> 
                <StyledNavLink to="/buy">{t('buy')}</StyledNavLink> 
                <InfoLinkSty ><a href="#" target="_blank">{t('charts')}</a></InfoLinkSty> 
            </MenuText>
          </HeaderElement>
        </div>)}

        <HeaderControls>
          <HeaderElement>
            {/* <div style={{textAlign:'right',marginRight:'15px'}}>
              <img  onClick={toggleDarkMode} style={{width:isMobile?"17px":"20px"}} src={isDark?light_dark:light_light}/>
              <img style={{width:isMobile?"7px":"10px",margin:'0 6px 0 6px'}}  src={isDark?xiexian_dark:xiexian_light}/>
              <img onClick={toggleDarkMode} style={{width:isMobile?"17px":"18px"}}  src={isDark?dark_dark:dark_light}/>
            </div> */}
            {/* <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper> */}
            {!isMobile?(<AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} BNB
                </BalanceText>
              ) : null}
              <Web3Status/>
            </AccountElement>):(<></>)}
          </HeaderElement>
          <HeaderElementWrap>
            {/* <VersionSwitch /> */}
            <Settings />
            {/* <Menu /> */}
            {isMobile?(<Menu/>):(<Menu2/>)}
          </HeaderElementWrap>
        </HeaderControls>
        
      </RowBetween>
    </HeaderFrame>
    </>
    
  )
}
