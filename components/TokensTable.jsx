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

import React, { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { TableFooter, TablePagination } from '@mui/material';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';

function TokensDashboard({ page, setPage }) {
  const [tokens, setTokens] = useState([]);
  const [showTokensTable, setShowTokensTable] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoadingTokens(true);

        const response = await fetch('/api/status');

        if (!response.ok) {
          throw new Error('Failed to fetch Tokens');
        }

        const data = await response.json();

        setTokens(data.content);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingTokens(false);
      }
    };

    fetchTokens();
  }, []);

  if (loadingTokens) {
    return <CircularProgress />;
  }

  const renderTable = (rows, headers) => {
    const rowsPerPage = 20;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const currentPageTokens = rows.slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );

    return (
      <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 950 }} aria-label="Tokens table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageTokens.map((tokens, index) => (
                <TableRow
                  key={tokens?.type + '-' + index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor:
                      index % 2 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                  }}
                >
                  <TableCell>
                    {tokens?.deFiWalletData?.name
                      ? tokens.deFiWalletData.name
                      : tokens.type}
                  </TableCell>

                  <TableCell>{tokens?.isUp ? 'Up' : 'Down'}</TableCell>
                  <TableCell>{tokens?.supportedProducts?.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  colSpan={5} // updated colspan to 5 as there are 5 columns now
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
      {!showTokensTable ? (
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '20px' }}
          size="small"
          onClick={() => setShowTokensTable(true)}
        >
          Show Tokens Table
        </Button>
      ) : (
        renderTable(tokens, ['Provider', 'Tokens', 'Supported Products'])
      )}
    </div>
  );
}
TokensDashboard.propTypes = {
  tab: PropTypes?.number,
  showTable: PropTypes?.bool,
  setShowTable: PropTypes?.func,
  message: PropTypes?.string,
  page: PropTypes?.number,
  setPage: PropTypes?.func,
  setLoadingTokens: PropTypes?.func,
};

export default TokensDashboard;
