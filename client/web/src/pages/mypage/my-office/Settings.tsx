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
import { Refresh } from '@material-ui/icons';
import { useMutation, useQuery } from 'react-query';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import ManagePlatformLink from '../../../organisms/mypage/my-office/ManagePlatformLink';
import ManageUserProfile from '../../../organisms/mypage/my-office/ManageUserProfile';
import SectionTitle from '../../../organisms/shared/sub/SectionTitles';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import DeleteUser from '../../../organisms/mypage/my-office/DeleteUser';
import transformIdToAsterisk from '../../../utils/transformAsterisk';
import getJosa from '../../../utils/getJosa';
import PlatformLinkErrorAlert from '../../../organisms/mypage/my-office/PlatformLinkErrorAlert';
import useScrollTop from '../../../utils/hooks/useScrollTop';
import axios from '../../../utils/axios';

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
  const { data, isFetching: loading, refetch: doUserFetch } = useQuery('user',
    async () => {
      const response = await axios.get<User>('/users');
      return response.data;
    });

  // ******************************************
  // 유저 - 플랫폼 연동 정보 생성
  const location = useLocation();

  // 연동하고자 하는 계정이 이미 다른 사람에게 연동된 경우 에러 처리를 위한 스테이트
  const [alreadyLinkedWithOther, setAlreadyLinkedWithOther] = useState('');
  // ******************************************
  // 연동 요청
  const { mutateAsync: linkToUserRequest } = useMutation(
    async (params: { [key: string]: any }) => {
      const { data: resData } = await axios.post<LinkPlatformRes>('/auth/link', params);
      return resData;
    },
  );

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

      // 아프리카 링크 작업 중 백엔드에서 에러 발생한 경우
      if (Object.prototype.hasOwnProperty.call(params, 'error')) {
        if (params.error === 'linked-with-other') {
          setAlreadyLinkedWithOther(
            `현재 연동하고자 하는 ${params.platform ? capitalize(params.platform) : ''} 계정이 다른 유저에게 연동되어있습니다.`,
          );
        }
      } else {
        // 플랫폼 연동 요청 -> callback으로 부터 url 파라미터로 에러가 오지 않은 경우
        // 즉, 연동 정보는 DB에 있음. -> 유저와 링크할 차례.
        linkToUserRequest({ ...params })
          .then((res) => {
          // 이미 같은 플랫폼/고유아이디로 연동되어있는 경우는 제외.
            if (!(res === 'already-linked')) {
              doUserFetch(); // 링크 성공
              ShowSnack(`${capitalize(params.platform)} 성공적으로 연동되었습니다.`, 'success', enqueueSnackbar);
            }
          })
          .catch((err) => {
            if (err && err.response && err.response.data.message === 'linked-with-other') {
              const { data: { platformUserName, userId } } = err.response.data as LinkPlatformError;
              // 연동하고자 하는 플랫폼계정이 다른 유저에게 연동되어 있는 경우 에러 처리
              setAlreadyLinkedWithOther(
                `현재 연동하고자 하는 ${capitalize(params.platform)} 계정 ${`"${platformUserName}"${getJosa(platformUserName, '은/는')}`}
              다른 유저 "${transformIdToAsterisk(userId, 1.8)}" 에게 연동되어있습니다.`,
              );
            }
            ShowSnack('연동과정에서 오류가 발생했습니다. 문의바랍니다.', 'error', enqueueSnackbar);
          });
      }
    }
  }, [enqueueSnackbar, location.search, linkToUserRequest, doUserFetch]);

  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
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
            <Typography variant="caption" color="textSecondary">
              아프리카TV의 경우 아직 연동 기능을 제공하지 않습니다. 아프리카TV 방송 데이터를 연동하고싶으신 분은 우측 아래 버튼으로 카카오톡 문의부탁드립니다.
            </Typography>
          </div>
          {!!alreadyLinkedWithOther && (
            <PlatformLinkErrorAlert
              text={alreadyLinkedWithOther}
              onConfirmClick={() => {
                setAlreadyLinkedWithOther('');
              }}
            />
          )}
          {!loading ? (
            <ManagePlatformLink
              twitchId={data?.twitch?.twitchId}
              afreecaId={data?.afreeca?.afreecaId}
              youtubeId={data?.youtube?.youtubeId}
              userDataRefetch={doUserFetch}
            />
          ) : (<CircularProgress />)}
        </Paper>

        {/* 내 정보 관리 */}
        <Paper elevation={0} variant="outlined" className={classnames(classes.container, classes.second)}>
          <div className={classes.content}>
            <SectionTitle mainTitle="내 정보 관리" />
          </div>
          {!loading ? (
            <>
              <div className={classes.content}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    doUserFetch();
                  }}
                >
                  <Refresh fontSize="small" />
                  새로고침
                </Button>
              </div>
              {data && (
                <ManageUserProfile userProfileData={data} doUserFetch={doUserFetch} />
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
