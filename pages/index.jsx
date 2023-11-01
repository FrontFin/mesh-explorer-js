import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import ProviderDetails from '../components/ProviderDetails';
import NetworkDashboard from '../components/Dashboard';
import MeshModal from '../components/MeshModal';
import Header from '../components/Header';
import ChooseProvider from 'components/ChooseProvider';
import { getCatalogLink } from 'utils/getCatalogLink';
const HomePage = () => {
  const [existingAuthData, setExistingAuthData] = useState([]);
  const [catalogLink, setCatalogLink] = useState('');
  const [connectAnotherAccount, setConnectAnotherAccount] = useState(false);
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [brokerType, setBrokerType] = useState('');
  const [linkAnother, setLinkAnother] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    setExistingAuthData(authData ? JSON.parse(authData) : []);
    if (existingAuthData.length <= 1) {
      setConnectAnotherAccount(true);
    } else {
      setConnectAnotherAccount(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('authData', JSON.stringify(existingAuthData));
  }, [existingAuthData]);

  const handleSuccess = (newAuthData) => {
    newAuthData.linkedAccount = false;

    const updatedAuthData = [...existingAuthData, newAuthData];
    setExistingAuthData(updatedAuthData);
    const expiryTimestamp =
      new Date().getTime() + newAuthData.accessToken.expiresInSeconds * 1000;
    newAuthData.accessToken.expiryTimestamp = expiryTimestamp;

    localStorage.setItem('authData', JSON.stringify(updatedAuthData));
    setLinkAnother(false);
  };

  const handleExit = (error) => {
    if (error) {
      console.log('Broker connection closed:', error);
    } else {
      console.log('Broker connection closed with no erros');
    }
  };

  const handleCloseMeshModal = () => {
    setOpenMeshModal(false);
  };

  return (
    <div>
      <Header
        connectAnotherAccount={connectAnotherAccount}
        setLinkAnother={setLinkAnother}
        authData={existingAuthData}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '10px',
        }}
      >
        {existingAuthData === undefined ||
        existingAuthData.length === 0 ||
        linkAnother ? (
          <ChooseProvider
            variant="contained"
            color="secondary"
            brokerType={brokerType}
            getCatalogLink={getCatalogLink}
            setCatalogLink={setCatalogLink}
            setBrokerType={setBrokerType}
            setOpenMeshModal={setOpenMeshModal}
            setLinkAnother={setLinkAnother}
          />
        ) : null}
      </div>
      {openMeshModal ? (
        <MeshModal
          open={openMeshModal}
          setOpenMeshModal={setOpenMeshModal}
          onClose={handleCloseMeshModal}
          link={catalogLink}
          onSuccess={handleSuccess}
          onExit={handleExit}
          setPageLoaded={setPageLoaded}
          pageLoaded={pageLoaded}
          setErrorMessage={setErrorMessage}
        />
      ) : null}

      {existingAuthData.length > 0 && (
        <>
          <ProviderDetails
            existingAuthData={existingAuthData}
            setExistingAuthData={setExistingAuthData}
            openMeshModal={openMeshModal}
            setOpenMeshModal={setOpenMeshModal}
            brokerType={brokerType}
            catalogLink={catalogLink}
          />
          <Grid item xs={12}>
            <NetworkDashboard />
          </Grid>
        </>
      )}
    </div>
  );
};

export default HomePage;
