import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteDoctor, getDoctorsList } from "./doctors.service";

const initialState = {
    rows: [],           // -> list
    pagination: {},     // -> API pagination info
    page: 1,            // -> current page
    loading: false,     // -> doctors fetch चालू आहे का
    deleting: false,    // -> delete चालू आहे का
    selectedRowIds: [], // -> selected doctor ids
    error: "",          // -> API error message
}

export const fetchDoctors = createAsyncThunk(
    "doctors/fetchDoctors",
    async ({ filterState, page }, { rejectWithValue }) => {
        const res = await getDoctorsList({ filterState, page });

        if (!res.success) {
            return rejectWithValue(res?.message || "Error while fetching doctors");
        }

        return {
            rows: res.data || [],
            pagination: res.pagination || {},
        };
    }
);
export const deleteDoctors = createAsyncThunk(
    "doctors/deleteDoctors",
    async (selectedRowIds, { rejectWithValue }) => {
        const res = await deleteDoctor(selectedRowIds);

        if (!res.success) {
            return rejectWithValue(res?.message || "Error while deleting doctors");
        }

        return {
            message: res?.message || "Doctors deleted successfully",
            deletedIds: selectedRowIds,
        };
    }
);

const doctorsSlice = createSlice({
    name: "doctors",
    initialState,
    reducers: {
        setDoctorsPage(state, action) {
            state.page = action.payload || 1;
        },
        setDoctorsRows(state, action) {
            state.rows = action.payload || [];
        },
        setDoctorsLoading(state, action) {
            state.loading = action.payload;
        },
        setDoctorsDeleting(state, action) {
            state.deleting = action.payload;
        },
        setDoctorsPagination(state, action) {
            state.pagination = action.payload;
        },
        setDoctorsSelection(state, action) {
            state.selectedRowIds = Array.isArray(action.payload) ? action.payload : [];
        },
        clearDoctorsSelection(state) {
            state.selectedRowIds = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctors.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.rows = action.payload.rows;
                state.pagination = action.payload.pagination;
                state.selectedRowIds = [];
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error while fetching doctors";
            })
            .addCase(deleteDoctors.pending, (state) => {
                state.deleting = true;
                state.error = "";
            })
            .addCase(deleteDoctors.fulfilled, (state, action) => {
                state.deleting = false;
                state.selectedRowIds = [];
            })
            .addCase(deleteDoctors.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload || "Error while deleting doctors";
            });
    }
});

export const {
    setDoctorsPage,
    setDoctorsRows,
    setDoctorsLoading,
    setDoctorsDeleting,
    setDoctorsPagination,
    setDoctorsSelection,
    clearDoctorsSelection,
} = doctorsSlice.actions;

export default doctorsSlice.reducer;

export const selectDoctorsRows = (state) => state.doctors.rows;
export const selectDoctorsPagination = (state) => state.doctors.pagination;
export const selectDoctorsPage = (state) => state.doctors.page;
export const selectDoctorsLoading = (state) => state.doctors.loading;
export const selectDoctorsDeleting = (state) => state.doctors.deleting;
export const selectDoctorsSelectedRowIds = (state) => state.doctors.selectedRowIds;
export const selectDoctorsError = (state) => state.doctors.error;