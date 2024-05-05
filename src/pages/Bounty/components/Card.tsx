import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ButtonSecondary, ButtonConfirmed } from '../../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faTelegram as fabTelegram,
  faTwitter as fabTwitter,
} from '@fortawesome/free-brands-svg-icons';

export const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 10px;
  padding: 25px;
  @media (max-width: 769px) {
    padding: 10px;
  }
`;

export const CardSection = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
  background-color: ${({ theme }) => theme.bg1};

  padding: 0rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`;

export const InfoCard = styled.div`
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 10px;
  position: relative;
  margin-bottom: 35px;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  border-top-left-radius: 10px;
 border-top-left-radius: 10px;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text1};
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`justify-content: center`};
`;

export const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const CardBody = styled.div`
  display: flex;
  padding: 1.5rem 0.8rem 0.8rem 0.8rem;
  width: 100%;
  flex-direction: column;

  /* grid-row-gap: 0.6rem; */
`;

export const StyledCardRow = styled.div`
  justify-content: flex-start;
  align-items: stretch;
  font-weight: 400;
  color: ${({ color }) => color};
  font-size: 15px;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 0.7rem;

  div {
    align-items: stretch;
  }

  span {
  }
`;

export const CardRowLeft = styled.div`
  display: flex;
  align-items: stretch;
`;

export const CardRowRight = styled.div`
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div<{ size?: number }>`
  align-items: stretch;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`;

export const StyledCardAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  font-size: 1.1rem;
  padding: 10px;
  color: white;
  :hover {
    cursor: pointer;
    text-decoration: none;
  }
`;

export const StyledCardTaskButton = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  font-size: 0.9rem;
  padding: 7px;
  margin: 5px;
  color: white;
  :hover {
    cursor: pointer;
    text-decoration: none;
  }
`;

export const StyledCardActionClose = styled(ButtonConfirmed)`
  width: fit-content;
  font-weight: 400;
  font-size: 1.1rem;
  padding: 10px;
  background-color: #2c2f36;
  border: 1px solid #40444f;
  color: white;
`;

export const StyledPointBadge = styled.span`
  align-items: center;
  white-space: nowrap;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 550;
  margin-left: 10px;
  padding: 5px;
`;

export const CardRow = ({ completed, children }: any) => {
  const themeStyle = useContext(ThemeContext);
  return (
    <StyledCardRow color={completed ? themeStyle.text1 : themeStyle.text3}>
      {children}
    </StyledCardRow>
  );
};

export const PointBadge = ({ completed, children }: any) => {
  const themeStyle = useContext(ThemeContext);
  return (
    <StyledPointBadge
      style={{
        backgroundColor: completed ? '#f3ba2f' : themeStyle.text4,
        color: completed ? themeStyle.text1 : themeStyle.text2,
      }}
    >
      {children}
    </StyledPointBadge>
  );
};

export const CardAction = ({ connected, children, ...props }: any) => {
  const themeStyle = useContext(ThemeContext);

  if (connected) {
    return <StyledCardActionClose {...props}>{children}</StyledCardActionClose>;
  }
  return <StyledCardAction {...props}>{children}</StyledCardAction>;
};

export const CardTaskAction = ({ connected, children, ...props }: any) => {
  const themeStyle = useContext(ThemeContext);

  if (connected) {
    return (
      <StyledCardTaskButton backgroundColor="rgb(243, 186, 47)" {...props}>
        {children}
      </StyledCardTaskButton>
    );
  }
  return <StyledCardTaskButton {...props}>{children}</StyledCardTaskButton>;
};

export const CheckIcon = (props: any) => {
  const themeStyle = useContext(ThemeContext);
  return (
    <FontAwesomeIcon
      {...props}
      color={props.color ?? themeStyle.text4}
      size="lg"
      icon={farCheckCircle}
    />
  );
};
