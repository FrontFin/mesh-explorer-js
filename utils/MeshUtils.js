export const handleExit = (setOpenMeshModal = () => {}) => {
  console.log('Broker connection closed:');
  setOpenMeshModal(false);
};

export const handleTransferFinished = () => {
  alert('Transfer Success!');
};
