import React, { useState, useRef } from 'react';

export default function usePostState(): {
  postState: {
    nickname: string;
    password: string;
    content: string;
  },
  setNickname: React.Dispatch<React.SetStateAction<string>>,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  setContent: React.Dispatch<React.SetStateAction<string>>
  } {
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const postState = {
    nickname,
    password,
    content,
  };
  return {
    postState, setNickname, setPassword, setContent,
  };
}
