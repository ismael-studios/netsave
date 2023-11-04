import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NotificationType } from '../../enums/Notifications'
import { logout } from './sessionSlice'

interface Notification {
  type: NotificationType
}

interface NotificationState {
  active: Notification | null
}

const initialState: NotificationState = {
  active: null,
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setActiveNotification: (state, action: PayloadAction<Notification>) => {
      state.active = state.active = action.payload
    },
    clearActiveNotification: (state) => {
      state.active = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => {
      return initialState
    })
  },
})

export const { setActiveNotification, clearActiveNotification } =
  notificationSlice.actions

export default notificationSlice.reducer
