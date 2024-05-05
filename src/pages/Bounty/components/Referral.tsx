import React, { useEffect } from 'react';
import { Base_url } from '../../../constants';
import { decryptText, encryptText } from '../../../utils/compress';
import { getAddress, isAddress } from '@ethersproject/address';
import copy from 'copy-to-clipboard';
import Notification from '../../../components/Notification/Notification';
import useBlock from '../../../hooks/useBlock';
import { useActiveWeb3React } from '../../../hooks';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import ReferralUsersTable from './ReferralUsersTable';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
  maxBtn: {
    backgroundColor: '#f0b92d',
    padding: '13px 6px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  textField: {
    marginTop: '20px',
  },
}));

interface ReferralProps {
  setReferralAddress?: any;
  status?: any;
  loading?: boolean;
}

const Referral: React.FC<ReferralProps> = ({ setReferralAddress = () => {}, status, loading }) => {
  const classes = useStyles();
  const { account } = useActiveWeb3React();
  const block = useBlock();

  function getQueryVariable(variable: any) {
    var query = window.location.href.split('?')[1] || '';
    var vars = query.split('&');
    console.log(vars); //[ 'app=article', 'act=news_content', 'aid=160990' ]
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return '';
  }

  let refurl = Base_url + '/bounty' + (account ? '?ref=' + encryptText(account) : '');

  useEffect(() => {
    const addr = decryptText(getQueryVariable('ref'));
    if (isAddress(addr)) {
      const address = getAddress(addr);
      if (account && account === address) {
        // users own address, then no referral
        localStorage.removeItem('bounty_referral_code');
        setReferralAddress(undefined);
      } else {
        localStorage.setItem('bounty_referral_code', address);
        setReferralAddress(address);
      }
    }
  }, [account, block]);
  return (
    <>
      <div className="row ninjaBox justify-content-sm-center">
        <div className="col-sm-6 mb-3">
          <div className="title">Bounty Referral url</div>
        </div>
        <div className="col-sm-6 text-right"></div>
        <div className="col-12"></div>
        <div className="col-12">
          <ThemeProvider theme={theme}>
            <TextField
              id="outlined-number"
              className="refLink"
              contentEditable={false}
              disabled
              placeholder={refurl}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    id="copy"
                    className={classes.maxBtn}
                    onClick={(event) => {
                      copy(refurl);
                      Notification.notification({
                        type: 'success',
                        message: 'Copied Successful',
                      });
                    }}
                  >
                    <div style={{ position: 'relative', marginTop: '2px', color: 'white' }}>
                      Copy
                    </div>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </ThemeProvider>{' '}
        </div>
        <ReferralUsersTable users={status?.refferals?.users} loading={loading} />
      </div>
    </>
  );
};

export default Referral;
