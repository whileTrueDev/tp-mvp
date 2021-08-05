import React, { useRef } from 'react';
import {
  Button,
  InputLabel, TextField,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useStyle } from './styles/UpdateUserInfoDialog.style';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import { useMutateNickname } from '../../../utils/hooks/mutation/useMutateUserInfo';

interface NickNameInputProps{
  setHiddenFlag: React.Dispatch<React.SetStateAction<boolean>>,
}

// 닉네임을 check하는 함수
const checkNickname = (inputRef: React.RefObject<HTMLInputElement>): string => {
  // 입력된 닉네임이 유효한지 확인
  if (!inputRef.current) return '';
  const newNickname = inputRef.current.value.trim();
  if (newNickname.length < 2 || newNickname.length > 30) return '';
  return newNickname;
};

export default function NickNameInput(props: NickNameInputProps): JSX.Element {
  const { setHiddenFlag } = props;
  const { user, setUser } = useAuthContext();
  const classes = useStyle();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: changeNickname } = useMutateNickname();

  // 닉네임을 변경하는 함수
  const handleChangeNickname = () => {
    // 입력된 닉네임이 유효한지 확인
    const nickName = checkNickname(inputRef);
    if (!user.userId || !nickName) return;

    // 변경요청
    changeNickname({ userId: user.userId, nickName })
      .then(() => {
        setUser((prevUser) => ({ ...prevUser, nickName }));
        ShowSnack('닉네임이 성공적으로 변경되었습니다.', 'success', enqueueSnackbar);
        setHiddenFlag(false);
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 409) { // nickname conflict
          ShowSnack('중복된 닉네임입니다. 다른 닉네임을 사용해주세요.', 'error', enqueueSnackbar);
        } else {
          ShowSnack('닉네임 변경 중 오류가 발생했습니다. 문의 부탁드립니다.', 'error', enqueueSnackbar);
        }
        setHiddenFlag(false);
      });
  };

  return (
    <div className={classes.nickInput}>
      <InputLabel shrink>변경할 닉네임을 입력해주세요</InputLabel>
      <TextField
        margin="dense"
        size="small"
        autoComplete="off"
        autoFocus
        inputProps={{ required: true, minLength: 8, maxLength: 16 }}
        inputRef={inputRef}
      />
      <div>
        <Button
          variant="contained"
          className={classes.optionButton}
          onClick={() => {
            setHiddenFlag(false);
          }}
        >
          변경취소
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.optionButton}
          onClick={handleChangeNickname}
        >
          변경하기
        </Button>
      </div>
    </div>
  );
}
