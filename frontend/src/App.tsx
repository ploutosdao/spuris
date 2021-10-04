import { Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import { useWallet } from './contexts/walletContext';
import Home from './pages/Home';

function App() {
  const wallet = useWallet();

  
  useEffect(() => {
    async function init() {
      const network = await wallet.provider.getNetwork();
      console.log(`the network: ${network.name}=${network.chainId} | ens=${network.ensAddress}`);
    }
    init();
  }, [wallet.provider]);

  return (
    <Layout>
      {wallet.status === 'connected' ? (
        <>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
        </>
      ) : (
        <Button onClick={() => wallet.connect()}>Connect</Button>
      )}
    </Layout>
  )
}

export default App;
