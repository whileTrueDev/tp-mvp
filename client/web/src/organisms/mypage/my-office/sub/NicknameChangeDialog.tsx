import {
  Button, CircularProgress, Dialog,
  DialogActions, DialogContent, FormControl, FormControlLabel, makeStyles, Radio, RadioGroup, Typography,
} from '@material-ui/core';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { ChannelNames } from '@truepoint/shared/dist/res/ChannelNames.interface';
import useAxios from 'axios-hooks';
import React, { useEffect } from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme) => ({
  titleSection: { padding: `${theme.spacing(2)}px ${theme.spacing(3)}px` },
  refresh: { margin: `0px ${theme.spacing(2)}px`, textAlign: 'right' },
  bold: { fontWeight: 'bold' },
  avatar: { marginRight: theme.spacing(1) },
  form: { display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  noPlatformHelperText: { display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  radioButton: { margin: theme.spacing(1) },
  radioContents: { display: 'flex', alignItems: 'center' },
  imglogo: { width: theme.spacing(4), height: theme.spacing(4), marginRight: theme.spacing(1) },
}));

export interface NickNameChangeDialogProps {
  open: boolean;
  onClose: () => void;
  userProfileData: User;
  onEdit: (field: keyof Omit<UpdateUserDto, 'userId'>, value: string) => Promise<any>;
}
export default function NickNameChangeDialog({
  open, onClose, userProfileData, onEdit,
}: NickNameChangeDialogProps): JSX.Element {
  const classes = useStyles();

  // ***********************************
  // 플랫폼별 프로필 사진 목록 요청
  const [{ loading, data }, refetch] = useAxios<ChannelNames>({
    method: 'GET', url: '/users/platform-names',
  });
  useEffect(() => {
    if (userProfileData) {
      refetch();
    }
  }, [userProfileData, refetch]);

  // ***********************************
  // 선택된 프로필 사진 스테이트
  const [selectedNickName, setselectedNickName] = React.useState(userProfileData.nickName);

  // ***********************************
  // 대표 프로필 사진 변경 핸들러
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setselectedNickName((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock>
      <form onSubmit={(evt) => {
        evt.preventDefault();
        if (selectedNickName) onEdit('nickName', selectedNickName);
      }}
      >
        <div className={classes.titleSection}>
          <Typography variant="h6" className={classes.bold}>닉네임 변경</Typography>
          <Typography variant="body2">닉네임을 선택해주세요.</Typography>
          <Typography color="textSecondary" variant="caption">연동한 플랫폼의 채널명 중 선택가능합니다.</Typography>
          <Typography color="textSecondary" variant="caption">아프리카TV의 경우 아직 지원하지 않습니다.</Typography>
        </div>

        <div className={classes.refresh}>
          <Button
            color="primary"
            onClick={() => {
              refetch();
            }}
          >
            <RefreshIcon fontSize="small" />
            새로고침
          </Button>
        </div>

        <DialogContent>
          {loading && (<CircularProgress />)}
          <FormControl component="fieldset" className={classes.form}>
            <RadioGroup aria-label="nickName" name="nickName" value={selectedNickName} onChange={handleRadioChange}>
              {!loading && data.length === 0 && (
                <div>
                  <Typography className={classes.bold}>아직 연동된 플랫폼이 없습니다.</Typography>
                  <Typography color="textSecondary">내정보 관리 &gt; 플랫폼 연동을 먼저 진행해주세요.</Typography>
                </div>
              )}
              {!loading && data && data.map((channelName) => (
                <FormControlLabel
                  className={classes.radioButton}
                  key={channelName.platform}
                  value={channelName.nickName}
                  control={<Radio color="primary" />}
                  label={(
                    <div key={channelName.platform} className={classes.radioContents}>
                      <img src={`/images/logo/${channelName.platform}Logo.png`} alt="" className={classes.imglogo} />
                      <Typography>
                        {channelName.nickName}
                      </Typography>
                      {channelName.nickName === userProfileData.nickName && (
                      <Typography className={classes.bold}>
                        &nbsp;[현재 사용중]
                      </Typography>
                      )}
                    </div>
                  )}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              onClose();
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={(loading || (!loading && data.length === 0))}
          >
            변경
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
