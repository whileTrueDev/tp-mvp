import { Button, Typography } from '@material-ui/core';
import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import useAuthContext from '../../../utils/hooks/useAuthContext';

export default function Settings(): JSX.Element {
  const auth = useAuthContext();
  const location = useLocation();

  const [linkedId, setLinkedId] = useState<string>();

  const [, linkToUserRequest] = useAxios({
    method: 'POST', url: '/auth/link',
  }, { manual: true });

  const [, linkDeleteRequest] = useAxios({
    method: 'DELETE', url: '/auth/link',
  }, { manual: true });

  useEffect(() => {
    // twitch로부터 받아온 연동된 유저 정보를 보내 Users 에 연동할 수 있도록 요청을 보낸다.
    if (location.search) {
      const params: { [key: string]: any } = location.search.substring(1)
        .split('&')
        .reduce((prev, current) => {
          const [key, value] = current.split('=');
          return {
            ...prev, [key]: value,
          };
        }, {});

      linkToUserRequest({ data: { ...params } })
        .then((res) => {
          setLinkedId(res.data[`${params.platform}Id`]);
        })
        .catch((err) => err.response.data);
    }
  }, [location.search, linkToUserRequest]);

  return (
    <MypageSectionWrapper>
      <div style={{ margin: 16 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            window.location.href = 'http://localhost:3000/auth/twitch';
          }}
        >
          트위치 연동 프론트에서 요청
        </Button>
        {linkedId && (
        <>
          <Typography>
            방금 연동된 Twitch 아이디:
            {' '}
            {linkedId}
          </Typography>

          <Button onClick={() => {
            linkDeleteRequest({
              data: { platform: 'twitch' },
            });
          }}
          >
            연동 제거
          </Button>
        </>
        )}
      </div>

      <div style={{ margin: 16 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            window.location.href = 'http://localhost:3000/auth/youtube';
          }}
        >
          유튜브 연동 프론트에서 요청
        </Button>

        {linkedId && (
        <>
          <Typography>
            방금 연동된 Youtube 아이디:
            {' '}
            {linkedId}
          </Typography>

          <Button onClick={() => {
            linkDeleteRequest({
              data: { platform: 'youtube' },
            });
          }}
          >
            연동 제거
          </Button>
        </>
        )}
      </div>

      <div style={{ margin: 16 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            window.location.href = `http://localhost:3000/auth/afreeca?__userId=${auth.user.userId}`;
          }}
        >
          아프리카 연동 프론트에서 요청
        </Button>

        {linkedId && (
        <>
          <Typography>
            방금 연동된 Afreeca 아이디:
            {' '}
            {linkedId}
          </Typography>

          {/* <Button onClick={() => {
            linkDeleteRequest({
              data: { platform: 'youtube' },
            });
          }}
          >
            연동 제거
          </Button> */}
        </>
        )}
      </div>
    </MypageSectionWrapper>
  );
}
