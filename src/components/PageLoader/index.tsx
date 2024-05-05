import React from 'react';
import styled from 'styled-components';
import NinjaLoadingGif from '../../assets/images/think-transparent.gif';

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding-left: 16px;
  padding-right: 16px;
  @media screen and (min-width: 576px) {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

const Page = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;
  @media screen and (min-width: 576px) {
    padding-top: 24px;
    padding-bottom: 24px;
  }
  @media screen and (min-width: 986px) {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`;

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <img src={NinjaLoadingGif} alt="ninja loader" style={{ height: '180px' }} />
    </Wrapper>
  );
};

export default PageLoader;
