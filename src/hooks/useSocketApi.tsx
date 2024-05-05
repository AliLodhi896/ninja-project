import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import socketio from 'socket.io-client';
import { SOCKET_URL } from '../constants';
import { useApyActionHandlers } from '../state/apy/hooks';
import { useNinjaStatsActionHandlers } from '../state/stats/hooks';

// export const socket = socketio(SOCKET_URL);

export const useSocketApi = () => {
  return { socket: {} };
};
