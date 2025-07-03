import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    quote: {}
}

export const quotesSlice = createSlice({
    name: 'quotes',
    initialState,
    reducers: {
        setQuote : (state, action) => {
            state.quote = action.payload
        },
        resetQuotes : (state) => {
            return initialState
        }
    },
})

export const { resetQuotes, setQuote } = quotesSlice.actions

export default quotesSlice.reducer