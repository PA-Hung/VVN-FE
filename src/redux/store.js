import { configureStore } from '@reduxjs/toolkit';
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
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './slice/authSlice';
import userReducer from './slice/userSilce';
import menuReducer from './slice/menuSilce';
import themeReducer from './slice/themeSilce';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    menu: menuReducer,
    theme: themeReducer,
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'menu'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
