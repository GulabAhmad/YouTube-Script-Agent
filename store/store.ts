import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import themeConfigSlice from './themeConfigSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        themeConfig: themeConfigSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 