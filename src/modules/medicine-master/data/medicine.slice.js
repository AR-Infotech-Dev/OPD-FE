// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { deleteMedicine, getMedicineList } from "./medicine.service";

// const initialState = {
//     rows: [],           // -> list
//     pagination: {},     // -> API pagination info
//     page: 1,            // -> current page
//     loading: false,     // -> users fetch चालू आहे का
//     deleting: false,    // -> delete चालू आहे का
//     selectedRowIds: [], // -> selected user ids
//     error: "",          // -> API error message
// }

// export const fetchMedicine = createAsyncThunk(
//     "medicine/fetchMedicine",
//     async ({ filterState, page }, { rejectWithValue }) => {
//         const res = await getMedicineList({ filterState, page });

//         if (!res.success) {
//             return rejectWithValue(res?.message || "Error while fetching medicine");
//         }

//         return {
//             rows: res.data || [],
//             pagination: res.pagination || {},
//         };
//     }
// );
// export const deleteMedicine = createAsyncThunk(
//     "medicine/deleteMedicine",
//     async (selectedRowIds, { rejectWithValue }) => {
//         const res = await deleteMedicine(selectedRowIds);

//         if (!res.success) {
//             return rejectWithValue(res?.message || "Error while deleting medicine");
//         }

//         return {
//             message: res?.message || "Medicine deleted successfully",
//             deletedIds: selectedRowIds,
//         };
//     }
// );

// const medicineSlice = createSlice({
//     name: "medicine",
//     initialState,
//     reducers: {
//         setMedicinePage(state, action) {
//             state.page = action.payload || 1;
//         },
//         setMedicineRows(state, action) {
//             state.rows = action.payload || [];
//         },
//         setMedicineLoading(state, action) {
//             state.loading = action.payload;
//         },
//         setMedicineDeleting(state, action) {
//             state.deleting = action.payload;
//         },
//         setMedicinePagination(state, action) {
//             state.pagination = action.payload;
//         },
//         setMedicineSelection(state, action) {
//             state.selectedRowIds = Array.isArray(action.payload) ? action.payload : [];
//         },
//         clearMedicineSelection(state) {
//             state.selectedRowIds = [];
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchMedicine.pending, (state) => {
//                 state.loading = true;
//                 state.error = "";
//             })
//             .addCase(fetchMedicine.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.rows = action.payload.rows;
//                 state.pagination = action.payload.pagination;
//                 state.selectedRowIds = [];
//             })
//             .addCase(fetchMedicine.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload || "Error while fetching medicine";
//             })
//             .addCase(deleteMedicine.pending, (state) => {
//                 state.deleting = true;
//                 state.error = "";
//             })
//             .addCase(deleteMedicine.fulfilled, (state, action) => {
//                 state.deleting = false;
//                 state.selectedRowIds = [];
//             })
//             .addCase(deleteMedicine.rejected, (state, action) => {
//                 state.deleting = false;
//                 state.error = action.payload || "Error while deleting medicine";
//             });
//     }
// });

// export const {
//     setMedicinePage,
//     setMedicineRows,
//     setMedicineLoading,
//     setMedicineDeleting,
//     setMedicinePagination,
//     setMedicineSelection,
//     clearMedicineSelection,
// } = medicineSlice.actions;

// export default medicineSlice.reducer;

// export const selectMedicineRows = (state) => state.medicine.rows;
// export const selectMedicinePagination = (state) => state.medicine.pagination;
// export const selectMedicinePage = (state) => state.medicine.page;
// export const selectMedicineLoading = (state) => state.medicine.loading;
// export const selectMedicineDeleting = (state) => state.medicine.deleting;
// export const selectMedicineSelectedRowIds = (state) => state.medicine.selectedRowIds;
// export const selectMedicineError = (state) => state.medicine.error;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    deleteMedicine as deleteMedicineService,
    getMedicineList,
} from "./medicine.service";

const initialState = {
    rows: [],
    pagination: {},
    page: 1,
    loading: false,
    deleting: false,
    selectedRowIds: [],
    error: "",
};

export const fetchMedicine = createAsyncThunk(
    "medicine/fetchMedicine",
    async ({ filterState, page }, { rejectWithValue }) => {
        try {
            const res = await getMedicineList({
                filterState,
                page,
            });

            if (!res.success) {
                return rejectWithValue(
                    res?.message || "Error while fetching medicine"
                );
            }

            return {
                rows: res.data || [],
                pagination: res.pagination || {},
            };
        } catch (error) {
            return rejectWithValue(
                error?.message || "Error while fetching medicine"
            );
        }
    }
);

export const deleteMedicines = createAsyncThunk(
    "medicine/deleteMedicines",
    async (selectedRowIds, { rejectWithValue }) => {
        try {
            const res = await deleteMedicineService(selectedRowIds);

            if (!res.success) {
                return rejectWithValue(
                    res?.message || "Error while deleting medicine"
                );
            }

            return {
                message:
                    res?.message || "Medicine deleted successfully",
                deletedIds: selectedRowIds,
            };
        } catch (error) {
            return rejectWithValue(
                error?.message || "Error while deleting medicine"
            );
        }
    }
);

const medicineSlice = createSlice({
    name: "medicine",

    initialState,

    reducers: {
        setMedicinePage(state, action) {
            state.page = action.payload || 1;
        },

        setMedicineRows(state, action) {
            state.rows = action.payload || [];
        },

        setMedicineLoading(state, action) {
            state.loading = action.payload;
        },

        setMedicineDeleting(state, action) {
            state.deleting = action.payload;
        },

        setMedicinePagination(state, action) {
            state.pagination = action.payload;
        },

        setMedicineSelection(state, action) {
            state.selectedRowIds = Array.isArray(action.payload)
                ? action.payload
                : [];
        },

        clearMedicineSelection(state) {
            state.selectedRowIds = [];
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicine.pending, (state) => {
                state.loading = true;
                state.error = "";
            })

            .addCase(fetchMedicine.fulfilled, (state, action) => {
                state.loading = false;
                state.rows = action.payload.rows;
                state.pagination = action.payload.pagination;
                state.selectedRowIds = [];
            })

            .addCase(fetchMedicine.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Error while fetching medicine";
            })

            .addCase(deleteMedicines.pending, (state) => {
                state.deleting = true;
                state.error = "";
            })

            .addCase(deleteMedicines.fulfilled, (state) => {
                state.deleting = false;
                state.selectedRowIds = [];
            })

            .addCase(deleteMedicines.rejected, (state, action) => {
                state.deleting = false;
                state.error =
                    action.payload || "Error while deleting medicine";
            });
    },
});

export const {
    setMedicinePage,
    setMedicineRows,
    setMedicineLoading,
    setMedicineDeleting,
    setMedicinePagination,
    setMedicineSelection,
    clearMedicineSelection,
} = medicineSlice.actions;

export default medicineSlice.reducer;

export const selectMedicineRows = (state) => state.medicine.rows;
export const selectMedicinePagination = (state) =>
    state.medicine.pagination;
export const selectMedicinePage = (state) =>
    state.medicine.page;
export const selectMedicineLoading = (state) =>
    state.medicine.loading;
export const selectMedicineDeleting = (state) =>
    state.medicine.deleting;
export const selectMedicineSelectedRowIds = (state) =>
    state.medicine.selectedRowIds;
export const selectMedicineError = (state) =>
    state.medicine.error;