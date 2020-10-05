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
  error: AxiosError<any> | undefined,
  loading: boolean,
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
  handleCurrTargetUser: () => {},
  error: undefined,
  loading: false
});

export function useSubscribe(): SubscribeContextValue {
  const [
    currUser,
    setCurrUser
  ] = React.useState<SubscribeUserInfo>(defaultTargetUserValue);
  const [
    validSubscribeUserList,
    setValidSubscribeUSerList
  ] = React.useState<SubscribeUserInfo[]>([]);
  const [
    invalidSubscribeUserList,
    setInvalidSubscribeUserList
  ] = React.useState<SubscribeUserInfo[]>([]);

  function handleCurrTargetUser(newTagetUser: SubscribeUserInfo) {
    setCurrUser(newTagetUser);
  }

  const [{ error, loading }, excuteGetSubscribeData] = useAxios<{
      validUserList:SubscribeUserInfo[],
      inValidUserList:SubscribeUserInfo[]}>({
        url: 'http://localhost:3000/users/subscribe-users',
      }, { manual: true });

  React.useEffect(() => {
    excuteGetSubscribeData({
      params: {
        userId: 'qjqdn1568', // logined user id
      }
    }).then((res) => {
      setValidSubscribeUSerList(res.data.validUserList);
      setInvalidSubscribeUserList(res.data.inValidUserList);
      setCurrUser(res.data.validUserList[0]);
    });
  }, [excuteGetSubscribeData]);

  return {
    currUser,
    validSubscribeUserList,
    invalidSubscribeUserList,
    handleCurrTargetUser,
    error,
    loading
  };
}

export default SubscribeContext;
