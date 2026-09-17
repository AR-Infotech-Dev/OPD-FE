import { makeRequest } from "@/api/httpClient";
import { appointmentSchema } from "./module.schema";

export const getAppointmentList = async ({ filterState, page }) => {
  return await makeRequest(appointmentSchema.api.list, {
    method: "POST",
    body: {
      page,
      searchText: filterState.searchText,
      filters: filterState.filters,
      order: filterState.order,
      order_by: filterState.order_by,
    },
  });
};

export const deleteAppointments = async (selectedRowIds) => {
  return await makeRequest(appointmentSchema.api.delete, {
    method: "POST",
    body: {
      action: "delete",
      ids: selectedRowIds,
    },
  });
};

export const getAppointmentDetails = async (appointmentId) => {
  return await makeRequest(
    `${appointmentSchema.api.edit}/${appointmentId}`,
    {
      method: "GET",
    }
  );
};

export const saveAppointment = async ({
  mode,
  appointmentId,
  payload,
}) => {
  const saveUrl =
    mode === "create"
      ? appointmentSchema.api.create
      : `${appointmentSchema.api.edit}/${appointmentId}`;

  const method = mode === "create" ? "POST" : "PUT";

  return await makeRequest(saveUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};