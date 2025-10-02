import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './articlesSlice/articlesSlice';
import globalReducer from './globalSlice/globalSlice.js';
import { authReducer } from './authSlice/authSlice.js';
import registrationReducer from './authSlice/registrationSlice.js';
import storage from 'redux-persist/lib/storage';
import usersReducer from './usersSlice/usersSlice.js';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { TokenService } from '../utils/tokenService.js';

const persistConfig = {
  key: 'root-auth',
  version: 1,
  storage,
  whitelist: ['user', 'refreshToken', 'accessToken', 'isLoggedIn'],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const tokenMiddleware = (store) => (next) => (action) => {
  if (action.type === REHYDRATE && action.key === 'root-auth') {
    console.log('🔄 REHYDRATE action:', action.payload);
    const accessToken = action.payload?.accessToken;
    if (accessToken) {
      console.log('✅ Setting token from REHYDRATE:', accessToken.substring(0, 20));
      TokenService.setAuthHeader(accessToken);
    } else {
      console.warn('⚠️ No accessToken in REHYDRATE payload');
    }
  }

  // ⭐ ДОДАЙТЕ: також встановлюйте токен після login/refresh
  if (action.type.endsWith('/fulfilled') && 
      (action.type.includes('login') || action.type.includes('refresh'))) {
    const accessToken = action.payload?.accessToken;
    if (accessToken) {
      console.log('✅ Setting token after', action.type, ':', accessToken.substring(0, 20));
      TokenService.setAuthHeader(accessToken);
    }
  }


  return next(action);
};

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    auth: persistedReducer,
    registration: registrationReducer,
    global: globalReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(tokenMiddleware),
});

export const persistor = persistStore(store);
