import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deletePatient, getPatientsList } from "./patients.service";

const initialState = {
    rows: [],           // -> list
    pagination: {},     // -> API pagination info
    page: 1,            // -> current page
    loading: false,     // -> patients fetch चालू आहे का
    deleting: false,    // -> delete चालू आहे का
    selectedRowIds: [], // -> selected patient ids
    error: "",          // -> API error message
}

export const fetchPatients = createAsyncThunk(
    "patients/fetchPatients",
    async ({ filterState, page }, { rejectWithValue }) => {
        const res = await getPatientsList({ filterState, page });

        if (!res.success) {
            return rejectWithValue(res?.message || "Error while fetching patients");
        }

        return {
            rows: res.data || [],
            pagination: res.pagination || {},
        };
    }
);
export const deletePatients = createAsyncThunk(
    "patients/deletePatients",
    async (selectedRowIds, { rejectWithValue }) => {
        const res = await deletePatient(selectedRowIds);

        if (!res.success) {
            return rejectWithValue(res?.message || "Error while deleting patients");
        }

        return {
            message: res?.message || "Patients deleted successfully",
            deletedIds: selectedRowIds,
        };
    }
);

const patientsSlice = createSlice({
    name: "patients",
    initialState,
    reducers: {
        setPatientsPage(state, action) {
            state.page = action.payload || 1;
        },
        setPatientsRows(state, action) {
            state.rows = action.payload || [];
        },
        setPatientsLoading(state, action) {
            state.loading = action.payload;
        },
        setPatientsDeleting(state, action) {
            state.deleting = action.payload;
        },
        setPatientsPagination(state, action) {
            state.pagination = action.payload;
        },
        setPatientsSelection(state, action) {
            state.selectedRowIds = Array.isArray(action.payload) ? action.payload : [];
        },
        clearPatientsSelection(state) {
            state.selectedRowIds = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatients.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.loading = false;
                state.rows = action.payload.rows;
                state.pagination = action.payload.pagination;
                state.selectedRowIds = [];
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error while fetching patients";
            })
            .addCase(deletePatients.pending, (state) => {
                state.deleting = true;
                state.error = "";
            })
            .addCase(deletePatients.fulfilled, (state, action) => {
                state.deleting = false;
                state.selectedRowIds = [];
            })
            .addCase(deletePatients.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload || "Error while deleting patients";
            });
    }
});

export const {
    setPatientsPage,
    setPatientsRows,
    setPatientsLoading,
    setPatientsDeleting,
    setPatientsPagination,
    setPatientsSelection,
    clearPatientsSelection,
} = patientsSlice.actions;

export default patientsSlice.reducer;

export const selectPatientsRows = (state) => state.patients.rows;
export const selectPatientsPagination = (state) => state.patients.pagination;
export const selectPatientsPage = (state) => state.patients.page;
export const selectPatientsLoading = (state) => state.patients.loading;
export const selectPatientsDeleting = (state) => state.patients.deleting;
export const selectPatientsSelectedRowIds = (state) => state.patients.selectedRowIds;
export const selectPatientsError = (state) => state.patients.error;