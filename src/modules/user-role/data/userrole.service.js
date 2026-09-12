import { makeRequest } from "@/api/httpClient";
import { userroleModuleSchema } from "./module.schema";

export const getUserRoleList = async ({ page, filterState }) => {
    return await makeRequest(userroleModuleSchema.api.list, {
        method: "POST",
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

export const deleteUserRole = async (selectedRowIds) => {
    return await makeRequest(userroleModuleSchema.api.delete, {
        method: "POST",
        body: {
            action: "delete",
            ids: selectedRowIds,
        },
    });
}

export const getUserRoleDetails = async (userRoleId) => {
    return await makeRequest(`${userroleModuleSchema.api.edit}/${userRoleId}`, {
        method: "GET",
    });
}

export const saveUserRole = async ({ mode, userRoleId, payload }) => {
    const saveUrl =
        mode === "create"
            ? userroleModuleSchema.api.create
            : `${userroleModuleSchema.api.edit}/${userRoleId}`;
    const method = mode === "create" ? "PUT" : "POST";

    return await makeRequest(saveUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}
