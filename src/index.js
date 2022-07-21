import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; 
import { MoralisProvider } from 'react-moralis';
import('./polyfill');

const root = ReactDOM.createRoot(document.getElementById('root'));
const appId = "sI2umy8FCyjTli71pCoNRgwyJJY9aYdtwDG6jtLo"
const serverUrl="https://uxgh7zhaktv4.usemoralis.com:2053/server"


root.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}  >
      <App />
    </MoralisProvider>
    
  </React.StrictMode>
);
 