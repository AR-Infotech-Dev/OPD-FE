import { z } from "zod";
import { Building, Settings } from "lucide-react";

export const clinicSettingSchema = {
  title: "Clinic Settings",
  description: "Manage clinics settings from one place.",
  menu_id: null,
  primaryKey: "clinic_id",
  api: {
    save: "/clinic-setting",
    logoUpload: "/clinic-setting/:id/logo",
    logoRemove: "/clinic-setting/:id/logo/remove",
  },
  columnMappings: [
    { sender_email: "Sender Email" },
    { cc_email: "CC Email" },
    { sender_name: "Sender Name" },
    { mobile_number: "Mobile Number" },
    { clinic_address: "Clinic Address" },
    { email_logo: "Email Logo" },
    { clinic_name: "Clinic Name" },
  ],
  form: {
    initialValues: {
      clinic_id: null,
      clinic_code: null,
      clinic_name: null,
      clinic_registration_no: null,
      clinic_phone: null,
      clinic_email: null,
      clinic_logo: null,
      address: null,
      city: null,
      state: null,
      pincode: null,
      working_days: null,
      clinic_open_time: null,
      clinic_close_time: null,
      weekly_off_day: null,
      default_slot_duration: null,
      appointment_prefix: null,
      appointment_padding: null,
      patient_prefix: null,
      patient_padding: null,
      token_reset: null,
      max_walk_in_per_doctor: null,
      allow_overbooking: null,
      prescription_footer: null,
      status: "active",
    },
    sections: [
      {
        title: 'Clinic Profile Settings',
        icon: Building,
        columns: 3,
        fields: [
          { name: 'clinic_name', label: 'Clinic Name', type: 'text', required: true, placeholder: 'Enter clinic name', gridSpan: 4 },
          { name: 'clinic_code', label: 'Clinic Code', type: 'text', placeholder: 'Enter clinic code', gridSpan: 4 },
          { name: 'clinic_registration_no', label: 'Registration Number', type: 'text', placeholder: 'Enter registration number', gridSpan: 4 },
        ],
      },
      {
        columns: 3,
        fields: [
          { name: 'clinic_phone', label: 'Mobile Number', type: 'tel', placeholder: 'Enter mobile number', gridSpan: 4 },
          { name: 'clinic_email', label: 'Email Address', type: 'email', placeholder: 'Enter email address', gridSpan: 4 },
          { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'Enter pincode', gridSpan: 4 },
        ],
      },
      {
        columns: 2,
        fields: [
          { name: 'address', label: 'Clinic Address', type: 'textarea', rows: 3, placeholder: 'Enter clinic address', gridSpan: 6 },
          { name: 'clinic_logo', label: 'Clinic Logo', type: 'file', gridSpan: 6, multiple: false, accept: 'image/png,image/jpeg,image/jpg,image/webp', maxSizeMB: 2, showPreview: true, buttonText: 'Choose or drop logo', helperText: 'PNG, JPG or WebP - maximum 2 MB' },
        ],
      },
      {
        title: 'Working Hours Settings',
        columns: 3,
        fields: [
          // { name: 'working_days', label: 'Working Days', type: 'select', gridSpan: 4, options: [{ value: 'monday', label: 'Monday' }, { value: 'tuesday', label: 'Tuesday' }, { value: 'wednesday', label: 'Wednesday' }, { value: 'thursday', label: 'Thursday' }, { value: 'friday', label: 'Friday' }, { value: 'saturday', label: 'Saturday' }, { value: 'sunday', label: 'Sunday' }] },
          { name: 'weekly_off_day', label: 'Weekly Off Day', type: 'select', gridSpan: 4, options: [{ value: 'monday', label: 'Monday' }, { value: 'tuesday', label: 'Tuesday' }, { value: 'wednesday', label: 'Wednesday' }, { value: 'thursday', label: 'Thursday' }, { value: 'friday', label: 'Friday' }, { value: 'saturday', label: 'Saturday' }, { value: 'sunday', label: 'Sunday' }] },
          { name: 'clinic_open_time', label: 'Clinic Opening Time', type: 'time', gridSpan: 4 },
          { name: 'clinic_close_time', label: 'Clinic Closing Time', type: 'time', gridSpan: 4 },
        ],
      },
      {
        columns: 3,
        fields: [
          { name: 'city', label: 'City', type: 'text', placeholder: 'Enter city', gridSpan: 4 },
          { name: 'state', label: 'State', type: 'text', placeholder: 'Enter state', gridSpan: 4 },
        ],
      },
      { columns: 1, fields: [] },
      {
        title: 'Appointment Settings',
        columns: 2,
        fields: [
          { name: 'default_slot_duration', label: 'Default Slot Duration', type: 'select', gridSpan: 6, options: [{ value: 10, label: '10 minutes' }, { value: 15, label: '15 minutes' }, { value: 20, label: '20 minutes' }] },
          { name: 'allow_overbooking', label: 'Allow Overbooking', type: 'radio', gridSpan: 6, options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
          { name: 'appointment_prefix', label: 'Appointment Prefix', type: 'text', placeholder: 'APT', required: true, gridSpan: 6 },
          { name: 'appointment_padding', label: 'Appointment Number Padding', type: 'number', placeholder: '6', gridSpan: 6 },
          { name: 'token_reset', label: 'Daily Token Reset', type: 'radio', gridSpan: 6, options: [{ value: 'daily', label: 'Daily' }] },
          { name: 'max_walk_in_per_doctor', label: 'Maximum Walk-in Patients', type: 'number', placeholder: '0', gridSpan: 6 },
        ],
      },
      {
        title: 'Patient Settings',
        columns: 2,
        fields: [
          { name: 'patient_prefix', label: 'Patient ID Prefix', type: 'text', placeholder: 'PAT', required: true, gridSpan: 6 },
          { name: 'patient_padding', label: 'Patient ID Number Padding', type: 'number', placeholder: '6', gridSpan: 6 },
          { name: 'default_language', label: 'Default Language', type: 'radio', gridSpan: 12, options: [{ value: 'en', label: 'English' }, { value: 'mr', label: 'Marathi' }] },
        ],
      },
      {
        title: 'Prescription Settings',
        columns: 2,
        fields: [
          { name: 'default_followup_days', label: 'Default Follow-up Days', type: 'number', placeholder: '7', gridSpan: 6 },
          { name: 'prescription_footer', plain_text: false, label: 'Prescription Footer Note', type: 'editor', placeholder: 'Provide prescription footer...', gridSpan: 12 },
        ],
      },
    ],
  },
  validationSchema: z.object({
    clinic_name: z.string().trim().min(1, "Clinic name is required"),
    clinic_phone: z.string().optional(),
    clinic_registration_no: z.string().optional(),
    clinic_email: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    pincode: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    status: z.enum(["active", "inactive", "delete"]),
  }),
};
