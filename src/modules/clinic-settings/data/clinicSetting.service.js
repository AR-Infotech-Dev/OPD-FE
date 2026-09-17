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

export const uploadClinicLogo = async ({ clinic_id, file }) => {
  const uploadFormData = new FormData();
  uploadFormData.append("clinic_logo", file);

  return await makeRequest(clinicSettingSchema.api.logoUpload.replace(":id", clinic_id), {
    method: "POST",
    body: uploadFormData,
  });
};

export const removeClinicLogo = async (clinic_id) => {
  return await makeRequest(clinicSettingSchema.api.logoRemove.replace(":id", clinic_id), {
    method: "DELETE",
    body: {},
  });
};