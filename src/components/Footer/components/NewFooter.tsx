import React from 'react';
import logo_dark from '../../../assets/img/Ninja_Logo_DarkVer.png';
import styled from 'styled-components';
import Web3Status from '../../Web3Status';
import { useActiveWeb3React } from '../../../hooks';
import { useETHBalances } from '../../../state/wallet/hooks';
import { Text } from 'rebass';
import Spinner from 'react-bootstrap/Spinner';
import { TWITTER_ACCOUNT_URL } from '../../../constants';
/* const BalanceText = styled(Text)`
  padding: 12px 12px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`; */

const BalanceText = styled(Text)``;

const AccountElement = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg3 : theme.GrBg)};
  border-radius: 12px;
  white-space: nowrap;
  color: white;
  text-align: center;
  width: 100%;
  height: 40px;
  font-size: 14px;
  justify-content: center;
  display: flex;

  :focus {
    border: 1px solid blue;
  }
`;
const NewFooter: React.FC = () => {
  const { account, active } = useActiveWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];

  return (
    <>
      <nav className="mobile-bottom-nav">
        <div className="col d-flex flex-nowrap justify-content-center align-items-center">
          {active ? (
            <>
              <div className="col-md-4 col-sm-6 justify-content-center align-self-center">
                <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
                  {account && userEthBalance ? (
                    <BalanceText
                      style={{
                        flexShrink: 0,
                        padding: 0,
                        lineHeight: 1.3,
                      }}
                      fontWeight={600}
                    >
                      <div className="d-flex justify-content-center align-self-center">
                        Balanace:
                      </div>
                      <div className="d-flex justify-content-center align-self-center">
                        {userEthBalance?.toSignificant(4)} BNB
                      </div>
                    </BalanceText>
                  ) : null}
                </AccountElement>
              </div>
              <div className="col-md-4 col-sm-6 justify-content-center align-self-center">
                <Web3Status />
              </div>
            </>
          ) : (
            <Spinner as="span" animation="border" role="status" aria-hidden="true" />
          )}
        </div>
      </nav>
      <div id="footer" className="container-fluid">
        <div
          className="row justify-content-sm-center"
          style={{ maxWidth: '1140px', margin: 'auto' }}
        >
          <div className="col-sm links">
            <img src={logo_dark} />
            <p>The first project launching via Novel AMO (Automatic Minting Offering )</p>
          </div>
          <div className="col-sm links">
            <div className="footerTitle">Contact us</div>
            <a href="mailto:contact@ninjaswap.app">contact@ninjaswap.app</a>
          </div>
          <div className="col-sm links">
            <div className="footerTitle">Project</div>
            <a
              href="https://www.bscscan.com/address/0x93e7567f277F353d241973d6f85b5feA1dD84C10#code"
              target="_blank"
              rel="noreferrer"
            >
              Token
            </a>
            <a href="https://github.com/ninjaswapapp" target="_blank" rel="noreferrer">
              Github
            </a>
            <a href="/files/ninja_elements.zip" target="_blank">
              Logo Pack
            </a>
          </div>
          <div className="col-sm links">
            <div className="footerTitle">Join the community</div>
            <a href="https://t.me/Ninjaswap" target="_blank" rel="noreferrer">
              <i className="fa fa-telegram" aria-hidden="true"></i>Telegram
            </a>
            <a href={TWITTER_ACCOUNT_URL} target="_blank" rel="noreferrer">
              <i className="fa fa-twitter" aria-hidden="true"></i>Twitter
            </a>
            <a href="https://medium.com/@ninjaswap" target="_blank" rel="noreferrer">
              <i className="fa fa-pencil" aria-hidden="true"></i>Blog
            </a>
          </div>
        </div>
      </div>
      <div className="row justify-content-center footer-bscscan-logo">
        <img alt="bscscan" style={{ height: '40px' }} src="/images/switch-bsc.svg" />
      </div>
      <div className="row justify-content-center footer-bscscan-logo" style={{padding : '0px'}}>
        <p>Disclaimer :  Do Your Own Research(DYOR)</p>
      </div>
    </>
  );
};

export default NewFooter;
