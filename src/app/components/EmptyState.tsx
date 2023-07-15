'use client'

import { Empty } from 'antd';
import { FC } from 'react';

interface EmptyStateProps {};

const EmptyState: FC<EmptyStateProps> = ({}) => {
  return (
    <div
      className='px-4 py-10 sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-100'
    >
      <div className='text-center items-center flex flex-col'>
        <Empty description={false} />
      </div>
    </div>
  );
};

export default EmptyState;