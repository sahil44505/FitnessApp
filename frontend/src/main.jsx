import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { ShopContextProvider } from './context/ShopContext.jsx';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-er3uf2ml88pgihf8.us.auth0.com"
      clientId="Y1DzfqKiOs3Sqhq0p0zB2FIKNNiTcGFV"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
  
      <ShopContextProvider>
      
          <App />
      
      </ShopContextProvider>
     
    </Auth0Provider>,
  </React.StrictMode>,
)
