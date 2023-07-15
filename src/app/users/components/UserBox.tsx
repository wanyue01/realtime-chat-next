'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FC, useState, useCallback } from 'react';
import service from '@/app/utils/interceptor';
import Avatar from '@/app/components/Avatar';

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
    const result = await service.post('/api/conversations', {
      userId: data.id,
    });
    // console.log(result);
    router.push(`/conversations/${result.data.data.id}`);
    setIsLoading(false);
  }, [data, router]);
  return (
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
  );
};

export default UserBox;