import { makeRequest } from "@api/httpClient";

export const getDashboard = async (dashboardFilter) => {
    return await makeRequest("/dashboard", {
        method: "POST",
        body: dashboardFilter
    });
}   