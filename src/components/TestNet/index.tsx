import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const TestStyle = styled.div`
width:50%;
margin-top:30px;
@media (max-width:480px){
  width:100%;
}
`
export default function TestNet() {
  const {t} = useTranslation();

  return (
      <>
      <TestStyle>
        {t('testnet')}
      </TestStyle>
      </>
  )
}
