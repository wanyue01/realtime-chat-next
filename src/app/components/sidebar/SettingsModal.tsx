'use client';

import service from '@/app/utils/interceptor';
import { User } from '@prisma/client';
import { Modal, notification } from 'antd';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../inputs/Input';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import Button from '../Button';

interface SettingsModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
};

const SettingsModal: FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    }
  });

  // 监听image变化，不用专门去form中取值
  const image = watch('image');

  // 上传图片后把url赋值到form中
  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await service.post('/api/settings', data);
      if (result.data.respCode === 0) {
        router.refresh();
        onClose();
      } else {
        notification.error({
          message: result?.data?.message || '出错了',
        });
      }
    } catch (error: any) { } finally {
      setIsLoading(false);
    }
  }

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
              设置
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              编辑你的展示信息
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
              <div>
                <label
                  className='block text-sm font-medium leading-6 text-gray-900'
                  htmlFor=""
                >
                  头像
                </label>
                <div className='mt-2 flex items-center gap-x-3'>
                  <Image
                    width={48}
                    height={48}
                    className='rounded-full'
                    src={image || currentUser?.image || '/images/placeholder.jpg'}
                    alt='头像'
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset='uuyw9lhd'
                  >
                    <Button
                      disabled={isLoading}
                      secondary
                      type='button'
                    >
                      上传
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
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

export default SettingsModal;