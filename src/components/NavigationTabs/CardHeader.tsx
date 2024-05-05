/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { LegacyRef, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '../Button';
import SettingsTab from '../Settings';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useToggleSettingsMenu, useSettingsMenuOpen } from '../../state/application/hooks';

const Container = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  -webkit-box-align: center;
  align-items: center;
  padding: 0;
  margin: 0;
  top: 8px;
  right: 10px;
`;

const LeftSide = styled.div`
  flex: 1 1 0%;
`;

const StyledButton = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  background-color: transparent;
  color: ${({ theme }) => theme.yellow1}
  width: fit-content;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`;

type CardHeaderProps = {
  children?: any;
};
export default function CardHeader({ children }: CardHeaderProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const toggle = useToggleSettingsMenu();
  const open = useSettingsMenuOpen();
  const node = useRef<HTMLDivElement>();

  useOnClickOutside(node, open ? toggle : undefined);

  return (
    <>
      <Container ref={node as any}>
        <LeftSide></LeftSide>
        <StyledButton onClick={toggle}>
          <FontAwesomeIcon icon={faCog} size="lg" />
        </StyledButton>
        <SettingsTab />
      </Container>
    </>
  );
}
