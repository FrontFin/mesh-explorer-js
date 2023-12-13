import { useRouter } from 'next/router';

export const handleExit = (setOpenMeshModal = () => {}) => {
  setOpenMeshModal(false);
};

export const handleSuccess = () => {
  console.log('success connecting');
};

export const handleTransferFinished = () => {
  const router = useRouter();
  router.push('/');
};
