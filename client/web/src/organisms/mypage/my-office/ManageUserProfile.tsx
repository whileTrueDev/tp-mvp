import React from 'react';
import moment from 'moment';
import {
  Typography, Avatar, Button, TextField, makeStyles,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { OpenInNew } from '@material-ui/icons';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import useDialog from '../../../utils/hooks/useDialog';
import PasswordChangeDialog from './sub/PasswordChangeDialog';
import EditableInput from './sub/EditableInput';
import EditableRadio from './sub/EditableGenderRadio';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import ProfileImageChangeDialog from './sub/ProfileImageChangeDialog';
import NickNameChangeDialog from './sub/NicknameChangeDialog';

const useStyles = makeStyles((theme) => ({
  container: { display: 'flex', alignItems: 'center', padding: theme.spacing(2) },
  labelField: { width: '230px', marginRight: theme.spacing(1) },
  avatar: { width: theme.spacing(6), height: theme.spacing(6) },
  textField: { minWidth: 300 },
  editButton: { marginLeft: theme.spacing(1) },
  caption: { padding: theme.spacing(2) },
}));

export interface UserProfileProps {
  userProfileData: User;
  doUserFetch: () => void;
}
export default function ManageUserProfile({
  userProfileData,
  doUserFetch,
}: UserProfileProps): JSX.Element {
  const classes = useStyles();
  const auth = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  // 비밀번호 변경 다이얼로그
  const passwordChangeDialog = useDialog();

  // 프로필 사진 변경 다이얼로그
  const profileImageChangeDialog = useDialog();

  // 닉네임 변경 다이얼로그
  const nickNameChangeDialog = useDialog();

  // 유저 정보 변경 요청 함수를 생성
  const [, updateRequest] = useAxios<number>({
    method: 'PATCH', url: 'users',
  }, { manual: true });

  // 실제 사용되는 유저 정보 변경 요청 함수
  async function editUserData(
    field: keyof Omit<UpdateUserDto, 'userId'>, value: string,
  ): Promise<any> {
    const data: UpdateUserDto = { userId: auth.user.userId, [field]: value };
    return updateRequest({ data })
      .then((res) => {
        doUserFetch();
        if (res.data) {
          ShowSnack('성공적으로 변경되었습니다.', 'success', enqueueSnackbar);
        } else {
          ShowSnack('유저 정보 변경중 문제가 발생했습니다.', 'error', enqueueSnackbar);
        }
      })
      .catch((err) => {
        console.error(err);
        ShowSnack('유저 정보 변경중 문제가 발생했습니다.', 'error', enqueueSnackbar);
      });
  }

  return (
    <>
      {/* 아이디 */}
      <div className={classes.container}>
        <Typography className={classes.labelField}>아이디</Typography>
        <TextField value={userProfileData.userId} disabled className={classes.textField} />
      </div>

      {/* 비밀번호 변경 */}
      <div className={classes.container}>
        <Typography className={classes.labelField}>비밀번호</Typography>
        <TextField value="********" disabled className={classes.textField} />
        <Button
          variant="contained"
          className={classes.editButton}
          onClick={passwordChangeDialog.handleOpen}
        >
          편집
          <OpenInNew fontSize="small" />
        </Button>
      </div>
      {/* 비밀번호 변경 다이얼로그 */}
      <PasswordChangeDialog
        open={passwordChangeDialog.open}
        onClose={passwordChangeDialog.handleClose}
      />

      {/* 프로필 사진 변경 */}
      <div className={classes.container}>
        <Typography className={classes.labelField}>
          대표 프로필 사진
        </Typography>
        <div className={classes.textField}>
          <Avatar src={userProfileData.profileImage || ''} className={classes.avatar} />
        </div>
        <Button variant="contained" className={classes.editButton} onClick={profileImageChangeDialog.handleOpen}>
          편집
          <OpenInNew fontSize="small" />
        </Button>
      </div>
      {/* 프로필 사진 변경 다이얼로그 */}
      <ProfileImageChangeDialog
        userProfileData={userProfileData}
        open={profileImageChangeDialog.open}
        onClose={profileImageChangeDialog.handleClose}
        onEdit={editUserData}
      />
      {/* 성별 */}
      <div className={classes.container}>
        <Typography className={classes.labelField}>성별</Typography>
        <EditableRadio
          id="gender"
          data={userProfileData.gender}
          onEdit={editUserData}
        />
      </div>

      {/* 이메일 변경 */}
      <div className={classes.container}>
        <div className={classes.labelField}>
          <Typography>이메일</Typography>
          <Typography variant="body2" color="textSecondary">중요 이메일을 여기로 발송합니다.</Typography>
        </div>
        <EditableInput
          data={userProfileData.mail}
          id="mail"
          type="email"
          helperText="중요 이메일을 여기로 발송합니다."
          onEdit={editUserData}
        />
      </div>

      {/* 닉네임 변경 */}
      <div className={classes.container}>
        <Typography className={classes.labelField}>닉네임</Typography>
        <TextField value={userProfileData.nickName || '아직 설정하지 않았습니다.'} disabled className={classes.textField} />
        <Button variant="contained" className={classes.editButton} onClick={nickNameChangeDialog.handleOpen}>
          편집
          <OpenInNew fontSize="small" />
        </Button>
      </div>
      {/* 닉네임 변경 다이얼로그 */}
      <NickNameChangeDialog
        userProfileData={userProfileData}
        open={nickNameChangeDialog.open}
        onClose={nickNameChangeDialog.handleClose}
        onEdit={editUserData}
      />

      <div className={classes.caption}>
        <Typography variant="caption">
          {`마지막 수정 : ${moment(userProfileData.updatedAt).fromNow()}`}
        </Typography>
      </div>
    </>
  );
}
