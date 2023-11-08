/**
 * Copyright 2023-present Mesh Connect, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  TextField,
  Typography,
  Select,
  Grid,
} from '@mui/material';

//import { NetworksContext } from '../context/networksContext'
  import { IntegrationsContext } from 'context/integrationsContext';

const GetDepositDetails = ({
  toAuthData,
  symbol,
  setChain,
  chain,
  formValues,
  handleInputChange,
  setType,
  type,
}) => {
  // const { networks } = useContext(NetworksContext);
  const { integrations, getIntegrations } = useContext(IntegrationsContext);

  const [chains, setChains] = useState([]);
  const [supportedTokens, setSupportedTokens] = useState([]);


  useEffect(() => {
    if (supportedTokens.length > 0) {
      handleInputChange('symbol', supportedTokens[0]); // Set to the first supported token
    }
  }, [supportedTokens]);
 
  useEffect(() => {
  setType(toAuthData?.accessToken?.brokerType);
}, [toAuthData]);


  
  useEffect(() => {
  const getSupportedTokensByType = () => {
    console.log('Type:', type);
    const matchingIntegrations = integrations?.filter(
      (integration) => integration.type === type
    );
    console.log('Matching Integrations:', matchingIntegrations);
    let result = [];

    matchingIntegrations.forEach((integration) => {
      integration.networks.forEach((network) => {
        result = [...result, ...network.supportedTokens];
      });
    });
    console.log('Supported Tokens:', result);
    const uniqueSupportedTokens = Array.from(new Set(result));
    setSupportedTokens(uniqueSupportedTokens);
  };

  getIntegrations();
  if (integrations && integrations.length > 0) {
    getSupportedTokensByType();
  }
}, [toAuthData, type]);



  const getNetworkNamesBySymbol = (selectedSymbol) => {
    const supportedChains = new Set();

    integrations.forEach((integration) => {
      integration?.networks?.forEach((network) => {
        if (network.supportedTokens.includes(selectedSymbol)) {
          const lowerCasedName =
            network.name.charAt(0).toLowerCase() + network.name.slice(1);

          supportedChains.add(lowerCasedName);
        }
      });
    });

    setChains(['', ...supportedChains]);
  };

  useEffect(() => {
    if (symbol) {
      getNetworkNamesBySymbol(symbol);
    }
  }, [symbol]);


  const getChainsForSelectedSymbol = (selectedSymbol) => {
  const availableChains = new Set();

  integrations.forEach((integration) => {
    integration?.networks?.forEach((network) => {
      if (network.supportedTokens.includes(selectedSymbol)) {
        const lowerCasedName =
          network.name.charAt(0).toLowerCase() + network.name.slice(1);

        availableChains.add(lowerCasedName);
      }
    });
  });

  return ['', ...availableChains];
};

  return (
    <div>
      <h2>Get {toAuthData?.accessToken?.brokerName} Deposit Address</h2>

      <Card
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mt: 2,
          gap: 2,
          p: 2,
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <form>
            <FormControl fullWidth>
              <Typography variant="h6">Destination</Typography>
              <TextField
                required
                id="destination"
                value={
                  toAuthData?.accessToken?.brokerName || 'No destination found'
                }
                helperText="Where the funds will be sent to"
              />
            </FormControl>
            <FormControl fullWidth>
  <Typography variant="h6">Symbol</Typography>
  <Select
    required
    labelId="symbol-label"
    id="symbol"
    value={formValues.symbol}
    label="Symbol"
    onChange={(e) => handleInputChange('symbol', e.target.value)}
  >
    {supportedTokens.map((supportedToken, index) => (
      <MenuItem key={index} value={supportedToken}>
        {supportedToken}
      </MenuItem>
    ))}
  </Select>
</FormControl>

{chains.length ? (
  <FormControl fullWidth>
    <Typography variant="h6">Chain</Typography>
    <Select
      required
      id="chain"
      value={chain.toLowerCase()}
      onChange={(e) => {
        setChain(e.target.value);
      }}
    >
      {getChainsForSelectedSymbol(formValues.symbol).map((chainOption, index) => (
        <MenuItem key={index} value={chainOption}>
          {chainOption}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
) : null}


            
            <Grid container justifyContent="flex-end" mt={2}></Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

GetDepositDetails.propTypes = {
  toAuthData: PropTypes?.object,
  setSymbol: PropTypes?.func,
  symbol: PropTypes?.string,
  setChain: PropTypes?.func,
  chain: PropTypes?.string,
  errorMessage: PropTypes?.string,
  setType: PropTypes?.func,
  type: PropTypes?.string,
  handleInputChange: PropTypes?.func,
  formValues: PropTypes?.object,
};

export default GetDepositDetails;
