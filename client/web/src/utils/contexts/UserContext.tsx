import React from 'react';

export interface SubscribeUserInfo {
  userId: string;
  targetUserId: string;
}

export interface TargetUserValue {
  subscribeUserInfo: SubscribeUserInfo;
  handleUser: (newTagetUser: SubscribeUserInfo) => void;
}

const defaultTargetUserValue = {
  userId: '', targetUserId: '',
};

const UserContext = React.createContext<TargetUserValue>({
  subscribeUserInfo: defaultTargetUserValue,
  handleUser: () => {}
});

export function useUser(): TargetUserValue {
  const [subscribeUser, setSubscribeUser] = React.useState<SubscribeUserInfo>(defaultTargetUserValue);

  function handleUser(newTagetUser: SubscribeUserInfo) {
    setSubscribeUser(newTagetUser);
  }

  return {
    subscribeUserInfo: subscribeUser,
    handleUser
  };
}

export default UserContext;
