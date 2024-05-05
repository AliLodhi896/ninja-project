import React, { useEffect,useRef, useState } from 'react';
import { useActiveWeb3React } from '../../hooks';
import NinjaIcon from '../../assets/images/Ninja_icon.png';
import { useBountyActionHandlers } from '../../state/bounty/hooks';
import Stats from './components/Stats';
import Spinner from 'react-bootstrap/Spinner';
import { SeoHelmet } from '../../components/SeoHelmet';
import useBountyApi from '../../hooks/useBountyApi';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { Container, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useForm, OnSubmit } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { RouteComponentProps, useHistory } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';
import { BACKEND_URL } from '../../constants';
import Notification from '../../components/Notification/Notification';
import axios from 'axios';
import isEmail from "validator/lib/isEmail";

const BackButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: center;
  `}
`;

const CaptchaWrapper = styled.div`
  margin-top: 30px;
  justify-content: center;
 
`;
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
  },

  textField: {
    marginTop: 25,
  },

  submitButton: {
    marginTop: 40,
  },
}));

// import { ChainId, Token, WETH, Fetcher, Route } from '@bscswap/sdk'

export const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 10px;
  padding: 25px;
  @media (max-width: 769px) {
    padding: 0px;
    width: 100% !important;
  }
`;

type FormInputs = {
  projectName: string;
  projectLogo: string;
  projectDetails: string;
  website: string;
  email: string;
  twitter: string;
  token: string;
  tokenContract: string;
  tokenPrice : string;
  hardcap: string;
  totalTokenSale : string;
};

export default function NinjaStarterApplication() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [token , setToken] = useState('');
  const [CaptchaValidated , setCaptchaValidated] = useState(false);
  const history = useHistory();
  const { register, handleSubmit, errors , reset } = useForm<FormInputs>();
  const onSubmit: OnSubmit<FormInputs> = async (data) => {

    if(CaptchaValidated){
      try {
        const query = {
          ...data,
        };
  
        const params = new URLSearchParams();
        params.append('token', token);
        params.append('projectName' , query.projectName);
        params.append('projectLogo' , query.projectLogo);
        params.append('projectDetails' , query.projectDetails);
        params.append('website' , query.website);
        params.append('email' , query.email);
        params.append('twitter' , query.twitter);
        params.append('tokenContract' , query.tokenContract);
        params.append('tokenPrice' , query.tokenPrice);
        params.append('hardcap' , query.hardcap);
        params.append('totalTokenSale' , query.totalTokenSale);
        console.log(params.toString());
        const response = await axios.post(`${BACKEND_URL}/api/user/application`, params.toString(), {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        console.log('Response : ', response);
  
        if (!response?.data) {
          Notification.notification({
            type: 'error',
            message: 'Sorry! Try again later.',
          });
        }
  
        if (!response?.data?.status) {
          Notification.notification({
            type: 'error',
            message: 'Sorry! Try again later.',
          });
        } else {
          reset({})
          Notification.notification({
            type: 'success',
            message: response?.data?.msg || 'Success',
          });
        }
  
        return response.data;
      } catch (error) {
        console.log("error throwing : " + error);
        Notification.notification({
          type: 'error',
          message: error.message || 'Sorry! Try again later.',
        });
        throw new Error('error');
      }
    } else {
      Notification.notification({
        type: 'error',
        message: 'Please fill Captcha correctly',
      });
    }
  
  }



  const registerWithRequired = register({ required: 'This is required' });

  useEffect(() => {}, []);

  if (isLoading)
    return (
      <div className="row justify-content-center">
        <Spinner as="span" animation="border" role="status" aria-hidden="true" />
      </div>
    );

  return (
    <>
      <SeoHelmet title="Bounty" />
      <div className="main container" id="">
        <div className="d-flex justify-content-center">
          <BodyWrapper className="col-sm-12 col-lg-10">
            <BackButtonWrapper>
              <Button
                onClick={() => history.push(`/ninja-starter`)}
                className="ninja-button"
                style={{ border: '0px solid rgb(240, 185, 11)', backgroundColor: '#12161c' }}
              >
                <FontAwesomeIcon icon={faArrowLeft} size="1x" /> Back to Starter
              </Button>
            </BackButtonWrapper>
            <div style={{ textAlign: 'center', marginBottom: '15px', marginTop: '30px' }}>
              <img alt="..." className="profile-icon" src={NinjaIcon} />
              <h2 className="subTitle" style={{ marginBottom: '20px' }}>
              Ninja EIDO Application
              </h2>
              <p style={{ padding: '20px' }}></p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
              <ThemeProvider theme={theme}>
                <Container className={classes.paper}>
                  <TextField
                    label={'Project Name'}
                    name="projectName"
                    type="text"
                    variant="outlined"
                    inputRef={registerWithRequired}
                    className={classes.textField}
                    error={!!errors.projectName}
                    helperText={errors.projectName && errors.projectName.message}
                  />
                  <TextField
                    label={'Project Logo (direct link to png format )'}
                    name="projectLogo"
                    type="text"
                    variant="outlined"
                    inputRef={registerWithRequired}
                    className={classes.textField}
                    error={!!errors.projectLogo}
                    helperText={errors.projectLogo && errors.projectLogo.message}
                  />
                  <TextField
                    label={'Project Details (Max 500 Words)'}
                    name="projectDetails"
                    type="text"
                    variant="outlined"
                    inputRef={registerWithRequired}
                    className={classes.textField}
                    multiline
                    rows={4}
                    error={!!errors.projectDetails}
                    helperText={errors.projectDetails && errors.projectDetails.message}
                  />
                  <TextField
                    label={'Website'}
                    name="website"
                    type="text"
                    variant="outlined"
                    className={classes.textField}
                    inputRef={registerWithRequired}
                    error={!!errors.website}
                    helperText={errors.website && errors.website.message}
                  />
                  <TextField
                    label={'Email'}
                    name="email"
                    type="email"
                    variant="outlined"
                    className={classes.textField}
                    inputRef={ register({ required: true, validate: (value) => isEmail(value) })}
                    helperText={
                      errors.email ?
                      (errors.email as any).type === "required" ? "Email is required" :
                      (errors.email as any).type === "validate" ? "Email is invalid" : "" : ""
                    }
                    error={ !!errors.email }
                  />
                  <TextField
                    label={'Twitter'}
                    name="twitter"
                    type="text"
                    variant="outlined"
                    className={classes.textField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span style={{ alignItems: 'center' }}>@</span>
                        </InputAdornment>
                      ),
                    }}
                    inputRef={register}
                  />
                  <TextField
                    label={'Token BSC Contract'}
                    name="tokenContract"
                    type="text"
                    variant="outlined"
                    className={classes.textField}
                    inputRef={registerWithRequired}
                    error={!!errors.token}
                    helperText={errors.token && errors.token.message}
                  />
                  <TextField
                    label={'Token Price in BUSD'}
                    name="tokenPrice"
                    type="text"
                    variant="outlined"
                    className={classes.textField}
                    inputRef={register}
                  />
                  <TextField
                    label={'Hardcap in  BUSD'}
                    name="hardcap"
                    type="text"
                    variant="outlined"
                    className={classes.textField}
                    inputRef={register}
                  />
                  <TextField
                    label={'Total Token for Sale'}
                    name="totalTokenSale"
                    type="text"
                    variant="outlined"
                    className={classes.textField}
                    inputRef={register}
                  />
                  <CaptchaWrapper>
                  <ReCAPTCHA
                    sitekey="6LezsxIdAAAAAHTgQlh7EDJHWqV9ebrodbI8KP1U"
                    onChange={(token) => {
                      if (token) {
                      setToken(token);
                      setCaptchaValidated(true);
                      }
                      
                    }}
                    onErrored={() => setCaptchaValidated(false)}
                    onExpired={() => setCaptchaValidated(false)}
                  />
                </CaptchaWrapper>

                  <Button
                    className={'Zwap-btn-card button ' + classes.submitButton}
                    block
                    type="submit"
                  >
                    Apply
                  </Button>
                  <br></br>
                  <br></br>
                  
                  <p>For any quick inquiry and problem.Please contact on telegram  <a href="https://t.me/Michelangelo_Ninja">@Michelangelo_Ninja</a></p>
                </Container>
              </ThemeProvider>
            </form>
          </BodyWrapper>
        </div>
      </div>
    </>
  );
}
