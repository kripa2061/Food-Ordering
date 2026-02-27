import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';
import  StoreContextProvider  from './Context/Context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreContextProvider>
      <App />
       <ToastContainer />
    </StoreContextProvider>
  </StrictMode>
);