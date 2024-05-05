import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
type SmallCountdownProps = {
  futureDate: number;
};


export default function SmallCountdown({ futureDate }: SmallCountdownProps) {
  const [dateNow, setDateNow] = useState(Math.floor(Date.now() / 1000));

  function tick() {
    setDateNow(Math.floor(Date.now() / 1000));
  }

  useEffect(() => {
         setInterval(function() {
            tick();
    }, 2000);
  }, []);

  const delta = Math.floor(futureDate - dateNow);
  const seconds = delta % 60;
  const minutes = Math.floor(delta / 60) % 60;
  const hours = Math.floor(delta / 3600) % 24;
  const days = Math.floor(delta / 86400);

  return (
    <CountdownStyle>
      {delta < 0 ? (
        <p>{moment(futureDate * 1000).fromNow()}</p>
      ) : (
        <p>
          {String(days).padStart(2, '0')}d  :{String(hours % 24).padStart(2, '0')}h  :
          {String(minutes % 60).padStart(2, '0')}m  :
          {String(seconds % 60).padStart(2, '0')}s 
        </p>
      )}
    </CountdownStyle>
  );
}

// Style
const CountdownStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: white;
    margin-bottom: 0;
    letter-spacing: 2px;
    color : #f0b909 !important;
    margin-bottom : 2px !important;
  }
`;
