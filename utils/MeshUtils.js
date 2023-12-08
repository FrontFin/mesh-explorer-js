export const handleExit = (setOpenMeshModal = () => {}) => {
  console.log('Broker connection closed:');
  setOpenMeshModal(false);
};

// export const handleTransferFinished = () => {
//   alert('Transfer Success!');
// };

export const handleSuccess = () => {
  console.log('success connecting');
};
