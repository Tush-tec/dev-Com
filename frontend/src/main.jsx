import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext, AuthProvider } from './Utils/AuthContext.jsx'; // Only import AuthProvider
import { ProductContext, ProductProvider } from './Utils/ProductContext.jsx';
import { Provider } from 'react-redux';
import { store } from './Utils/Store/CartSlice.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter >
    <Provider store={store}>
      <AuthProvider> 
        <ProductProvider>

        <App />
        </ProductProvider>
      </AuthProvider>
      </Provider>
    </BrowserRouter>
);


  


