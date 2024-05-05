import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { darken } from 'polished';
import { NavLink, Link as HistoryLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faTint } from '@fortawesome/free-solid-svg-icons';
import CardHeader from './CardHeader';

const StyledTabs = styled.div`
  box-sizing: border-box;
  margin: 18px 0px 16px;
  min-width: 0px;
  width: 100%;
  border-top-left-radius: 10px;
 border-top-left-radius: 10px;
  44
  padding: 0 12px 0 12px;
  background: #12161c;
  /* border-bottom: 1px solid #2e2e2e;
  background: linear-gradient(
    180deg,
    var(--dark-background-color),
    var(--dark-background-color) 50%,
    var(--dark-main-color)
  ); */
`;

const InnerTabs = styled.div`
  display: flex;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 10px;
  justify-content: space-evenly;
  margin-inline: 16px;
`;

const activeClassName = 'ACTIVE';
const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  display: flex;
  flex-flow: row nowrap;
  width: 25%;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 3rem;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  background: transparent;
  font-size: 20px;
  padding: 30px;
  color: ${({ theme }) => darken(0.1, theme.text1)};

  :hover,
  :focus {
    color: ${({ theme }) => theme.white};
    background-color: #c79b0c;
  }

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
    background: rgb(240, 185, 11);
    /* box-shadow: -5px -5px 15px -2.5px #979dac, 5px 5px 15px #aeaec040; */
  }
`;

export function Tabs({ active }: { active: 'swap' | 'pool' }) {
  return (
    <>
      <CardHeader />
      <StyledTabs>
        <InnerTabs>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
            <FontAwesomeIcon icon={faExchangeAlt} size="lg" />
          </StyledNavLink>
          <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
            <FontAwesomeIcon icon={faTint} size="lg" />
          </StyledNavLink>
        </InnerTabs>
      </StyledTabs>
    </>
  );
}
