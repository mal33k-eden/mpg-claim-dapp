import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; 
import { MoralisProvider } from 'react-moralis';
import('./polyfill');

const root = ReactDOM.createRoot(document.getElementById('root'));
const appId = "IA1fZV3RqNGrDbAWRW82zaA2txBeGQK9EBs5QhKi"
const serverUrl="https://xfqoi5qkxu9m.usemoralis.com:2053/server"


root.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}  >
      <App />
    </MoralisProvider>
    
  </React.StrictMode>
);
 