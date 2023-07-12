'use client'

import { signOut } from 'next-auth/react';
import { FC } from 'react';
import EmptyState from '../components/EmptyState';

interface PageProps {};

const Page: FC<PageProps> = ({}) => {
  return (
    <div className='hidden lg:block lg:pl-80 h-full'>
      <EmptyState />
    </div>
  );
};

export default Page;