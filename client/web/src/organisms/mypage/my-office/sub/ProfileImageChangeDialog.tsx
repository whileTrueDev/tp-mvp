import {
  Avatar,
  Button, CircularProgress, Dialog,
  DialogActions, DialogContent, FormControl, FormControlLabel, makeStyles, Radio, RadioGroup, Typography,
} from '@material-ui/core';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { ProfileImages } from '@truepoint/shared/dist/res/ProfileImages.interface';
import useAxios from 'axios-hooks';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  titleSection: { padding: `${theme.spacing(2)}px ${theme.spacing(3)}px` },
  bold: { fontWeight: 'bold' },
  avatar: { marginRight: theme.spacing(1) },
  form: { display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  noPlatformHelperText: { display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  radioButton: { margin: theme.spacing(1) },
  radioContents: { display: 'flex', alignItems: 'center' },
}));

export interface ProfileImageChangeDialogProps {
  open: boolean;
  onClose: () => void;
  userProfileData: User;
  onEdit: (field: keyof Omit<UpdateUserDto, 'userId'>, value: string) => Promise<any>;
}
export default function ProfileImageChangeDialog({
  open, onClose, userProfileData, onEdit,
}: ProfileImageChangeDialogProps): JSX.Element {
  const classes = useStyles();

  // ***********************************
  // 플랫폼별 프로필 사진 목록 요청
  const [{ loading, data }] = useAxios<ProfileImages>({
    method: 'GET', url: '/users/profile-images',
  });

  // ***********************************
  // 선택된 프로필 사진 스테이트
  const [selectedProfileImage, setSelectedProfileImage] = React.useState(userProfileData.profileImage);

  // ***********************************
  // 대표 프로필 사진 변경 핸들러
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProfileImage((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock>
      <form onSubmit={(evt) => {
        evt.preventDefault();
        if (selectedProfileImage) onEdit('profileImage', selectedProfileImage);
      }}
      >
        <div className={classes.titleSection}>
          <Typography variant="h6" className={classes.bold}>대표 프로필 사진 변경</Typography>
          <Typography variant="body2">대표 프로필 사진을 선택해주세요.</Typography>
          <Typography color="textSecondary" variant="caption">연동한 플랫폼의 로고중에서 선택가능합니다.</Typography>
          <Typography color="textSecondary" variant="caption">아프리카TV의 경우 아직 지원하지 않습니다.</Typography>
        </div>

        <DialogContent>
          {loading && (<CircularProgress />)}
          <FormControl component="fieldset" className={classes.form}>
            <RadioGroup aria-label="profileImage" name="profileImage" value={selectedProfileImage} onChange={handleRadioChange}>
              {!loading && data.length === 0 && (
                <div className={classes.noPlatformHelperText}>
                  <Typography>아직 연동된 플랫폼이 없습니다.</Typography>
                  <Typography>내정보 관리 &gt; 플랫폼 연동을 먼저 진행해주세요.</Typography>
                </div>
              )}
              {!loading && data && data.map((profileImage) => (
                <FormControlLabel
                  className={classes.radioButton}
                  key={profileImage.platform}
                  value={profileImage.logo}
                  control={<Radio color="primary" />}
                  label={(
                    <div key={profileImage.platform} className={classes.radioContents}>
                      <Avatar src={profileImage.logo} className={classes.avatar} />
                      <Typography style={{ textTransform: 'capitalize' }}>
                        {profileImage.platform}
                      </Typography>
                      {profileImage.logo === userProfileData.profileImage && (
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
