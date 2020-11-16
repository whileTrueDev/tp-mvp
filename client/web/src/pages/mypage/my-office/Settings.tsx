import {
  Avatar, Button, Paper, TextField, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import SectionTitle from '../../../organisms/shared/sub/SectionTitles';
import useAuthContext from '../../../utils/hooks/useAuthContext';

export default function Settings(): JSX.Element {
  // const theme = useTheme();
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
      <Paper elevation={0} variant="outlined" style={{ padding: 48 }}>

        <div style={{ padding: 16 }}>
          <SectionTitle mainTitle="내 정보 관리" />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', padding: 16,
        }}
        >

          <div style={{ width: '200px', marginRight: 8 }}>
            <Typography>
              프로필 사진
            </Typography>
          </div>
          <div style={{ width: '100%' }}>
            <Avatar style={{ width: 48, height: 48, marginRight: 16 }} />
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', padding: 16,
        }}
        >
          <div style={{ width: '200px', marginRight: 8 }}>
            <Typography>아이디</Typography>
          </div>
          <div style={{ width: '100%' }}>
            <TextField value="hwasurr" disabled style={{ minWidth: 300 }} />
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', padding: 16,
        }}
        >
          <div style={{ width: '200px', marginRight: 8 }}>
            <Typography>이메일</Typography>
          </div>
          <div style={{ width: '100%' }}>
            <TextField value="something@something.gosomething@something.gosomething@something.gosomething@something.go" disabled style={{ width: 300 }} />
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', padding: 16,
        }}
        >
          <div style={{ width: '200px', marginRight: 8 }}>
            <Typography>닉네임</Typography>
          </div>
          <div style={{ width: '100%' }}>
            <TextField value="BJ닉네임/TwitchName" disabled style={{ minWidth: 300 }} />
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', padding: 16,
        }}
        >
          <div style={{ width: '200px', marginRight: 8 }}>
            <Typography>비밀번호</Typography>
          </div>
          <div style={{ width: '100%' }}>
            <TextField value="비밀번호" disabled style={{ minWidth: 300 }} />
          </div>
        </div>

        {/* 버튼 셋 */}
        <div style={{
          display: 'flex', alignItems: 'center', padding: 16,
        }}
        >
          <div style={{ width: '200px', marginRight: 8 }}>
            <Button variant="contained" color="primary">
              변경 저장하기
            </Button>
          </div>
        </div>
      </Paper>

      <Paper elevation={0} variant="outlined" style={{ marginTop: 16, padding: 48 }}>
        <div style={{ padding: 16 }}>
          <SectionTitle mainTitle="플랫폼 연동 관리" />
        </div>

        <div style={{ margin: 16 }}>
          <Avatar src="/images/logo/twitchLogo.png" />
          <Typography>트위치</Typography>
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
          <Avatar src="/images/logo/youtubeLogo.png" />
          <Typography>유튜브</Typography>
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
          <Avatar src="/images/logo/afreecaLogo.png" />
          <Typography>아프리카 TV</Typography>
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
      </Paper>
    </MypageSectionWrapper>
  );
}
