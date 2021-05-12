import React, { useCallback, useState } from 'react';

/**
 * CommunityPostWrite 컴포넌트에서
 * 글작성/수정 시 닉네임, 비밀번호, 제목 인풋 상태 저장하고 있는 훅
 */
export default function usePostState(): {
  titleValue: string;
  passwordValue: string;
  nicknameValue: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  } {
  const [titleValue, setTitle] = useState<string>('');
  const [passwordValue, setPassword] = useState<string>('');
  const [nicknameValue, setNickname] = useState<string>('');

  const onTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);
  const onNicknameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  }, []);
  const onPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  return {
    titleValue,
    setTitle,
    onTitleChange,
    passwordValue,
    onNicknameChange,
    nicknameValue,
    onPasswordChange,
  };
}
