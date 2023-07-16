import { FC } from 'react';
import LoadingModal from '../components/LoadingModal';

interface loadingProps {};

const loading: FC<loadingProps> = ({}) => {
  return (
    <LoadingModal />
  );
};

export default loading;