import React, { useState } from 'react';
import {
  Button,
  DialogActions, Dialog, DialogContent, DialogTitle,
} from '@material-ui/core';
import { useStyle } from './styles/UpdateUserInfoDialog.style';
import PasswordChangeDialog from '../my-office/sub/PasswordChangeDialog';
import NickNameInput from './NickNameInput';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import TitleWithLogo from './TitleWithLogo';
import useDialog from '../../../utils/hooks/useDialog';

export interface UpdateDialogProps{
  open: boolean;
  onClose: () => void;
}

// 유저 정보 수정 버튼 클릭시 나오는 다이얼로그
export default function UpdateUserInfoDialog(props: UpdateDialogProps): JSX.Element {
  const { open, onClose } = props;
  const classes = useStyle();
  const { user } = useAuthContext();
  const [hiddenFlag, setHiddenFlag] = useState<boolean>(false);
  const { open: isPasswordDialogOpen, handleClose: closePasswordDialog, handleOpen: OpenPasswordDialog } = useDialog();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" disableScrollLock disableBackdropClick>
      <DialogTitle>
        <TitleWithLogo text="내 정보 관리" />
      </DialogTitle>
      <DialogContent>
        {/* <Typography>변경할 닉네임을 입력해주세요</Typography>
        <input ref={inputRef} minLength={2} maxLength={30} /> */}
        <div className={classes.contents}>
          <div className={classes.thead}>
            닉네임
          </div>
          <div className={classes.tbody}>
            {user.nickName}
            <div className={classes.tsub}>
              트루포인트 서비스에서 활동하는데 사용할 닉네임입니다.
            </div>
            {!hiddenFlag ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setHiddenFlag(true);
                }}
                className={classes.tbutton}
              >
                변경
              </Button>
            ) : (
              <NickNameInput setHiddenFlag={setHiddenFlag} />
            )}
          </div>
          <div className={classes.thead}>
            이메일
          </div>
          <div className={classes.tbody}>
            {user.mail}
            <div className={classes.tsub}>
              트루포인트 서비스 안내에 사용할 이메일 주소입니다.
            </div>
          </div>
          <div className={classes.thead}>
            비밀번호
          </div>
          <div className={classes.tbody}>
            ****
            <div className={classes.tsub}>
              보안을 위해 4자리만 표시됩니다.
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={OpenPasswordDialog}
              className={classes.tbutton}
            >
              변경
            </Button>
          </div>
        </div>
        <PasswordChangeDialog open={isPasswordDialogOpen} onClose={closePasswordDialog} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
