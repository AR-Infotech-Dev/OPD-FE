import { makeRequest } from "@/api/httpClient";
import { departmentsModuleSchema } from "@modules/departments/data/module.schema";

export const getDepartmentsList = async ({ filterState, page }) => {
    return await makeRequest(departmentsModuleSchema.api.list, {
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
export const deleteDepartment = async (selectedRowIds) => {
    return await makeRequest(departmentsModuleSchema.api.delete, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            action: 'delete',
            ids: selectedRowIds,
        },
    });
}
export const getDepartmentDetails = async (department_id) => {
    return await makeRequest(
        `${departmentsModuleSchema.api.edit}/${department_id}`,
        {
            method: "GET",
        }
    );
}
export const saveDepartment = async ({ mode, department_id, formData }) => {
    const saveUrl = mode === "create" ? departmentsModuleSchema.api.create : `${departmentsModuleSchema.api.edit}/${department_id}`;
    const method = mode === "create" ? "PUT" : "POST";

    return makeRequest(saveUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
};
