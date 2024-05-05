import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Tweet } from 'react-twitter-widgets';
import { faTelegram as fabTelegram } from '@fortawesome/free-brands-svg-icons';
import { faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import { submitTask } from '../../utils/axios';
import Spinner from 'react-bootstrap/Spinner';
import Notification from '../../components/Notification/Notification';
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
  TaskStatusBadge,
  CardTaskAction,
  CardHeaderLeft,
} from './Card';
export const TelegramIcon = (props: any) => <FontAwesomeIcon {...props} icon={fabTelegram} />;
export const TwitterIcon = (props: any) => <FontAwesomeIcon {...props} icon={fabTwitter} />;
const getStatusTask = (status: string) => {
  switch (status) {
    case 'new':
      return false;
    case 'pending':
      return false;
    case 'approved':
      return true;
    case 'rejected':
      return false;
  }
  return false;
};
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new':
      return (
        <TaskStatusBadge completed={true}>Status : New</TaskStatusBadge>
      );
    case 'pending':
      return (
        <TaskStatusBadge completed={true}>Status : Pending</TaskStatusBadge>
      );
    case 'approved':
      return (
        <TaskStatusBadge completed={true}>Status : Approved</TaskStatusBadge>
      );
    case 'rejected':
      return (
        <TaskStatusBadge completed={false}>Status : Rejected</TaskStatusBadge>
      );
  }
  return null;
};
interface TaskProps {
  type?: string;
  points?: string;
  Link?: string;
  Text?: string;
  tweetId?: string;
  status?: string;
  ctask_id?: string;
  cb_id?: string;
  account?: string;
  bountyStatus? :string;
  updateFromChild: Function;
}

const Task: React.FC<TaskProps> = ({ type, points, Link, Text, tweetId, status, ctask_id, cb_id, account, bountyStatus , updateFromChild }) => {
  const themeStyle = useContext(ThemeContext);
  const [btnStatus, setBtnStatus] = useState(false);
  const processTask = useCallback(async () => {
    setBtnStatus(true)
    const reply = await submitTask(account ? account : '', cb_id ? cb_id : '', ctask_id ? ctask_id : '');
  
    if (reply.status) {
      Notification.notification({
        type: 'success',
        message: reply.msg,
      });
      setBtnStatus(false)
      updateFromChild();
    } else {
      Notification.notification({
        type: 'error',
        message: 'Something wrong please contact support',
      });
      setBtnStatus(false)
      updateFromChild();
    }
    return reply
  }, [account]);
  return (
    <>
      {type == 'telejoin' ? (
        <InfoCard>
          <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
            <CardHeaderLeft>
              <IconWrapper>
                <TelegramIcon size="2x" color="#0088cc" />
              </IconWrapper>
              <div>Telegram</div>
            </CardHeaderLeft>
          </CardHeader>
          <CardBody>
            <CardRow completed={getStatusTask(status ? status : '')}>
              <CardRowLeft>
                <IconWrapper>
                  <CheckIcon color={getStatusTask(status ? status : '') ? 'green' : null} />
                </IconWrapper>
                <span>
                  Join
                  <a
                    className="pl-1 pr-1"
                    rel="noreferrer"
                    target="_blank"
                    href={Link}
                  >
                    {Text}
                  </a>
                  telegram group
                  <PointBadge completed={getStatusTask(status ? status : '')}>{points} points</PointBadge>
                  {getStatusBadge(status ? status : '')}
                </span>
              </CardRowLeft>
            </CardRow>
            <CardRow>
              <CardRowLeft>
              {status == 'new' && bountyStatus != 'closed'? (
                  btnStatus ? (
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                  ) : (
                    <Button
                      onClick={processTask}
                      className="Zwap-btn-md-card button"
                      disabled={false}
                    >
                      Submit Task
                    </Button>
                  )

                ) : ('')}
              </CardRowLeft>
            </CardRow>
          </CardBody>

        </InfoCard>
      ) : type == 'tweetFollow' ? (
        <InfoCard>
          <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
            <CardHeaderLeft>
              <IconWrapper>
                <TwitterIcon size="2x" color="#1DA1F2" />
              </IconWrapper>
              <div>Twitter Follow</div>
            </CardHeaderLeft>
          </CardHeader>
          <CardBody>
            <CardRow completed={getStatusTask(status ? status : '')}>
              <CardRowLeft>
                <IconWrapper>
                  <CheckIcon color={getStatusTask(status ? status : '') ? 'green' : null} />
                </IconWrapper>
                <span>
                  Follow
                  <a
                    className="pl-1 pr-1"
                    rel="noreferrer"
                    target="_blank"
                    href={Link}
                  >
                    {Text}
                  </a>
                  Twitter account
                  <PointBadge completed={getStatusTask(status ? status : '')}>{points} points</PointBadge>
                  {getStatusBadge(status ? status : '')}
                </span>
              </CardRowLeft>
            </CardRow>
            <CardRow>
              <CardRowLeft>
                {status == 'new' && bountyStatus != 'closed'? (
                  btnStatus ? (
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                  ) : (
                    <Button
                      onClick={processTask}
                      className="Zwap-btn-md-card button"
                      disabled={false}
                    >
                      Submit Task
                    </Button>
                  )

                ) : ('')}
              </CardRowLeft>
            </CardRow>
          </CardBody>
        </InfoCard>
      ) : type == 'retweet' ? (
        <InfoCard>
          <CardHeader style={{ backgroundColor: themeStyle.bg2 }}>
            <CardHeaderLeft>
              <IconWrapper>
                <TwitterIcon size="2x" color="#1DA1F2" />
              </IconWrapper>
              <div>Retweet</div>
            </CardHeaderLeft>
          </CardHeader>
          <CardBody>
            <CardRow completed={getStatusTask(status ? status : '')}>
              <CardRowLeft>
                <IconWrapper>
                  <CheckIcon color={getStatusTask(status ? status : '') ? 'green' : null} />
                </IconWrapper>
                <div>
                  <span>
                    {Text}
                    <a
                      className="pl-1 pr-1"
                      rel="noreferrer"
                      target="_blank"
                      href={Link}
                    >
                      Link
                    </a>

                    <PointBadge completed={getStatusTask(status ? status : '')}>{points} points</PointBadge>
                    {getStatusBadge(status ? status : '')}
                  </span>
                </div>



              </CardRowLeft>
            </CardRow>
            <CardRow>
              <CardRowLeft>
              {status == 'new' && bountyStatus != 'closed'? (
                  btnStatus ? (
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                  ) : (
                    <Button
                      onClick={processTask}
                      className="Zwap-btn-md-card button"
                      disabled={false}
                    >
                      Submit Task
                    </Button>
                  )

                ) : ('')}
              </CardRowLeft>
            </CardRow>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '300px',
                  margin: 'auto',
                }}
              >
                {/* <TwitterTweetEmbed options={{ theme: 'dark' }} tweetId={'1387487910870519810'} /> */}
                <Tweet
                  tweetId={tweetId ? tweetId : ''}
                  options={{
                    chrome: 'noheader, nofooter',
                    borderColor: '#12161c',
                    theme: 'dark',
                  }}
                />
              </div>
            </div>
          </CardBody>
        </InfoCard>
      ) : (
        ''
      )}

    </>
  )
};

export default Task;