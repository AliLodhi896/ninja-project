import React from 'react'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import { useDarkModeManager } from '../../../state/user/hooks'

const ImgStyleLogo = styled.img`
width:31%
@media (max-width:480px){
  width: 8%;
}

`

const Nav: React.FC = () => {
  const [isDark] = useDarkModeManager()

  return (
    <>
      {isMobile?(<><StyleMobileNav>
        <StyledLink target="_blank" href="https://etherscan.io/address/0x56831a7b5e61d6453c203cb22b7a89e016b05ecb">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Contractcopy.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Contract.svg")}/>)}
      </StyledLink>
      <StyledLink target="_blank" href="https://github.com/AshSwapEm/PokeSwap.git">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Githubred.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Github.svg")}/>)}
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://twitter.com/RealPokeSwap"
      >
        {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Twitterred.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Twitter.svg")}/>)}
      </StyledLink>
      <StyledLink target="_blank" href="https://discord.gg/7rFmuWa">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Discord red.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Discord.svg")}/>)}
      </StyledLink>
      <StyledLink target="_blank" href="https://medium.com/PokeSwap">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Medium red.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Medium.svg")}/>)}
      </StyledLink>
      <StyledLink target="_blank" href="https://t.me/joinchat/AAAAAFcOGgovkyO4aW_3Fw">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Telegram red.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Telegram.svg")}/>)}
      </StyledLink></StyleMobileNav>
      </>):(<StyledNav>
      <StyledLink target="_blank" href="https://etherscan.io/address/0x56831a7b5e61d6453c203cb22b7a89e016b05ecb">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Contractcopy.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Contract.svg")}/>)}
      </StyledLink>
      <StyledLink target="_blank" href="https://github.com/AshSwapEm/PokeSwap.git">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Githubred.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Github.svg")}/>)}
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://twitter.com/RealPokeSwap"
      >
        {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Twitterred.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Twitter.svg")}/>)}
      </StyledLink>
      <StyledLink target="_blank" href="https://discord.gg/7rFmuWa">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Discord red.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Discord.svg")}/>)}
      </StyledLink>
      <StyledLink target="_blank" href="https://medium.com/PokeSwap">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Medium red.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Medium.svg")}/>)}
      </StyledLink>
      <StyledLink target="_blank" href="https://t.me/joinchat/AAAAAFcOGgovkyO4aW_3Fw">
      {isDark?(<ImgStyleLogo src={require("../../../assets/svg/Socials_Telegram red.svg")}/>):
        (<ImgStyleLogo src={require("../../../assets/svg/Socials_Telegram.svg")}/>)}
      </StyledLink>
    </StyledNav>)}

    </>
    
  )
}
const StyleMobileNav = styled.div`
  margin-top:20px;
`
const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: red;
  font-weight: bold;
  width:100px;
  text-align:center;
  text-decoration: none;
  &:hover {
    color: blue;
  }

  @media (max-width:480px){
    margin: 10px;
  }
`

export default Nav
