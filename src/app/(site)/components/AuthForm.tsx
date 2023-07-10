'use client';

import Input from '@/app/components/inputs/Input';
import { FC, useCallback, useState } from 'react';
import {
  useForm,
  FieldValues,
  SubmitHandler,
} from 'react-hook-form';

interface AuthFormProps { };

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm: FC<AuthFormProps> = ({ }) => {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'LOGIN') {

    }

    if (variant === 'REGISTER') {

    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    // NextAuth Social Sign In
  }

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
          <Input
            label='Email'
            register={register}
            id='email'
            errors={errors}
          />
        </form>
      </div>
    </div>
  );
};

export default AuthForm;