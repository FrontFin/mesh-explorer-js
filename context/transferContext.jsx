import React, { useState, createContext } from 'react';
import { PropTypes } from '@mui/material';

const defaultState = {};

export const TransferContext = createContext(defaultState);

const TransferProvider = ({ children }) => {
  const [transferDetails, setTransferDetails] = useState([]);
  const [loading, setLoadingTransfers] = useState(true);
  const [message, setMessage] = useState('');
  const [lastXFRBrokerType, setLastXFRBrokerType] = useState(null);

  const getTransferDetails = async (payload, brokerType) => {
    try {
      setLoadingTransfers(true);
      setLastXFRBrokerType(brokerType);
      const response = await fetch(`/api/transfers/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setTransferDetails([]);
        setMessage(data.error || 'Something went wrong');
      }
      if (response && data.content.total === 0) {
        setMessage('No records found.');
        setTransferDetails([]);
      } else {
        setTransferDetails(data.content.transfers);
      }
    } catch (error) {
      setMessage(error);
    } finally {
      setLoadingTransfers(false);
    }
  };

  const state = {
    loading,
    setLoadingTransfers,
    transferDetails,
    lastXFRBrokerType,
    getTransferDetails,
    message,
  };

  return (
    <TransferContext.Provider value={state}>
      {children}
    </TransferContext.Provider>
  );
};

TransferProvider.propTypes = {
  children: PropTypes?.node?.isRequired,
};
export default TransferProvider;
