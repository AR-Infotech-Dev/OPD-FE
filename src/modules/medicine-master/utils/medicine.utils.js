import { medicineModuleSchema } from "../data/module.schema";

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
export function getSelectedLabel(field, value, selectedMedicine) {
  if (!value) {
    return "";
  }

  if (field.name === "roleID") {
    return selectedMedicine?.roleName || selectedMedicine?.role_name || selectedMedicine?.roleID || value;
  }

  if (field.name === "default_company") {
    return selectedMedicine?.company_name || selectedMedicine?.default_company_name || selectedMedicine?.default_company || value;
  }

  return value;
}
export function getMedicineIdentifier(medicine = {}) {
  return medicine?.adminID;
}
export function normalizeMedicineData(selectedMedicine = {}) {
  return {
    ...medicineModuleSchema.form.initialValues,
    ...selectedMedicine,
    userName: selectedMedicine?.userName || selectedMedicine?.user_name || "",
    contactNo: selectedMedicine?.contactNo || selectedMedicine?.contactno || "",
    whatsappNo: selectedMedicine?.whatsappNo || selectedMedicine?.whatsappno || "",
    // dateOfBirth: selectedMedicine?.dateOfBirth || selectedMedicine?.dateofbirth || "",
    roleID: selectedMedicine?.roleID || selectedMedicine?.roleid || selectedMedicine?.roleId || "",
    default_company: selectedMedicine?.default_company || selectedMedicine?.company_id || "",
    is_approver: selectedMedicine?.is_approver || "no",
    time_zone: selectedMedicine?.time_zone || "Asia/Kolkata",
    google_location: selectedMedicine?.google_location || "",
    address: selectedMedicine?.address || "",
    status: selectedMedicine?.status || "active",
    dateOfBirth: selectedMedicine?.dateOfBirth
      ? new Date(selectedMedicine.dateOfBirth).toISOString().split("T")[0]
      : "",
  };
}
export const generateCredentials = (name, birthDate) => {
  const cleanName = name.trim().toLowerCase().replace(/\s+/g, "");

  const dob = new Date(birthDate);
  const day = String(dob.getDate()).padStart(2, "0");
  const month = String(dob.getMonth() + 1).padStart(2, "0");
  const year = dob.getFullYear();
  const username = cleanName.split("_")[0] + "@" + year;
  const password = cleanName.charAt(0).toUpperCase() + day + month + "@" + String(year).slice(-2);

  return {
    userName: username,
    password: password,
  };
};
