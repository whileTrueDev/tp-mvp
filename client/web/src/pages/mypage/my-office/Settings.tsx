import useAxios from 'axios-hooks';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import {
  Button,
  capitalize,
  CircularProgress,
  makeStyles,
  Paper, Typography,
} from '@material-ui/core';
import { LinkPlatformError, LinkPlatformRes } from '@truepoint/shared/dist/res/LinkPlatformRes.interface';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Alert } from '@material-ui/lab';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import ManagePlatformLink from '../../../organisms/mypage/my-office/ManagePlatformLink';
import ManageUserProfile from '../../../organisms/mypage/my-office/ManageUserProfile';
import SectionTitle from '../../../organisms/shared/sub/SectionTitles';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import DeleteUser from '../../../organisms/mypage/my-office/DeleteUser';
import transformIdToAsterisk from '../../../utils/transformAsterisk';

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(6) },
  second: { marginTop: theme.spacing(2) },
  content: { padding: theme.spacing(2) },
}));
export default function Settings(): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // ******************************************
  // 유저 정보 조회
  const [userDataRequest, doUserFetch] = useAxios<User>({
    method: 'get', url: '/users',
  });

  // ******************************************
  // 유저 - 플랫폼 연동 정보 생성
  const location = useLocation();

  // 연동하고자 하는 계정이 이미 다른 사람에게 연동된 경우 처리를 위한 스테이트
  const [alreadyLinkedWithOther, setAlreadyLinkedWithOther] = useState('');
  // ******************************************
  // 연동 요청
  const [, linkToUserRequest] = useAxios<LinkPlatformRes>({
    method: 'POST', url: '/auth/link',
  }, { manual: true });
  // 연동 작업
  useEffect(() => {
    // Youtb,Twit,Afree플랫폼으로부터 받아온 연동된 유저 정보를 보내 Users 에 연동할 수 있도록 요청을 보낸다.
    if (location.search) {
      const params: { [key: string]: any } = location.search.substring(1)
        .split('&')
        .reduce((prev, current) => {
          const [key, value] = current.split('=');
          return { ...prev, [key]: value };
        }, {});

      linkToUserRequest({ data: { ...params } })
        .then((res) => {
          // 이미 같은 플랫폼/고유아이디로 연동되어있는 경우는 제외.
          if (!(res.data === 'already-linked')) {
            doUserFetch(); // 링크 성공
            ShowSnack(`${capitalize(params.platform)} 성공적으로 연동되었습니다.`, 'success', enqueueSnackbar);
          }
        })
        .catch((err) => {
          if (err && err.response && err.response.data.message === 'linked-with-other') {
            const { data } = err.response.data as LinkPlatformError;
            const { platformUserName, userId } = data;
            // 연동하고자 하는 플랫폼계정이 다른 유저에게 연동되어 있는 경우
            setAlreadyLinkedWithOther(
              `현재 연동하고자 하는 ${capitalize(params.platform)} 계정 "${platformUserName}" 은(는)
              다른 유저 "${transformIdToAsterisk(userId, 1.8)}" 에게 연동되어있습니다.`,
            );
          }
          ShowSnack('연동과정에서 오류가 발생했습니다. 문의바랍니다.', 'error', enqueueSnackbar);
        });
    }
  }, [enqueueSnackbar, location.search, linkToUserRequest, doUserFetch]);

  return (
    <>
      <MypageSectionWrapper>
        {/* 플랫폼 연동 관리 */}
        <Paper elevation={0} variant="outlined" className={classes.container}>
          <div className={classes.content}>
            <SectionTitle mainTitle="플랫폼 연동 관리" />
            <Typography variant="body2" color="textSecondary">
              플랫폼 연동을 통해 트루포인트를 바로 시작해보세요.
            </Typography>
          </div>
          {!!alreadyLinkedWithOther && (
            <Alert severity="error">
              <Typography variant="body2">{alreadyLinkedWithOther}</Typography>
              <Typography variant="body2">자신의 아프리카/트위치/유튜브 계정이 타인의 아이디에 연동되어 있는 경우 문의바랍니다.</Typography>
              <Button
                style={{ margin: 8 }}
                onClick={() => {
                  window.open('http://google.com'); // 카카오 문의로 연결 필요
                }}
                size="small"
                color="primary"
                variant="contained"
              >
                문의하기
              </Button>
              <Button
                style={{ margin: 8 }}
                onClick={() => {
                  setAlreadyLinkedWithOther('');
                }}
                size="small"
                color="primary"
                variant="contained"
              >
                확인
              </Button>
            </Alert>
          )}
          {!userDataRequest.loading ? (
            <ManagePlatformLink
              twitchId={userDataRequest.data?.twitchId}
              afreecaId={userDataRequest.data?.afreecaId}
              youtubeId={userDataRequest.data?.youtubeId}
              userDataRefetch={doUserFetch}
            />
          ) : (<CircularProgress />)}
        </Paper>

        {/* 내 정보 관리 */}
        <Paper elevation={0} variant="outlined" className={classnames(classes.container, classes.second)}>
          <div className={classes.content}>
            <SectionTitle mainTitle="내 정보 관리" />
          </div>
          {!userDataRequest.loading ? (
            <>
              {userDataRequest.data && (
              <ManageUserProfile
                userProfileData={userDataRequest.data}
                doUserFetch={doUserFetch}
              />
              )}
            </>
          ) : (<CircularProgress />)}
        </Paper>
      </MypageSectionWrapper>
      <MypageSectionWrapper>
        <DeleteUser />
      </MypageSectionWrapper>
    </>
  );
}
