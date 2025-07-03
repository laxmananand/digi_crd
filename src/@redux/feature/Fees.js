import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    feesDetails : []
}

export const feesSlice = createSlice({
    name: 'fees',
    initialState,
    reducers: {
        setFeesDetails : (state, action) => {
            state.feesDetails = action.payload
        },
        resetFees : (state) => {
            return initialState
        }
    },
})

export const { setFeesDetails, resetFees } = feesSlice.actions

export default feesSlice.reducer