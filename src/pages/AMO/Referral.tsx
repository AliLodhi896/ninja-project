import React, { useEffect } from 'react';
import { Base_url } from '../../constants';
import { decryptText, encryptText } from '../../utils/compress';
import { getAddress, isAddress } from '@ethersproject/address';
import copy from 'copy-to-clipboard';
import Notification from '../../components/Notification/Notification';
import useBlock from '../../hooks/useBlock';
import { useActiveWeb3React } from '../../hooks';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import useAdvenceTranslation from '../../hooks/useAdvenceTranslation';
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
interface ReferralProps {}

const Referral: React.FC<ReferralProps> = () => {
  const { t, _t } = useAdvenceTranslation({ prefix: 'amoPage:referral' });
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

  const refurl = Base_url + '/amo' + (account ? '?ref=' + encryptText(account) : '');
  useEffect(() => {
    const addr = decryptText(getQueryVariable('ref'));
    console.log('query : ' + getQueryVariable('ref'));
    console.log('address : ' + addr);
    if (isAddress(addr)) {
      localStorage.setItem('referral_code', getAddress(addr));
    }
  }, [account, block]);
  return (
    <>
      <div className="row purchaseRow justify-content-sm-center">
        <div className="col-sm-6">
          <div className="title">{_t('referralUrl')}</div>
        </div>
        <div className="col-sm-6 text-right"></div>
        <div className="col-12">
          <div className="sub">{_t('whyImportant')}</div>
          <p>{_t('descImportant')}</p>
        </div>
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
                        message: _t('copiedSuccessfulNotify'),
                      });
                    }}
                  >
                    <div style={{ position: 'relative', marginTop: '2px', color: 'white' }}>
                      {_t('copy')}
                    </div>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </ThemeProvider>{' '}
        </div>
      </div>
    </>
  );
};

export default Referral;
