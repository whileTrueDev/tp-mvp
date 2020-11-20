import {
  Avatar, Button, capitalize, makeStyles, Typography,
} from '@material-ui/core';
import { Check, OpenInNew } from '@material-ui/icons';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Platform } from '@truepoint/shared/dist/interfaces/Platform.interface';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import useDialog from '../../../utils/hooks/useDialog';
import PlatformDeleteConfirmDialog from './sub/PlatformDeleteConfirmDialog';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
  },
  label: { display: 'flex', alignItems: 'center' },
  avatar: { marginRight: theme.spacing(1) },
}));

export interface ManagePlatformLinkProps {
  twitchId?: string;
  afreecaId?: string;
  youtubeId?: string;
  userDataRefetch: () => void;
}
export default function ManagePlatformLink({
  twitchId,
  afreecaId,
  youtubeId,
  userDataRefetch,
}: ManagePlatformLinkProps): JSX.Element {
  const auth = useAuthContext();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // *******************************
  // 연동 "제거" 요청
  const [, linkDeleteRequest] = useAxios({
    method: 'DELETE', url: '/auth/link',
  }, { manual: true });

  // 연동 해제 버튼 핸들러
  function handleLinkDelete(platform: Platform) {
    linkDeleteRequest({ data: { platform } })
      .then(() => {
        userDataRefetch();
        ShowSnack(`${capitalize(platform)} 연동 해제 되었습니다.`, 'success', enqueueSnackbar);
      })
      .catch(() => ShowSnack(`${capitalize(platform)} 연동 해제중 오류가 발생했습니다. 문의바랍니다.`, 'error', enqueueSnackbar));
  }

  // *******************************
  // 연동 요청
  function handleLinkStart(platform: Platform) {
    let params = platform;
    if (platform === 'afreeca') params += `?__userId=${auth.user.userId}`;
    window.location.href = `http://localhost:3000/auth/${params}`;
  }

  // *******************************
  // 연동 해제 확인 다이얼로그
  const confirmDialog = useDialog();

  // 선택된 플랫폼 정보 스테이트
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | undefined>();
  function handlePlatformSelect(platform: Platform) {
    setSelectedPlatform(platform);
  }

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.label}>
          <Avatar src="/images/logo/twitchLogo.png" className={classes.avatar} />
          <Typography>트위치</Typography>
          {twitchId && (<Check color="primary" />)}
        </div>

        <div>
          {twitchId ? (
            <Button
              variant="contained"
              onClick={() => {
                confirmDialog.handleOpen();
                handlePlatformSelect('twitch');
              }}
            >
              연동 해제
            </Button>
          ) : (
            <Button color="primary" variant="contained" onClick={() => handleLinkStart('twitch')}>
              연동 하기
              <OpenInNew fontSize="small" />
            </Button>
          )}
        </div>
      </div>

      <div className={classes.container}>
        <div className={classes.label}>
          <Avatar src="/images/logo/afreecaLogo.png" className={classes.avatar} />
          <Typography>아프리카 TV</Typography>
          {afreecaId && (<Check color="primary" />)}
        </div>

        <div>
          {afreecaId ? (
            <Button
              variant="contained"
              onClick={() => {
                confirmDialog.handleOpen();
                handlePlatformSelect('afreeca');
              }}
            >
              연동 해제
            </Button>
          ) : (
            <Button color="primary" variant="contained" onClick={() => handleLinkStart('afreeca')}>
              연동 하기
              <OpenInNew fontSize="small" />
            </Button>
          )}
        </div>
      </div>

      <div className={classes.container}>
        <div className={classes.label}>
          <Avatar src="/images/logo/youtubeLogo.png" className={classes.avatar} />
          <Typography>유튜브</Typography>
          {youtubeId && (<Check color="primary" />)}
        </div>

        <div>
          {youtubeId ? (
            <Button
              variant="contained"
              onClick={() => {
                confirmDialog.handleOpen();
                handlePlatformSelect('youtube');
              }}
            >
              연동 해제
            </Button>
          ) : (
            <Button color="primary" variant="contained" onClick={() => handleLinkStart('youtube')}>
              연동 하기
              <OpenInNew fontSize="small" />
            </Button>
          )}
        </div>
      </div>

      {selectedPlatform && (
      <PlatformDeleteConfirmDialog
        platform={selectedPlatform}
        open={confirmDialog.open}
        onClose={confirmDialog.handleClose}
        confirmCallback={handleLinkDelete}
      />
      )}

    </div>
  );
}
