'use client';

import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  useForm,
  FieldValues,
  SubmitHandler,
} from 'react-hook-form';
import service from '@/app/utils/interceptor';
import { signIn, useSession } from 'next-auth/react';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';

interface AuthFormProps { };

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm: FC<AuthFormProps> = ({ }) => {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/users');
    }
  }, [session.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (variant === 'LOGIN') {
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });
      if (result?.error) {
        notification.error({
          message: result.error,
        });
      }
      if (result?.ok && !result?.error) {
        notification.success({
          message: '登录成功',
        });
      }
      setIsLoading(false);
    }

    if (variant === 'REGISTER') {
      const result = await service.post('/api/register', data);
      if (result?.data?.respCode === 0) {
        signIn('credentials', {
          ...data,
          redirect: false,
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
    >
      <div
        className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'
      >
        <form
          className='space-y-6'
          onSubmit={handleSubmit(onSubmit)}
        >
          {variant === 'REGISTER' && (
            <Input
              id='name'
              label='Name'
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id='email'
            label='Email address'
            type='email'
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id='password'
            label='Password'
            type='password'
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button
              disabled={isLoading}
              fullWidth
              type='submit'
            >
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
          <div>
            {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
          </div>
          <div
            onClick={toggleVariant}
            className='underline cursor-pointer'
          >
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;