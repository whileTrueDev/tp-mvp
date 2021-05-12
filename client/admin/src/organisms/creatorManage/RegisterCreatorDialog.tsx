import {
  Box, Button, Dialog, IconButton, makeStyles, MenuItem, Paper, Popper, Select, TextField, Typography,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import Alert from '@material-ui/lab/Alert';
import { RegisterUserByAdminDto } from '@truepoint/shared/dist/dto/users/registerUserByAdminDto.dto';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import knownCreators from '../../data/knownCreators210419.json';

const useStyles = makeStyles((theme) => ({
  textfield: {
    margin: theme.spacing(0.5, 0, 2, 0),
  },
  buttonset: {
    margin: theme.spacing(1, 0),
  },
}));

interface RegisterCreatorDialogProps {
  alreadyRegisteredUsers?: User[];
  reloadUsersData: any;
  open: boolean;
  onClose: () => void;
}

export default function RegisterCreatorDialog({
  open,
  onClose,
  alreadyRegisteredUsers,
  reloadUsersData,
}: RegisterCreatorDialogProps): React.ReactElement {
  const classes = useStyles();

  // *****************************************************************
  // anchor
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const helpOpen = Boolean(anchorEl);
  const helpOpenId = open ? 'simple-popper' : undefined;

  // ******************************************************************
  // Form
  const {
    control, handleSubmit, watch, setError, reset,
  } = useForm<RegisterUserByAdminDto>();
  const selectedPlatform = watch('platform');

  const handleDialogClose = () => {
    onClose();
    setAnchorEl(null);
    reset();
  };
  const [, register] = useAxios({ url: '/users/byadmin', method: 'post' }, { manual: true });
  // 폼 제출 핸들러
  function onSubmit(formData: Omit<RegisterUserByAdminDto, 'userId'>): any {
    if (alreadyRegisteredUsers && alreadyRegisteredUsers.map((x) => x.nickName).includes(formData.nickname)) {
      return setError('nickname', {
        message: `입력한 유저 <${formData.nickname}>는 이미 생성된 크리에이터입니다.`,
      });
    }
    let twitchCreatorId: string | undefined;
    if (formData.platform === 'twitch') {
      twitchCreatorId = knownCreators.data.find((x) => x.nickname === formData.nickname)?.creatorId;
      if (!twitchCreatorId) {
        return setError('nickname', {
          message: `입력한 유저 <${formData.nickname}>의 트위치 고유 ID를 알지 못하므로 진행할 수 없습니다. dan 에게 문의 바랍니다.`,
        });
      }
      if (!formData.logo.includes('300x300.')) {
        return setError('logo', {
          message: '로고 주소에는 300x300. 가 포함되어야 합니다.',
        });
      }
    }
    const dto: RegisterUserByAdminDto = {
      logo: formData.platform === 'twitch' ? formData.logo : `https://profile.img.afreecatv.com/LOGO/${formData.platformId.slice(0, 2)}/${formData.platformId}.jpg`,
      password: 'test',
      userId: formData.platformId,
      nickname: formData.nickname,
      platform: formData.platform,
      platformId: formData.platformId,
      twitchCreatorId,
    };
    return register({ data: dto }).then(() => {
      alert('크리에이터 생성 완료');
      reloadUsersData();
      handleDialogClose();
    }).catch((err) => {
      alert('크리에이터 생성 실패 콘솔을 확인하세요.');
      console.error('크리에이터 생성 실패 -', err);
    });
  }

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={handleDialogClose}
    >
      <Box padding={2}>
        <Typography variant="h6">새 크리에이터 생성</Typography>
      </Box>
      <Alert severity="error">
        <Typography variant="body2">크리에이터 생성시, 방송 및 채팅 데이터 수집 대상이 되고, 편집점 및 랭킹 등 방송 분석의 대상이 됩니다.</Typography>
        <Typography variant="body2">잘못된 정보 입력시, 시스템에 치명적인 오류를 일으킬 수 있으므로 신중히!! 작성해주시기 바랍니다.</Typography>
      </Alert>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} padding={2}>
        <div>
          <Typography>플랫폼명</Typography>
          <Controller
            name="platform"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: '필수값',
              },
            }}
            render={({ field, fieldState }) => (
              <div className={classes.textfield}>
                <Select
                  {...field}
                  error={!!fieldState.error}
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="twitch">트위치</MenuItem>
                  <MenuItem value="afreeca">아프리카</MenuItem>
                </Select>
                <Typography color="error" variant="caption" style={{ marginLeft: 8 }}>{fieldState.error ? fieldState.error.message : ''}</Typography>
              </div>
            )}
          />

          <Typography>채널명(닉네임)</Typography>
          <Controller
            name="nickname"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: '필수값',
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                error={!!fieldState.error}
                // eslint-disable-next-line no-nested-ternary
                helperText={fieldState.error
                  ? fieldState.error.message
                  : selectedPlatform === 'twitch' ? '채널명을 입력하세요. ex) 침착맨' : '채널명을 입력하세요. ex) 기뉴다'}
                className={classes.textfield}
                variant="outlined"
                fullWidth
              />
            )}
          />

          <Typography>크리에이터 아이디</Typography>
          <Controller
            name="platformId"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: '필수값',
              },
              pattern: {
                value: /^[a-zA-Z0-9+]*/,
                message: '크리에이터 아이디는 영문,숫자만 가능합니다.',
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className={classes.textfield}
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  // eslint-disable-next-line no-nested-ternary
                  fieldState.error
                    ? fieldState.error.message
                    : selectedPlatform === 'twitch' ? '아이디를입력하세요. 침착맨 -> zilioner' : '아이디를입력하세요. 기뉴다 -> arinbbidol'
                }
                fullWidth
              />
            )}
          />

          {selectedPlatform === 'twitch' && (
          <>
            <Typography>
              로고이미지
              <IconButton size="small" onClick={handleClick}>
                <HelpIcon
                  fontSize="small"
                  style={{ verticalAlign: 'middle' }}
                />
              </IconButton>
            </Typography>
            <Popper placement="top" open={helpOpen} id={helpOpenId} anchorEl={anchorEl} style={{ zIndex: 1500 }}>
              <Paper style={{ padding: 16, maxWidth: 400 }}>
                <Typography>크리에이터 채널의 [정보] 란에서, 로고를 [이미지 주소 복사]하고, 붙여넣어주세요.</Typography>
                <img src="/image/help_twitch_logo_extract.png" alt="" />
              </Paper>
            </Popper>
            <Controller
              name="logo"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  className={classes.textfield}
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error
                    ? fieldState.error.message
                    : 'profile_image-300x300.png 로 끝나는 로고이미지 주소를 입력하세요 ?를 클릭해 확인해보세요.'}
                  fullWidth
                />
              )}
            />
          </>
          )}
        </div>
        <div className={classes.buttonset}>
          <Button variant="contained" color="primary" type="submit">
            생성
          </Button>
        </div>
      </Box>
    </Dialog>
  );
}
