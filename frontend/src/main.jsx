import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext, AuthProvider } from './Utils/AuthContext.jsx'; // Only import AuthProvider

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter value= {AuthContext}>
      <AuthProvider>  {/* No need to pass value here */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  // </StrictMode>
);





