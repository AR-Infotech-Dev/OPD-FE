// import { userroleModuleSchema } from "../data/module.schema";

// export function getUserRoleIdentifier(userrole = {}) {
//   return userrole?.userrole_id || userrole?.id;
// }

// export function normalizeUserRoleData(userrole = {}) {
//   return {
//     ...userroleModuleSchema.form.initialValues,
//     ...userrole,
//     userrole_name: userrole?.userrole_name || userrole?.userRoleName || userrole?.name || "",
//     userrole_type: userrole?.userrole_type || "",
//     userrole_description: userrole?.userrole_description || "",
//     company_id: userrole?.company_id || null,
//   };
// }

// export function normalizeUserRoleSavePayload(formData = {}) {
//   const payload = {
//     userrole_name: formData.userrole_name,
//     userrole_type: formData.userrole_type || null,
//     userrole_description: formData.userrole_description || null,
//   };

//   if (formData.userrole_id) payload.userrole_id = formData.userrole_id;
//   if (formData.company_id) payload.company_id = formData.company_id;

//   return payload;
// }


import { userroleModuleSchema } from "../data/module.schema";

export function getUserRoleIdentifier(userrole = {}) {
  return userrole?.roleID || userrole?.id;
}

export function slugifyUserRole(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
}

export function normalizeUserRoleData(userrole = {}) {
  return {
    ...userroleModuleSchema.form.initialValues,
    ...userrole,
    roleName: userrole?.roleName || "",
    slug: userrole?.slug || "",
    company_id: userrole?.company_id || null,
    status: userrole?.status || "inactive",
  };
}

export function normalizeUserRoleSavePayload(formData = {}) {
  return {
    ...formData,
    slug: slugifyUserRole(formData.slug || formData.roleName),
  };
}