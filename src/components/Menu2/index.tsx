import React, { useRef } from 'react'
// import { Info, BookOpen, Code, PieChart, MessageCircle } from 'react-feather'
import styled from 'styled-components'
// import { ReactComponent as MenuIcon } from '../../assets/images/menu1.svg'
import { ReactComponent as MenuIcon } from '../../assets/svg/i18n.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import en_flag from '../../assets/img/en_flag.png'
import zn_flag from '../../assets/img/zn_flag.png'
import tk_flag from '../../assets/img/tk_flag.png'
import i18next from 'i18next'
// import useToggle from '../../hooks/useToggle'
import { useCallback, useState } from 'react'

// import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

// const StyledMenuButton = styled.button`
//   width: 100%;
//   height: 100%;
//   border: none;
//   background-color: transparent;
//   margin: 0;
//   padding: 0;
//   height: 35px;
//   background-color: #f3f3f4;

//   padding: 0.15rem 0.5rem;
//   border-radius: 0.5rem;

//   :hover,
//   :focus {
//     cursor: pointer;
//     outline: none;
//     background-color: ${({ theme }) => theme.bg4};
//   }

//   svg {
//     margin-top: 2px;
//   }
// `

const StyledMenu = styled.div`
  // margin-left: 0.5rem;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // position: relative;
  // border: none;
  // text-align: left;
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

const MenuItem = styled.span`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
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
  // var [open, toggle] = useToggle(false)
  const [open, setState] = useState(false)
  const toggle = useCallback(() => setState(open => !open), [])
  function changeLan(){
    i18next.changeLanguage(i18next.language==='zh-CN'?'en':'zh-CN')
    setState(open => !open)
  }
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
       <a className="nav-link" onClick={toggle} >
       <StyledMenuIcon />
       </a>
      {/* <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton> */}
      {open && (
        <MenuFlyout>
          <MenuItem id="link"  onClick={changeLan}>
          <img src={en_flag} alt="English Lang" style={{ maxWidth: '24px' , maxHeight: '24px' , verticalAlign:'middle' , textAlign:'left'}}/>
            English
          </MenuItem>
          <MenuItem id="link"  onClick={changeLan}>
          <img src={tk_flag} alt="English Lang" style={{ maxWidth: '24px' , maxHeight: '24px' , verticalAlign:'middle' , textAlign:'left'}}/>
            Turkish
          </MenuItem>
          <MenuItem id="link"  onClick={changeLan}>
          <img src={zn_flag} alt="English Lang" style={{ maxWidth: '24px' , maxHeight: '24px' , verticalAlign:'middle' , textAlign:'left'}}/>
            中文
          </MenuItem>
      
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
