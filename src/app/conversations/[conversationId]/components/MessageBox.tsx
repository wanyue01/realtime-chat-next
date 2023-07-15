'use client';

import { FullMessageType } from '@/app/types';
import { FC } from 'react';

interface MessageBoxProps {
  isLast?: boolean;
  data: FullMessageType;
};

const MessageBox: FC<MessageBoxProps> = ({}) => {
  return (
    <div>MessageBox</div>
  );
};

export default MessageBox;