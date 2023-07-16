'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FC, useState, useCallback } from 'react';
import service from '@/app/utils/interceptor';
import Avatar from '@/app/components/Avatar';
import { notification } from 'antd';
import LoadingModal from '@/app/components/LoadingModal';

interface UserBoxProps {
  data: User;
};

const UserBox: FC<UserBoxProps> = ({
  data,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await service.post('/api/conversations', {
        userId: data.id,
      });
      if (result.data.respCode === 0) {
        router.push(`/conversations/${result.data.data.id}`);
      } else {
        notification.error({
          message: result?.data?.message || '出错了',
        });
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }

  }, [data, router]);

  return (
    <>
      {isLoading && (
        <LoadingModal />
      )}
      <div
        onClick={handleClick}
        className='
        w-full
        relative
        flex
        items-center
        space-x-3
        bg-white
        p-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
      '
      >
        <Avatar user={data} />
        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <div
              className='
              flex
              justify-between
              items-center
              mb-1
            '
            >
              <p
                className='
                text-sm
                font-medium
                text-gray-900
              '
              >
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;