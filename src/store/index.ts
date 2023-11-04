import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import appReducer from './slice/appSlice'
import productsReducer from './slice/productsSlice'
import sessionReducer from './slice/sessionSlice'
import offersReducer from './slice/offersSlice'
import notificationReducer from './slice/notificationSlice'
import api from './slice/api'

const rootReducer = combineReducers({
  app: appReducer,
  products: productsReducer,
  session: sessionReducer,
  offers: offersReducer,
  notification: notificationReducer,
  [api.reducerPath]: api.reducer,
})

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  {
    key: 'primary',
    storage: AsyncStorage,
    whitelist: ['session'],
    stateReconciler: autoMergeLevel2,
  },
  rootReducer
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
