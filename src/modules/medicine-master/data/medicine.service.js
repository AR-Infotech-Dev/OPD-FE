import { makeRequest } from "@/api/httpClient";
import { medicineModuleSchema } from "@modules/medicine-master/data/module.schema";

export const getMedicineList = async ({ filterState, page }) => {
    return await makeRequest(medicineModuleSchema.api.list, {
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
export const deleteMedicine = async (selectedRowIds) => {
    return await makeRequest(medicineModuleSchema.api.delete, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            action: 'delete',
            ids: selectedRowIds,
        },
    });
}
export const getMedicineDetails = async (medicineID) => {
    return await makeRequest(
        `${medicineModuleSchema.api.edit}/${medicineID}`,
        {
            method: "GET",
        }
    );
}
export const saveMedicine = async ({ mode, medicineID, formData }) => {
    const saveUrl = mode === "create" ? medicineModuleSchema.api.create : `${medicineModuleSchema.api.edit}/${medicineID}`;
    const method = mode === "create" ? "PUT" : "POST";

    return makeRequest(saveUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
};
