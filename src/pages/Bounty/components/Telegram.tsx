import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  CardAction,
  CardBody,
  CardHeader,
  CardRow,
  CardRowLeft,
  CheckIcon,
  IconWrapper,
  InfoCard,
  PointBadge,
  CardTaskAction,
  CardHeaderLeft,
} from './Card';
import { faTelegram as fabTelegram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeContext } from 'styled-components';
import {
  useBountyActionHandlers,
  useBountySelectors,
  useBountyState,
} from '../../../state/bounty/hooks';
import useTelegramApi from '../../../hooks/useTelegramApi';
import { useActiveWeb3React } from '../../../hooks';
import Notification from '../../../components/Notification/Notification';
import { TelegramUserData } from '../../../state/bounty/actions';
import { cloneDeep } from 'lodash';

export const TelegramIcon = (props: any) => <FontAwesomeIcon {...props} icon={fabTelegram} />;

const TASKS = [
  {
    name: 'join',
    renderTitle: () => (
      <>
        Join
        <a className="pl-1 pr-1" rel="noreferrer" target="_blank" href="https://t.me/Ninjaswap">
          Ninjaswap.app Community
        </a>
        group
      </>
    ),
    renderPoints: () => <>5 points</>,
    completed: false,
  },
  /* {
    name: 'invite_friends',
    renderTitle: () => (
      <>
        Invite your friends (2 point for each friend) Your friends need to use your bounty referral
        url to enter Ninja website and complete join Telegram group task.
      </>
    ),
    renderPoints: () => <># friends * 2 points</>,
    completed: false,
  }, */
];

type TelegramProps = {
  status?: any;
  statusLoader?: any;
};

export default function Twitter({ status, statusLoader }: TelegramProps = {}) {
  const themeStyle = useContext(ThemeContext);
  const { account } = useActiveWeb3React();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskList, setTaskList] = useState(cloneDeep(TASKS));
  const isClaimable = isConnected && !!taskList.find((t) => !t.completed);

  /**
   * Bounty hooks
   */
  const { onTelegramConnect, onDisconnect } = useBountyActionHandlers();
  const { telegram } = useBountyState();
  const bountySelectors = useBountySelectors();
  /**
   * API hooks
   */
  const telegramApi = useTelegramApi();
  telegramApi.init();

  const disconnect = () => {
    // Remove state
    onDisconnect('telegram');
    // Inform backend
    /* telegramApi.logout(); */
    // Refresh task list
    setTaskList(cloneDeep(TASKS));
  };

  const setTaskCompleted = (taskName: string, completed: boolean = true) => {
    const foundTaskIndex = TASKS.findIndex((t) => t.name === taskName);
    if (foundTaskIndex !== -1) {
      taskList[foundTaskIndex].completed = completed;
    }
  };

  const hanleConnectButton = async () => {
    if (!account) {
      Notification.notification({
        type: 'warning',
        message: 'Please connect your wallet.',
      });
      return;
    }
    if (isConnected) {
      // disconnect();
      return;
    }
    setIsLoading(true);
    telegramApi.login().then(async (data) => {
      console.log('telegram data', data);

      let referral = '';

      try {
        referral = (await localStorage.getItem('bounty_referral_code')) || '';
      } catch (error) {}

      telegramApi
        .sendAccountData({
          auth_date: data?.auth_date,
          first_name: data?.first_name,
          hash: data?.hash,
          id: data?.id,
          last_name: data?.last_name,
          username: data?.username,
          userWalletId: account,
          referralWalletId: referral,
        })
        .then((response) => {
          // onTelegramConnect(data as TelegramUserData);
          statusLoader && statusLoader();
        })
        .catch((error) => {
          console.log('error', error);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // setIsLoading(false);
    });
  };

  useEffect(() => {
    if (account && status) {
      if (status?.teleAuthDate && status?.teleFirstName && status?.teleHash && status?.teleUserId) {
        onTelegramConnect({
          auth_date: status?.teleAuthDate,
          first_name: status?.teleFirstName,
          hash: status?.teleHash,
          id: status?.teleUserId,
          last_name: status?.teleLastName,
          username: status?.teleUsername,
        });
        setTaskCompleted('join', status?.tele_join_status);
      }
    } else {
      disconnect();
    }
  }, [account, status]);

  useEffect(() => {
    setIsConnected(
      bountySelectors.isConnected('telegram', (state) =>
        telegramApi.checkAuthorization(state?.userData),
      ),
    );
  }, [telegram, account]);

  return (
    <>
      <InfoCard>
        <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
          <CardHeaderLeft>
            <IconWrapper>
              <TelegramIcon size="2x" color="#0088cc" />
            </IconWrapper>
            <div>Telegram</div>
          </CardHeaderLeft>
          <CardAction onClick={hanleConnectButton} connected={isConnected} disabled={isLoading}>
            {isConnected ? 'Connected' : 'Connect'}
            {/* <PointBadge completed={isConnected}>10 points</PointBadge> */}
          </CardAction>
        </CardHeader>
        <CardBody>
          {/* <CardRow completed={true}>
            <CardRowLeft>
              <CardTaskAction
                connected={isConnected}
                disabled={!isClaimable}
                style={{ marginLeft: '10px' }}
                onClick={() => {}}
              >
                {isClaimable ? 'Claim All Telegram Points' : 'You claimed all Telegram points'}
              </CardTaskAction>
            </CardRowLeft>
          </CardRow> */}
          {taskList.map((task, i) => (
            <CardRow key={i.toString()} completed={task.completed}>
              <CardRowLeft>
                <IconWrapper>
                  <CheckIcon color={task.completed ? 'green' : null} />
                </IconWrapper>
                <span>
                  {task.renderTitle()}
                  {task.renderPoints && (
                    <PointBadge completed={task.completed}>{task.renderPoints()}</PointBadge>
                  )}
                </span>
              </CardRowLeft>
              {/* <CardTaskAction
                connected={isConnected}
                disabled={!isConnected || task.completed}
                style={{ marginLeft: '10px' }}
                onClick={() => (task.completed = true)}
              >
                {task.completed ? 'Earned' : 'Claim'} {task.renderPoints()}
              </CardTaskAction> */}
            </CardRow>
          ))}
        </CardBody>
      </InfoCard>
    </>
  );
}
