import React from 'react';
import useAxios from 'axios-hooks';
import { AxiosError } from 'axios';

export interface SubscribeUserInfo {
  userId: string;
  targetUserId: string;
  startAt: string;
  endAt: string;
}

export interface SubscribeContextValue {
  currUser: SubscribeUserInfo;
  validSubscribeUserList: SubscribeUserInfo[];
  invalidSubscribeUserList: SubscribeUserInfo[];
  handleCurrTargetUser: (changeUser: SubscribeUserInfo) => void;
  handleLoginUserId: (userId: string) => void;
  error: AxiosError<any> | undefined;
  loading: boolean;
}

const defaultTargetUserValue = {
  userId: '',
  targetUserId: '',
  startAt: (new Date(0)).toISOString(),
  endAt: (new Date(0)).toISOString(),
};

const SubscribeContext = React.createContext<SubscribeContextValue>({
  currUser: defaultTargetUserValue,
  validSubscribeUserList: [],
  invalidSubscribeUserList: [],
  /* eslint-disable @typescript-eslint/no-empty-function */
  handleCurrTargetUser: () => {},
  handleLoginUserId: () => {},
  /* eslint-enable @typescript-eslint/no-empty-function */
  error: undefined,
  loading: false,
});

export function useSubscribe(): SubscribeContextValue {
  const [
    currUser,
    setCurrUser,
  ] = React.useState<SubscribeUserInfo>(defaultTargetUserValue);
  const [
    validSubscribeUserList,
    setValidSubscribeUSerList,
  ] = React.useState<SubscribeUserInfo[]>([]);
  const [
    invalidSubscribeUserList,
    setInvalidSubscribeUserList,
  ] = React.useState<SubscribeUserInfo[]>([]);

  const [loginUserId, setLoginUserId] = React.useState<string>('qjqdn1568');

  function handleLoginUserId(userId: string) {
    setLoginUserId(userId);
  }

  function handleCurrTargetUser(newTagetUser: SubscribeUserInfo) {
    setCurrUser(newTagetUser);
  }

  const [{ error, loading }, excuteGetSubscribeData] = useAxios<{
      validUserList: SubscribeUserInfo[];
      inValidUserList: SubscribeUserInfo[];}>({
        url: '/users/subscribe-users',
      }, { manual: true });

  React.useEffect(() => {
    excuteGetSubscribeData({
      params: {
        userId: loginUserId, // logined user id
      },
    }).then((res) => {
      setValidSubscribeUSerList(res.data.validUserList);
      setInvalidSubscribeUserList(res.data.inValidUserList);
      setCurrUser(res.data.validUserList[0]);
    });
  }, [excuteGetSubscribeData, loginUserId]);

  return {
    currUser,
    validSubscribeUserList,
    invalidSubscribeUserList,
    handleCurrTargetUser,
    handleLoginUserId,
    error,
    loading,
  };
}

export default SubscribeContext;
