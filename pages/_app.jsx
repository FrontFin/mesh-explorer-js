// _app.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import TransferProvider from 'context/transferContext';
import TransactionProvider from 'context/transactionContext';
import NetworksProvider from 'context/networksContexts';

// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <NetworksProvider>
        <TransferProvider>
          <TransactionProvider>
            <Component {...pageProps} />
          </TransactionProvider>
        </TransferProvider>
      </NetworksProvider>
    </ThemeProvider>
  );
}
