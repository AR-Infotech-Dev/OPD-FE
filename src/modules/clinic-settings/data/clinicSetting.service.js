import { makeRequest } from "@/api/httpClient";
import { clinicSettingSchema } from "./module.schema";

export const getClinicDetails = async (clinicId) => {
  return await makeRequest(`${clinicSettingSchema.api.save}/${clinicId}`, {
    method: "GET",
  });
};

export const saveClinic = async ({ mode, clinicId, payload }) => {
  const saveUrl =
    mode === "create"
      ? clinicSettingSchema.api.create
      : `${clinicSettingSchema.api.save}/${clinicId}`;
  const method = mode === "create" ? "PUT" : "POST";

  return await makeRequest(saveUrl, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};