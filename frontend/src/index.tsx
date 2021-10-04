import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import { WalletProvider } from './contexts/walletContext';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';
import { IpfsProvider } from './contexts/ipfsContext';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <IpfsProvider repo="http://127.0.0.1:5001">
        <WalletProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <ChakraProvider resetCSS={true} theme={theme} >
            <App />
          </ChakraProvider>
        </WalletProvider>
      </IpfsProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
