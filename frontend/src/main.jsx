import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext, AuthProvider } from './Utils/AuthContext.jsx'; // Only import AuthProvider
import { ProductContext, ProductProvider } from './Utils/ProductContext.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter >
      <AuthProvider value= {AuthContext}> 
        <ProductProvider value={ProductContext}>
        <App />
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  // </StrictMode>
);





