import { makeRequest } from "@/api/httpClient";
import { patientsModuleSchema } from "@modules/patients/data/module.schema";

export const getPatientsList = async ({ filterState, page }) => {
    return await makeRequest(patientsModuleSchema.api.list, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            status: "active",
            page,
            searchText: filterState.searchText,
            filters: filterState.filters,
            order: filterState.order,
            order_by: filterState.order_by,
        },
    });
}
export const deletePatient = async (selectedRowIds) => {
    return await makeRequest(patientsModuleSchema.api.delete, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            action: 'delete',
            ids: selectedRowIds,
        },
    });
}
export const getPatientDetails = async (patient_id) => {
    return await makeRequest(
        `${patientsModuleSchema.api.edit}/${patient_id}`,
        {
            method: "GET",
        }
    );
}
export const savePatient = async ({ mode, patient_id, formData }) => {
    const saveUrl = mode === "create" ? patientsModuleSchema.api.create : `${patientsModuleSchema.api.edit}/${patient_id}`;
    const method = mode === "create" ? "PUT" : "POST";

    return makeRequest(saveUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
};
