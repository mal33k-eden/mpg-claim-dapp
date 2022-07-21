import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; 
import { MoralisProvider } from 'react-moralis';
import('./polyfill');

const root = ReactDOM.createRoot(document.getElementById('root'));
const appId = "7SUMTektfXKmCw8SCpEMuXAeBLrzOTMDej0UVZvw"
const serverUrl="https://mnw8qvpjsrms.usemoralis.com:2053/server"


root.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}  >
      <App />
    </MoralisProvider>
    
  </React.StrictMode>
);
 