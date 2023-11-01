import React, { useState } from 'react';
import Link from 'next/link';
import { PropTypes } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, FormControl, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/router';

const Header = ({ setLinkAnother, connectAnotherAccount, authData }) => {
  const router = useRouter();
  const [dropdownValue, setDropdownValue] = useState('default');

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const handleDisconnectProviders = () => {
    localStorage.removeItem('authData');
    router.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0',
        }}
      >
        <Link href="/">
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
          >
            Mesh Explorer
          </Typography>
        </Link>

        <FormControl>
          <Select
            labelId="pages-dropdown-label"
            id="pages-dropdown"
            style={{ width: '100px' }}
            value={dropdownValue}
            onChange={handleDropdownChange}
            renderValue={() =>
              dropdownValue === 'default' ? 'Demos' : 'Demos'
            }
          >
            <MenuItem value="pay-page">
              <Link href="/pay">Pay</Link>
            </MenuItem>
            <MenuItem value="transfers-page">
              <Link href="/transfers">Transfers</Link>
            </MenuItem>

            {connectAnotherAccount && authData.length ? (
              <MenuItem>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setLinkAnother(true)}
                >
                  {!authData || authData.length === 0
                    ? 'Link Account'
                    : 'Link Another Account'}
                </Button>
              </MenuItem>
            ) : null}
            {authData?.length ? (
              <MenuItem
                sx={{ justifyContent: 'center' }} // centers content inside the MenuItem
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ padding: '4px 8px' }} // added padding here
                  fullWidth
                  onClick={handleDisconnectProviders}
                >
                  Disconnect Providers
                </Button>
              </MenuItem>
            ) : null}
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  setLinkAnother: PropTypes?.func,
  connectAnotherAccount: PropTypes?.bool,
  authData: PropTypes?.array,
};
export default Header;
