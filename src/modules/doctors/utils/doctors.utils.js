import { doctorsModuleSchema } from "../data/module.schema";

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
export function getSelectedLabel(field, value, selectedDoctor) {
  if (!value) {
    return "";
  }
if (field.name === "department_id") {
  return selectedDoctor?.department_name || selectedDoctor?.departmentName || value;
}

  if (field.name === "default_company") {
    return selectedDoctor?.company_name || selectedDoctor?.default_company_name || selectedDoctor?.default_company || value;
  }

  return value;
}
export function getDoctorIdentifier(doctor = {}) {
  return doctor?.doctor_id;
}
export function normalizeDoctorData(selectedDoctor = {}) {
  return {
    ...doctorsModuleSchema.form.initialValues,
    ...selectedDoctor,
    doctor_id: selectedDoctor?.doctor_id,
    doctor_code: selectedDoctor?.doctor_code || "",
    doctor_name: selectedDoctor?.doctor_name || "",
    display_name: selectedDoctor?.display_name || "",

    clinic_id: selectedDoctor?.clinic_id || "",
    department_id: selectedDoctor?.department_id || "",
    user_id: selectedDoctor?.user_id || "",

    mobile_no: selectedDoctor?.mobile_no || "",
    email: selectedDoctor?.email || "",

    qualification: selectedDoctor?.qualification || "",
    specialization: selectedDoctor?.specialization || "",
    registration_no: selectedDoctor?.registration_no || "",

    consultation_fee: selectedDoctor?.consultation_fee ?? "",
    followup_fee: selectedDoctor?.followup_fee ?? "",

    profile_image: selectedDoctor?.profile_image || "",
    signature_image: selectedDoctor?.signature_image || "",

    status: selectedDoctor?.status || "active",
  };
}
export const generateCredentials = (name, birthDate) => {
  const cleanName = name.trim().toLowerCase().replace(/\s+/g, "");

  const dob = new Date(birthDate);
  const day = String(dob.getDate()).padStart(2, "0");
  const month = String(dob.getMonth() + 1).padStart(2, "0");
  const year = dob.getFullYear();
  const doctorname = cleanName.split("_")[0] + "@" + year;
  const password = cleanName.charAt(0).toUpperCase() + day + month + "@" + String(year).slice(-2);

  return {
    doctorName: doctorname,
    password: password,
  };
};
