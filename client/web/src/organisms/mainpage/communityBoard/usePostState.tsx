import React, { useCallback, useState } from 'react';

export default function usePostState(): {
  initialContent: string;
  titleValue: string;
  passwordValue: string;
  nicknameValue: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setInitialContent: React.Dispatch<React.SetStateAction<string>>;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  } {
  const [initialContent, setInitialContent] = useState<string>('');
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
    initialContent,
    setInitialContent,
    titleValue,
    setTitle,
    onTitleChange,
    passwordValue,
    onNicknameChange,
    nicknameValue,
    onPasswordChange,
  };
}
