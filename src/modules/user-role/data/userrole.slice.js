import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteUserRole, getUserRoleList } from "./userrole.service";

const initialState = {
    rows: [],           // -> list
    pagination: {},     // -> API pagination info
    page: 1,            // -> current page
    loading: false,     // -> user roles fetch चालू आहे का
    deleting: false,    // -> delete चालू आहे का
    selectedRowIds: [], // -> selected user ids
    error: "",          // -> API error message
}

export const fetchUserRole = createAsyncThunk(
    "userrole/fetchUserRole",
    async ({ filterState, page }, { rejectWithValue }) => {
        const res = await getUserRoleList({ filterState, page });

        if (!res.success) {
            return rejectWithValue(res?.message || "Error while fetching user roles");
        }

        return {
            rows: res.data || [],
            pagination: res.pagination || {},
        };
    }
);
export const deleteUser_Role = createAsyncThunk(
    "userrole/deleteUserRole",
    async (selectedRowIds, { rejectWithValue }) => {
        const res = await deleteUserRole(selectedRowIds);

        if (!res.success) {
            return rejectWithValue(res?.message || "Error while deleting user roles");
        }

        return {
            message: res?.message || "User roles deleted successfully",
            deletedIds: selectedRowIds,
        };
    }
);

const userrolesSlice = createSlice({
    name: "userroles",
    initialState,
    reducers: {
        setUserRolePage(state, action) {
            state.page = action.payload || 1;
        },
        setUserRoleRows(state, action) {
            state.rows = action.payload || [];
        },
        setUserRoleLoading(state, action) {
            state.loading = action.payload;
        },
        setUserRoleDeleting(state, action) {
            state.deleting = action.payload;
        },
        setUserRolePagination(state, action) {
            state.pagination = action.payload;
        },
        setUserRoleSelection(state, action) {
            state.selectedRowIds = Array.isArray(action.payload) ? action.payload : [];
        },
        clearUserRoleSelection(state) {
            state.selectedRowIds = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserRole.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(fetchUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.rows = action.payload.rows;
                state.pagination = action.payload.pagination;
                state.selectedRowIds = [];
            })
            .addCase(fetchUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error while fetching user roles";
            })
            .addCase(deleteUser_Role.pending, (state) => {
                state.deleting = true;
                state.error = "";
            })
            .addCase(deleteUser_Role.fulfilled, (state, action) => {
                state.deleting = false;
                state.selectedRowIds = [];
            })
            .addCase(deleteUser_Role.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload || "Error while deleting user roles";
            });
    }
});

export const {
    setUserRolePage,
    setUserRoleRows,
    setUserRoleLoading,
    setUserRoleDeleting,
    setUserRolePagination,
    setUserRoleSelection,
    clearUserRoleSelection,
} = userrolesSlice.actions;

export default userrolesSlice.reducer;

export const selectUserRoleRows = (state) => state.userrole.rows;
export const selectUserRolePagination = (state) => state.userrole.pagination;
export const selectUserRolePage = (state) => state.userrole.page;
export const selectUserRoleLoading = (state) => state.userrole.loading;
export const selectUserRoleDeleting = (state) => state.userrole.deleting;
export const selectUserRoleSelectedRowIds = (state) => state.userrole.selectedRowIds;
export const selectUserRoleError = (state) => state.userrole.error;