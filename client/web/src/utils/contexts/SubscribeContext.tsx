import React from 'react';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import axios from '../axios';

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
  error: AxiosError<any> | null;
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
  error: null,
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

  const { error, isFetching: loading } = useQuery<
  {
    validUserList: SubscribeUserInfo[];
    inValidUserList: SubscribeUserInfo[];},
    AxiosError
  >(
    'subscribe-users',
    async () => {
      const { data } = await axios.get('/users/subscribe-users', {
        params: { userId: loginUserId },
      });
      return data;
    },
    {
      enabled: !!loginUserId,
      onSuccess: (subscribeData) => {
        setValidSubscribeUSerList(subscribeData.validUserList);
        setInvalidSubscribeUserList(subscribeData.inValidUserList);
        setCurrUser(subscribeData.validUserList[0]);
      },
    },
  );

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
