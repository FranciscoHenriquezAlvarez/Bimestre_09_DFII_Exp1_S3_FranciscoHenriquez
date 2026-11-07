import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import InventoryProvider from './context/InventoryProvider';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </HashRouter>
  </React.StrictMode>
);