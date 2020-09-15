import React from 'react';
import AuthContext, { AuthContextValue } from '../contexts/AuthContext';

export default function useAuthContext(): AuthContextValue {
  return React.useContext(AuthContext);
}
