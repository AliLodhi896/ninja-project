import { Currency, Pair } from '@bscswap/sdk';
import React, { useState, useContext, useCallback } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { darken } from 'polished';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';
import CurrencyLogo from '../CurrencyLogo';
import DoubleCurrencyLogo from '../DoubleLogo';
import { RowBetween } from '../Row';
import { TYPE } from '../../theme';
import { Input as NumericalInput } from '../NumericalInput';
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg';

import { useActiveWeb3React } from '../../hooks';
import { useTranslation } from 'react-i18next';

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) =>
    selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem'};
`;

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 3rem;
  font-size: 20px;
  font-weight: 500;
  background: ${({ selected, theme }) => 'rgb(44, 47, 54)'};
  color: ${({ selected, theme }) => theme.white};
  border-color: rgb(64, 68, 79);
  border-width: 1px;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  padding: 0 0.5rem;
  margin-bottom: 0.7rem;

  :hover {
    background-color: #755007;
  }
`;

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`;

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Centeral = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`;

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
`;

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg2};
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`;

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  padding-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding-right: 0.5rem;
  `};
`;

const StyledNumericalInput = styled(NumericalInput)`
  background-color: ${({ theme }) => theme.bg2};
`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined);
  const theme = useContext(ThemeContext);

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <InputPanel id={id}>
      <CurrencySelect
        selected={!!currency}
        className="open-currency-select-button"
        onClick={() => {
          if (!disableCurrencySelect) {
            setModalOpen(true);
          }
        }}
      >
        <Centeral>
          {pair ? (
            <DoubleCurrencyLogo
              currency0={pair.token0}
              currency1={pair.token1}
              size={24}
              margin={true}
            />
          ) : currency ? (
            <CurrencyLogo currency={currency} size={'24px'} />
          ) : null}
          {pair ? (
            <StyledTokenName className="pair-name-container">
              {pair?.token0.symbol}:{pair?.token1.symbol}
            </StyledTokenName>
          ) : (
            <StyledTokenName
              className="token-symbol-container"
              active={Boolean(currency && currency.symbol)}
            >
              {(currency && currency.symbol && currency.symbol.length > 20
                ? currency.symbol.slice(0, 4) +
                  '...' +
                  currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                : currency?.symbol) || t('selectToken')}
            </StyledTokenName>
          )}
          <div
            style={{ width: 'fit-content', position: 'absolute', right: 0, marginRight: '10px' }}
          >
            {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
          </div>
        </Centeral>
      </CurrencySelect>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? 'Balance: ' + selectedCurrencyBalance?.toSignificant(6)
                    : ' -'}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}

        <InputRow
          style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
          selected={disableCurrencySelect}
        >
          {!hideInput && (
            <>
              <StyledNumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val);
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  );
}
