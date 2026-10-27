import { configureStore, createSlice } from "@reduxjs/toolkit";

const workflowSlice = createSlice({
    name: "workflow",

    initialState: {
        selectedPatient: null
    },

    reducers: {
        selectPatient(state, action) {
            state.selectedPatient = action.payload;
        },

        clearSelectedPatient(state) {
            state.selectedPatient = null;
        }
    }
});

export const { selectPatient, clearSelectedPatient } =
    workflowSlice.actions;

export const store = configureStore({
    reducer: {
        workflow: workflowSlice.reducer
    }
});