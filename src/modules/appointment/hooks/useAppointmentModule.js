import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@store/hooks";

import {
  deleteAppointmentItems,
  fetchAppointments,
  selectAppointmentDeleting,
  selectAppointmentLoading,
  selectAppointmentPage,
  selectAppointmentPagination,
  selectAppointmentRows,
  selectAppointmentSelectedRowIds,
  setAppointmentPage,
  setAppointmentSelection,
  clearAppointmentSelection,
} from "../data/appointment.slice";

export const useAppointmentModule = ({ filterState }) => {
  const dispatch = useAppDispatch();

  const appointmentList = useAppSelector(selectAppointmentRows);
  const pagination = useAppSelector(selectAppointmentPagination);
  const page = useAppSelector(selectAppointmentPage);
  const loading = useAppSelector(selectAppointmentLoading);
  const deleting = useAppSelector(selectAppointmentDeleting);
  const selectedRowIds = useAppSelector(
    selectAppointmentSelectedRowIds
  );

  const getAppointments = async () => {
    const action = await dispatch(
      fetchAppointments({
        filterState,
        page,
      })
    );

    if (fetchAppointments.rejected.match(action)) {
      toast.error(
        action.payload || "Error while fetching appointments"
      );
    }
  };

  const handlePageChange = (nextPage) => {
    dispatch(setAppointmentPage(nextPage));
  };

  const handleToggleRow = (rowId, checked) => {
    const currentSelectedRowIds = Array.isArray(selectedRowIds)
      ? selectedRowIds
      : [];

    const nextSelectedRowIds = checked
      ? [...new Set([...currentSelectedRowIds, rowId])]
      : currentSelectedRowIds.filter(
          (item) => item !== rowId
        );

    dispatch(
      setAppointmentSelection(nextSelectedRowIds)
    );
  };

  const handleToggleAllRows = (checked) => {
    if (!checked) {
      dispatch(clearAppointmentSelection());
      return;
    }

    dispatch(
      setAppointmentSelection(
        appointmentList
          .map(
            (row) =>
              row?.appointment_id ?? row?.id
          )
          .filter(Boolean)
      )
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedRowIds.length) {
      toast.error("Please select at least one appointment.");
      return;
    }

    const action = await dispatch(
      deleteAppointmentItems(selectedRowIds)
    );

    if (deleteAppointmentItems.fulfilled.match(action)) {
      toast.success(
        action.payload?.message ||
          "Appointments deleted successfully."
      );

      await getAppointments();
      return;
    }

    toast.error(
      action.payload ||
        "Error while deleting appointments"
    );
  };

  const handleDeleteRow = async (row) => {
    const rowId =
      row?.appointment_id ?? row?.id;

    if (!rowId) {
      toast.error("Appointment id not found.");
      return;
    }

    const action = await dispatch(
      deleteAppointmentItems([rowId])
    );

    if (deleteAppointmentItems.fulfilled.match(action)) {
      toast.success(
        action.payload?.message ||
          "Appointment deleted successfully."
      );

      await getAppointments();
      return;
    }

    toast.error(
      action.payload ||
        "Error while deleting appointment"
    );
  };

  return {
    appointmentList,
    pagination,
    page,
    loading,
    deleting,
    selectedRowIds,
    handlePageChange,
    getAppointments,
    handleToggleRow,
    handleToggleAllRows,
    handleDeleteSelected,
    handleDeleteRow,
  };
};