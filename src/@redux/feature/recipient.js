import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    recipientDetails: { data: [] },
    pending: false,
    isVerified: "pending",
    addRecipientDetails: "Abhinav",
    transferDetails: {},
    paymentStatus: false,
    formSchema: [],
    recipientCountryList: [],
    bankOptions: [],
    branchOptions: [],
    recipient_country: [],
    recipient_currency: [],
    recipient_type: [],
    recipientCurrencyList: [],
    bankId: "",
    currentPage: 1,
    currentStatus: "ACTIVE"
}

export const recipientSlice = createSlice({
    name: 'recipient',
    initialState,
    reducers: {
        setRecipientDetails: (state, action) => {
            state.recipientDetails = action.payload
        },
        setPending: (state, action) => {
            state.pending = action.payload
        },
        setVerify: (state, action) => {
            state.isVerified = action.payload
        },
        setAddRecipientDetails: (state, action) => {
            state.addRecipientDetails = action.payload
        },
        setTransferDetails: (state, action) => {
            state.transferDetails = action.payload
        },
        setPaymentStatus: (state, action) => {
            state.paymentStatus = action.payload
        },
        setFormSchema: (state, action) => {
            state.formSchema = action.payload
        },
        setRecipientCountryList: (state, action) => {
            state.recipientCountryList = action.payload
        },
        setBankOptions: (state, action) => {
            state.bankOptions = action.payload
        },
        setBranchOptions: (state, action) => {
            state.branchOptions = action.payload
        },
        setRecipientCountry: (state, action) => {
            state.recipient_country = action.payload
        },
        setRecipientCurrency: (state, action) => {
            state.recipient_currency = action.payload
        },
        setRecipientType: (state, action) => {
            state.recipient_type = action.payload
        },
        setRecipientCurrencyList: (state, action) => {
            state.recipientCurrencyList = action.payload
        },
        setBankId: (state, action) => {
            state.bankId = action.payload
        },
        setRecipient: (state, action) => {
            return { ...state, ...action.payload }
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        setCurrentStatus: (state, action) => {
            state.currentPage = 1
            state.currentStatus = action.payload
        },
        resetRecipient: (state) => {
            return initialState
        }
    },
})

export const { setRecipientDetails, setPending, setVerify, setAddRecipientDetails, setTransferDetails, setPaymentStatus, resetRecipient, setFormSchema, setRecipientCountryList, setBankOptions, setBranchOptions, setRecipientCountry, setRecipientCurrencyList, setBankId, setRecipientCurrency, setRecipientType, setRecipient, setCurrentPage, setCurrentStatus } = recipientSlice.actions

export default recipientSlice.reducer