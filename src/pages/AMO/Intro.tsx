import React, { useEffect, useState } from 'react';
import { BuyStepsDesktop } from '../Intro/buy.js';
import { BuyStepsMobile } from '../Intro/buy.js';
import '../../../node_modules/intro.js/introjs.css';
import '../../../node_modules/intro.js/themes/introjs-modern.css';
import useAdvenceTranslation from '../../hooks/useAdvenceTranslation';

interface IntroProps {}

const Intro: React.FC<IntroProps> = () => {
  const { t, _t } = useAdvenceTranslation({ prefix: 'amoPage:intro' });

  const IntroJs = require('../../../node_modules/intro.js/intro');
  const [screenWidth, setWidth] = useState(window.innerWidth);
  async function closeTourPop() {
    var TourPop = document.getElementsByClassName('cookie-notice');
    if (TourPop[0]) {
      TourPop[0].classList.toggle('cookie-notice-hidden');
    }
  }
  async function startIntro() {
    if (screenWidth <= 700) {
      console.log('screen res : ' + screenWidth);
      IntroJs()
        .addSteps(BuyStepsMobile)
        .start();
    } else {
      console.log('screen res : ' + screenWidth);
      IntroJs()
        .addSteps(BuyStepsDesktop)
        .start();
    }
    await closeTourPop();
  }
  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [window.innerWidth]);
  useEffect(() => {
    setTimeout(() => {
      closeTourPop();
    }, 15000);
  }, []);
  return (
    <>
      <div id="klaro">
        <div className="klaro">
          <div className="cookie-notice ">
            <div className="cn-body">
              <p>{_t('lookingForHelp')}</p>
              <p className="cn-ok">
                <button
                  className="cm-btn cm-btn-sm cm-btn-success"
                  type="button"
                  onClick={startIntro}
                >
                  {_t('tour')}
                </button>
                <button
                  className="cm-btn cm-btn-sm cm-btn-danger cn-decline"
                  type="button"
                  onClick={closeTourPop}
                >
                  {_t('close')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Intro;
