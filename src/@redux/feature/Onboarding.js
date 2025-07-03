import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isRFI: false,
    rfiReason: ""
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setOnboarding: (state, action) => {
            return { ...state, ...action.payload }
        },
        resetOnboarding: () => {
            return initialState
        }
    }
})

export const { setOnboarding, resetOnboarding } = authSlice.actions

export default authSlice.reducer