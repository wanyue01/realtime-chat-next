import { Modal } from 'antd';
import Image from 'next/image';
import { FC } from 'react';

interface ImageModalProps {
  src: string | null;
  isOpen: boolean;
  onClose: () => void;
};

const ImageModal: FC<ImageModalProps> = ({
  src,
  isOpen,
  onClose,
}) => {
  if (!src) {
    return null;
  }
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div className='w-80 h-80'>
        <Image
          alt='图片'
          className='object-cover'
          fill
          src={src}
        />
      </div>
    </Modal>
  );
};

export default ImageModal;