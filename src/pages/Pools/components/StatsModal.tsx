import React, { useCallback, useEffect, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { darken } from 'polished';
import Modal from '../../../components/Modal';
import CurrencyFormat from '../../../components/CurrencyFormat';
import useAdvenceTranslation from '../../../hooks/useAdvenceTranslation';
import _ from 'lodash';

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
  z-index: 99999;
  font-family: Poppins, sans-serif;
`;

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  font-size: 20px;
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 1rem;
`};
`;

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`;

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, auto);
  grid-row-gap: 5px;
  margin-bottom: 24px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const GridTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

const GridValue = styled.div`
  font-weight: 600;
`;

export default function StatsModal({ isOpen, onDismiss, withData }: any) {
  const { _t } = useAdvenceTranslation({ prefix: 'farmsPage:statsModal' });

  if (!withData?.apyRaw) return null;
  const apyRaw = withData?.apyRaw ?? {};

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper>
        <UpperSection>
          <i className="fa fa-times wallet-close" onClick={() => onDismiss()}></i>
          {/* <CloseIcon >
          <CloseColor />
        </CloseIcon> */}
          <HeaderRow>{_t('roi')}</HeaderRow>
          <ContentWrapper>
            {/* <h5>Please connect to the appropriate Binance network.</h5> */}
            <Grid>
              <GridTitle>{_t('timeframe')}</GridTitle>
              <GridTitle>{_t('value')}</GridTitle>
              <div>{_t('daily')}</div>
              <GridValue>
                <CurrencyFormat value={apyRaw?.dailyAPY} /> %
              </GridValue>
              <div>{_t('weekly')}</div>
              <GridValue>
                <CurrencyFormat value={apyRaw?.weeklyAPY} /> %
              </GridValue>
              <div>{_t('monthly')}</div>
              <GridValue>
                <CurrencyFormat value={apyRaw?.monthlyAPY} /> %
              </GridValue>
              <div>{_t('yearly')}</div>
              <GridValue>
                <CurrencyFormat value={apyRaw?.yearlyAPY} /> %
              </GridValue>
            </Grid>
          </ContentWrapper>
        </UpperSection>
      </Wrapper>
    </Modal>
  );
}
