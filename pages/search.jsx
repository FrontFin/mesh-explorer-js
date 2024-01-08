import React, { useState } from 'react';
import Header from 'components/Header';
import {
  CircularProgress,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const SearchForm = () => {
  const [showTransfersTable, setShowTransfersTable] = useState(false);
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchParams, setSearchParams] = useState({
    count: 10,
    offset: 0,
    id: '',
    clientTransactionId: '',
    userId: '',
    descendingOrder: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleDateChange = (name, date) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: date ? date.getTime() / 1000 : null, // Convert to Unix timestamp if date is not null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingTransfers(true);
    setShowTransfersTable(false); // Reset/hide the table before loading new data
    console.log(searchParams);
    try {
      const response = await fetch(
        `/api/transfers/search?count=${searchParams.count}&offset=${searchParams.offset}&descendingOrder=${searchParams.descendingOrder}&userId=${searchParams.userId}&id=${searchParams.id}&fromTimestamp=${searchParams.fromTimestamp}&toTimestamp=${searchParams.toTimestamp}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const responseData = await response.json();
      setTransfers(responseData);

      if (responseData && responseData.length > 0) {
        setShowTransfersTable(true);
      } else {
        alert('No transfers found for the given search criteria.');
      }
    } catch (error) {
      console.error('Transfers response error:', error);
    } finally {
      setLoadingTransfers(false);
    }
  };

  return (
    <div>
      <Header />
      <Box
        sx={{ padding: 3, display: 'flex', justifyContent: 'center', mt: 5 }}
      >
        <Paper
          elevation={3}
          sx={{ padding: 3, width: '80%', maxWidth: '500px' }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ textAlign: 'center', mb: 2 }}
          >
            Search Executed Mesh Transfers
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="User Id"
              name="userId"
              value={searchParams.userId}
              onChange={handleChange}
            />
            <TextField
              label="Mesh txn Id"
              name="id"
              value={searchParams.id}
              onChange={handleChange}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Count"
                name="count"
                value={searchParams.count}
                onChange={handleChange}
                type="number"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="Offset"
                name="offset"
                value={searchParams.offset}
                onChange={handleChange}
                type="number"
                sx={{ flexGrow: 1 }}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From"
                  value={fromDate}
                  onChange={(date) => {
                    setFromDate(date);
                    handleDateChange('fromTimestamp', date);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ flexGrow: 1 }} />
                  )}
                />
                <DatePicker
                  label="To"
                  value={toDate}
                  maxDate={new Date()}
                  onChange={(date) => {
                    setToDate(date);
                    handleDateChange('toTimestamp', date);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ flexGrow: 1 }} />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={searchParams.descendingOrder}
                  onChange={handleCheckboxChange}
                  name="descendingOrder"
                />
              }
              label="Descending Order"
            />

            <Button type="submit" variant="contained">
              Search
            </Button>
          </Box>
        </Paper>
      </Box>
      {loadingTransfers ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 5,
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading Transfers</Typography>
        </Box>
      ) : (
        showTransfersTable && (
          <TableContainer component={Paper}>
            <Table aria-label="Transfers Table">
              <TableHead>
                <TableRow>
                  <TableCell>Mesh txn Id</TableCell>
                  <TableCell>Provider txn Id</TableCell>
                  <TableCell>Client txn Id</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount in Fiat</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Network</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>Hash</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.id}</TableCell>
                    <TableCell>{transfer.from.id}</TableCell>
                    <TableCell>{transfer.clientTransactionId}</TableCell>
                    <TableCell>{transfer.userId}</TableCell>
                    <TableCell>{transfer.status}</TableCell>
                    <TableCell>{transfer.amountInFiat}</TableCell>
                    <TableCell>{transfer.symbol}</TableCell>
                    <TableCell>{transfer.networkName}</TableCell>
                    <TableCell>
                      {new Date(
                        transfer.createdTimestamp * 1000
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>{transfer.from.name}</TableCell>
                    <TableCell>{transfer.hash}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </div>
  );
};

export default SearchForm;
