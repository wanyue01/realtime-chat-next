'use client';

import { FC } from 'react';
import useActiveChannel from '../hooks/useActiveChannel';

interface ActiveStatusProps {};

const ActiveStatus: FC<ActiveStatusProps> = ({}) => {
  useActiveChannel();
  return null;
};

export default ActiveStatus;