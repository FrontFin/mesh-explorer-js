import React, { useState, createContext } from 'react';

const defaultState = {};

export const NetworksContext = createContext(defaultState);

const NetworksProvider = ({ children }) => {
  const [networks, setNetworks] = useState([]);
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [message, setMessage] = useState('');

  const getNetworks = async () => {
    try {
      setLoadingNetworks(true);
      const response = await fetch('/api/networks');

      const data = await response.json();

      if (!response.ok) {
        // Throw an error if the server responded with a non-200 status code.
        setMessage(data.error || 'Something went wrong');
        throw new Error(data.error || 'Something went wrong', response.status);
      }
      if (response && data.content.total === 0) {
        setMessage('No Networks found.');
        setNetworks([]);
      } else {
        setNetworks(data.content.networks);
      }
    } catch (error) {
      setMessage(error);
      console.log('this was the token error', error);
    } finally {
      setLoadingNetworks(false);
    }
  };

  const state = {
    loadingNetworks,
    setLoadingNetworks,
    networks,
    getNetworks,
    message,
  };

  return (
    <NetworksContext.Provider value={state}>
      {children}
    </NetworksContext.Provider>
  );
};

export default NetworksProvider;
