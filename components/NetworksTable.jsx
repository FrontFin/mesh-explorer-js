import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { TableFooter, TablePagination } from '@mui/material';
import Paper from '@mui/material/Paper';
import { PropTypes } from '@mui/material';

function NetworkDashboard({
  tab,
  showTable,
  setShowTable,
  networks,
  message,
  page,
  setPage,
}) {
  const renderTable = (rows, headers) => {
    const rowsPerPage = 10;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const currentPageNetworks = rows.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    return (
      <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageNetworks.map((network, index) => (
                <TableRow
                  key={network.id + '-' + index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor:
                      index % 2 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                  }}
                >
                  <TableCell>{network.id}</TableCell>
                  <TableCell>{network.name}</TableCell>
                  <TableCell>{network.chainId}</TableCell>
                  <TableCell>
                    {network?.supportedBrokerTypes.join(', ')}
                  </TableCell>{' '}
                  <TableCell>{network.supportedTokens.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  colSpan={5} // Adjusted to 5 columns
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <div>
      {!showTable ? (
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '20px' }}
          size="small"
          onClick={() => setShowTable(true)}
        >
          Show Table
        </Button>
      ) : tab === 0 && message ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>{message}</div>
      ) : (
        renderTable(networks, [
          'Id',
          'Name',
          'Chain Id',
          'Supported Broker Types',
          'Supported Tokens',
        ])
      )}
    </div>
  );
}

NetworkDashboard.propTypes = {
  tab: PropTypes?.number,
  showTable: PropTypes?.bool,
  setShowTable: PropTypes?.func,
  networks: PropTypes?.array,
  message: PropTypes?.string,
  page: PropTypes?.number,
  setPage: PropTypes?.func,
};
export default NetworkDashboard;
