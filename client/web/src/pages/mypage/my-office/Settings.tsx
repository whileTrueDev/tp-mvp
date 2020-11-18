import useAxios from 'axios-hooks';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import {
  CircularProgress,
  makeStyles,
  Paper, Typography,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import ManagePlatformLink from '../../../organisms/mypage/my-office/ManagePlatformLink';
import ManageUserProfile from '../../../organisms/mypage/my-office/ManageUserProfile';
import SectionTitle from '../../../organisms/shared/sub/SectionTitles';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import DeleteUser from '../../../organisms/mypage/my-office/DeleteUser';

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

  // ******************************************
  // 연동 요청
  const [, linkToUserRequest] = useAxios({
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
          doUserFetch(); // 링크 성공
          ShowSnack('성공적으로 연동되었습니다.', 'success', enqueueSnackbar);
        })
        .catch((err) => {
          ShowSnack('연동과정에서 오류가 발생했습니다. 문의바랍니다.', 'error', enqueueSnackbar);
          console.error(err.response.data);
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
          {!userDataRequest.loading ? (
            <ManagePlatformLink
              twitchId={userDataRequest.data.twitchId}
              afreecaId={userDataRequest.data.afreecaId}
              youtubeId={userDataRequest.data.youtubeId}
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
            <ManageUserProfile
              userProfileData={userDataRequest.data}
              doUserFetch={doUserFetch}
            />
          ) : (<CircularProgress />)}
        </Paper>
      </MypageSectionWrapper>
      <MypageSectionWrapper>
        <DeleteUser />
      </MypageSectionWrapper>
    </>
  );
}
