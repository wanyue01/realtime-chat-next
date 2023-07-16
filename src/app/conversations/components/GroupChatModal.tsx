'use client';

import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import Select from '@/app/components/inputs/Select';
import service from '@/app/utils/interceptor';
import { User } from '@prisma/client';
import { Modal, notification } from 'antd';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
};

const GroupChatModal: FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: [],
    },
  });

  const members = watch('members');

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await service.post('/api/conversations', {
        ...data,
        isGroup: true,
      });
      if (result.data.respCode === 0) {
        router.refresh();
        onClose();
      } else {
        notification.error({
          message: result?.data?.message || '出错了',
        });
      }
    } catch {} finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              创建一个新的群聊
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              提示：群聊人数需要多于2人
            </p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <Input
                disabled={isLoading}
                label='用户名'
                id='name'
                errors={errors}
                required
                register={register}
              />
              <Select
                disabled={isLoading}
                label='成员'
                options={users.map(user => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) => setValue('members', value, {
                  shouldValidate: true,
                })}
                value={members}
              />
            </div>
          </div>
          <div
            className='mt-6 flex items-center justify-end gap-x-6'
          >
            <Button
              disabled={isLoading}
              secondary
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              disabled={isLoading}
              type='submit'
            >
              保存
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;