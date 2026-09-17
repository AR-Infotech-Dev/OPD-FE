import { makeRequest } from "@/api/httpClient";
import { doctorsModuleSchema } from "@modules/doctors/data/module.schema";

export const getDoctorsList = async ({ filterState, page }) => {
    return await makeRequest(doctorsModuleSchema.api.list, {
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
export const deleteDoctor = async (selectedRowIds) => {
    return await makeRequest(doctorsModuleSchema.api.delete, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            action: 'delete',
            ids: selectedRowIds,
        },
    });
}
export const getDoctorDetails = async (doctor_id) => {
    return await makeRequest(
        `${doctorsModuleSchema.api.edit}/${doctor_id}`,
        {
            method: "GET",
        }
    );
}
export const saveDoctor = async ({ mode, doctor_id, formData }) => {
    const saveUrl = mode === "create" ? doctorsModuleSchema.api.create : `${doctorsModuleSchema.api.edit}/${doctor_id}`;
    const method = mode === "create" ? "PUT" : "POST";

    return makeRequest(saveUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
};
