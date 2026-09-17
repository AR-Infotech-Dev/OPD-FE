import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAppointmentList,
  deleteAppointments,
} from "./appointment.service";

const initialState = {
  rows: [],
  pagination: {},
  page: 1,
  loading: false,
  deleting: false,
  selectedRowIds: [],
  error: "",
};

export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async ({ filterState, page }, { rejectWithValue }) => {
const res = await getAppointmentList({ filterState, page });

    if (!res.success) {
      return rejectWithValue(
        res?.message || "Error while fetching appointments"
      );
    }

    return {
      rows: res.data || [],
      pagination: res.pagination || {},
    };
  }
);

export const deleteAppointmentItems = createAsyncThunk(
  "appointment/deleteAppointmentItems",
  async (selectedRowIds, { rejectWithValue }) => {
    const res = await deleteAppointments(selectedRowIds);

    if (!res.success) {
      return rejectWithValue(
        res?.message || "Error while deleting appointments"
      );
    }

    return {
      message: res?.message || "Appointments deleted successfully",
      deletedIds: selectedRowIds,
    };
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,

  reducers: {
    setAppointmentPage(state, action) {
      state.page = action.payload || 1;
    },

    setAppointmentSelection(state, action) {
      state.selectedRowIds = Array.isArray(action.payload)
        ? action.payload
        : [];
    },

    clearAppointmentSelection(state) {
      state.selectedRowIds = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = "";
      })

      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.rows;
        state.pagination = action.payload.pagination;
        state.selectedRowIds = [];
      })

      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Error while fetching appointments";
      })

      .addCase(deleteAppointmentItems.pending, (state) => {
        state.deleting = true;
        state.error = "";
      })

      .addCase(deleteAppointmentItems.fulfilled, (state) => {
        state.deleting = false;
        state.selectedRowIds = [];
      })

      .addCase(deleteAppointmentItems.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload || "Error while deleting appointments";
      });
  },
});

export const {
  clearAppointmentSelection,
  setAppointmentPage,
  setAppointmentSelection,
} = appointmentSlice.actions;

export const selectAppointmentRows = (state) =>
  state.appointment.rows;

export const selectAppointmentPagination = (state) =>
  state.appointment.pagination;

export const selectAppointmentPage = (state) =>
  state.appointment.page;

export const selectAppointmentLoading = (state) =>
  state.appointment.loading;

export const selectAppointmentDeleting = (state) =>
  state.appointment.deleting;

export const selectAppointmentSelectedRowIds = (state) =>
  state.appointment.selectedRowIds;

export const selectAppointmentError = (state) =>
  state.appointment.error;

export default appointmentSlice.reducer;