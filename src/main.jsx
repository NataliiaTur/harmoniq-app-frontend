import React from 'react';
import ReactDOM from 'react-dom/client';
import 'modern-normalize';
import './styles/index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor  } from './redux/store.js';
import { App } from './components/App/App.jsx';
import { setupAuthInterceptor } from './redux/interceptor/authInterceptor.js';

setupAuthInterceptor();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
        <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
