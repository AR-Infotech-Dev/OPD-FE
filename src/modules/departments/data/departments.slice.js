import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteDepartment, getDepartmentsList } from "./departments.service";

const initialState = {
    rows: [],           // -> list
    pagination: {},     // -> API pagination info
    page: 1,            // -> current page
    loading: false,     // -> Departments fetch चालू आहे का
    deleting: false,    // -> delete चालू आहे का
    selectedRowIds: [], // -> selected department ids
    error: "",          // -> API error message
}

export const fetchDepartments = createAsyncThunk(
    "departments/fetchDepartments",
    async ({ filterState, page }, { rejectWithValue }) => {
        const res = await getDepartmentsList({ filterState, page });

        if (!res.success) {
            return rejectWithValue(res?.message || "Error while fetching departments");
        }

        return {
            rows: res.data || [],
            pagination: res.pagination || {},
        };
    }
);
export const deleteDepartments = createAsyncThunk(
    "departments/deleteDepartments",
    async (selectedRowIds, { rejectWithValue }) => {
        const res = await deleteDepartment(selectedRowIds);

        if (!res.success) {
            return rejectWithValue(res?.message || "Error while deleting departments");
        }

        return {
            message: res?.message || "Departments deleted successfully",
            deletedIds: selectedRowIds,
        };
    }
);

const departmentsSlice = createSlice({
    name: "departments",
    initialState,
    reducers: {
        setDepartmentsPage(state, action) {
            state.page = action.payload || 1;
        },
        setDepartmentsRows(state, action) {
            state.rows = action.payload || [];
        },
        setDepartmentsLoading(state, action) {
            state.loading = action.payload;
        },
        setDepartmentsDeleting(state, action) {
            state.deleting = action.payload;
        },
        setDepartmentsPagination(state, action) {
            state.pagination = action.payload;
        },
        setDepartmentsSelection(state, action) {
            state.selectedRowIds = Array.isArray(action.payload) ? action.payload : [];
        },
        clearDepartmentsSelection(state) {
            state.selectedRowIds = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.rows = action.payload.rows;
                state.pagination = action.payload.pagination;
                state.selectedRowIds = [];
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error while fetching departments";
            })
            .addCase(deleteDepartments.pending, (state) => {
                state.deleting = true;
                state.error = "";
            })
            .addCase(deleteDepartments.fulfilled, (state, action) => {
                state.deleting = false;
                state.selectedRowIds = [];
            })
            .addCase(deleteDepartments.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload || "Error while deleting departments";
            });
    }
});

export const {
    setDepartmentsPage,
    setDepartmentsRows,
    setDepartmentsLoading,
    setDepartmentsDeleting,
    setDepartmentsPagination,
    setDepartmentsSelection,
    clearDepartmentsSelection,
} = departmentsSlice.actions;

export default departmentsSlice.reducer;

export const selectDepartmentsRows = (state) => state.departments.rows;
export const selectDepartmentsPagination = (state) => state.departments.pagination;
export const selectDepartmentsPage = (state) => state.departments.page;
export const selectDepartmentsLoading = (state) => state.departments.loading;
export const selectDepartmentsDeleting = (state) => state.departments.deleting;
export const selectDepartmentsSelectedRowIds = (state) => state.departments.selectedRowIds;
export const selectDepartmentsError = (state) => state.departments.error;