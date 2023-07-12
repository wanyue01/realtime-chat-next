'use client'

import { FC } from 'react';
import { SessionProvider } from 'next-auth/react';

interface AuthContextProps {
  children: React.ReactNode;
};

const AuthContext: FC<AuthContextProps> = ({children}) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};

export default AuthContext;