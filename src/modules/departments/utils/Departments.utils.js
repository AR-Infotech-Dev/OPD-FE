import { departmentsModuleSchema } from "../data/module.schema";

export function buildJoinedOptions(joinConfig, selectedValue, selectedLabel) {
  const configuredOptions = (joinConfig?.options || []).map((option) => ({
    value: option.value ?? option[joinConfig.primaryKey],
    label: option.label ?? option[joinConfig.labelKey],
  }));

  if (selectedValue && !configuredOptions.some((option) => String(option.value) === String(selectedValue))) {
    return [
      ...configuredOptions,
      {
        value: selectedValue,
        label: selectedLabel || selectedValue,
      },
    ];
  }

  return configuredOptions;
}
export function getSelectedLabel(field, value, selectedDepartment) {
  if (!value) {
    return "";
  }

  if (field.name === "roleID") {
    return selectedDepartment?.roleName || selectedDepartment?.role_name || selectedDepartment?.roleID || value;
  }

  if (field.name === "default_company") {
    return selectedDepartment?.company_name || selectedDepartment?.default_company_name || selectedDepartment?.default_company || value;
  }

  return value;
}
export function getDepartmentIdentifier(department = {}) {
  return department?.department_id;
}
export function normalizeDepartmentData(selectedDepartment = {}) {
  return {
    ...departmentsModuleSchema.form.initialValues,
    ...selectedDepartment,
    departmentName: selectedDepartment?.departmentName || selectedDepartment?.department_name || "",
    contactNo: selectedDepartment?.contactNo || selectedDepartment?.contactno || "",
    whatsappNo: selectedDepartment?.whatsappNo || selectedDepartment?.whatsappno || "",
    // dateOfBirth: selectedDepartment?.dateOfBirth || selectedDepartment?.dateofbirth || "",
    roleID: selectedDepartment?.roleID || selectedDepartment?.roleid || selectedDepartment?.roleId || "",
    default_company: selectedDepartment?.default_company || selectedDepartment?.company_id || "",
    is_approver: selectedDepartment?.is_approver || "no",
    time_zone: selectedDepartment?.time_zone || "Asia/Kolkata",
    google_location: selectedDepartment?.google_location || "",
    address: selectedDepartment?.address || "",
    status: selectedDepartment?.status || "active",
    dateOfBirth: selectedDepartment?.dateOfBirth
      ? new Date(selectedDepartment.dateOfBirth).toISOString().split("T")[0]
      : "",
  };
}
export const generateCredentials = (name, birthDate) => {
  const cleanName = name.trim().toLowerCase().replace(/\s+/g, "");

  const dob = new Date(birthDate);
  const day = String(dob.getDate()).padStart(2, "0");
  const month = String(dob.getMonth() + 1).padStart(2, "0");
  const year = dob.getFullYear();
  const departmentname = cleanName.split("_")[0] + "@" + year;
  const password = cleanName.charAt(0).toUpperCase() + day + month + "@" + String(year).slice(-2);

  return {
    departmentName: departmentname,
    password: password,
  };
};
