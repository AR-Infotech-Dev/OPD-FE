import { z } from "zod";

export const appointmentSchema = {
  title: "Appointments",
  description: "Manage patient appointments.",
  menu_id: null,

  primaryKey: "appointment_id",

  api: {
  list: "/appointments",
  create: "/appointments/create",
  edit: "/appointments",
  delete: "/appointments",
},

  definitionRequest: {
    menuIDField: "menu_id",
    modelNameField: "model_name",
    modelName: "appointments",
  },

  staticJoined: [],

  tableCellConfig: [
    { key: "appointment_id", column_name: "appointment_id", type: "text" },
    { key: "patient_name", column_name: "patient_name", type: "person" },
    { key: "doctor_name", column_name: "doctor_name", type: "text" },
    { key: "department_name", column_name: "department_name", type: "text" },
    { key: "appointment_date", column_name: "appointment_date", type: "date" },
    { key: "appointment_time", column_name: "appointment_time", type: "text" },
    { key: "consultation_fee", column_name: "consultation_fee", type: "text" },
    { key: "status", column_name: "status", type: "badge" },
  ],

  defaultColumns: [
    "appointment_id",
    "patient_name",
    "doctor_name",
    "department_name",
    "appointment_date",
    "appointment_time",
    "consultation_fee",
    "status",
  ],

  skipFields: [
    "created_by",
    "created_date",
    "modified_by",
    "modified_date",
  ],

  columnMappings: [
    { appointment_id: "Appointment ID" },
    { patient_name: "Patient Name" },
    { doctor_name: "Doctor Name" },
    { department_name: "Department" },
    { appointment_date: "Appointment Date" },
    { appointment_time: "Slot" },
    { consultation_fee: "Consultation Fee" },
    { status: "Status" },
  ],

  savedFilters: [],

  form: {
    initialValues: {
      appointment_id: null,
      patient_id: null,
      doctor_id: null,
      department_id: null,

      appointment_date: "",
      appointment_time: "",

      appointment_type: "new",

      consultation_fee: "",

      payment_mode: "pay_later",
      payment_status: "pending",

     status: "booked",
    },

    sections: [
      {
        title: "Appointment Details",
        columns: 2,
        fields: [
         {
  name: "patient_id",
  label: "Patient",
  type: "smartselect",
  required: true,
  placeholder: "Search patient",
  gridSpan: 6,
  config: {
    tableName: "patients",
    selectFields: "patient_id,full_name,mobile_no",
    searchField: "full_name",
    labelKey: "full_name",
    valueKey: "patient_id",
    status: "true",
  },
},
          { name: "department_id", label: "Department", type: "smartselect", required: true, placeholder: "Select department", gridSpan: 6, options: [{ label: "General Medicine", value: "1", consultation_fee: 500, }, { label: "Cardiology", value: "2", consultation_fee: 800, }, { label: "Dermatology", value: "3", consultation_fee: 600, }, { label: "Orthopedics", value: "4", consultation_fee: 700, },], },
        ]
      },
      {
        columns: 2,
        fields: [
          { name: "doctor_id", label: "Doctor", type: "smartselect", required: true, placeholder: "Select doctor", gridSpan: 6, options: [{ label: "Dr. Amit Patil", value: "1", department_id: "1", }, { label: "Dr. Sneha Joshi", value: "2", department_id: "1", }, { label: "Dr. Rahul Shah", value: "3", department_id: "2", }, { label: "Dr. Priya Kulkarni", value: "4", department_id: "3", }, { label: "Dr. Akshay Deshmukh", value: "5", department_id: "4", },], },
          { name: "appointment_date", label: "Appointment Date", type: "date", required: true, gridSpan: 6, },
        ]
      },
      {
        columns: 2,
        fields: [
          { name: "appointment_time", label: "Slot", type: "smartselect", required: true, placeholder: "Select slot", gridSpan: 8, options: [{ label: "Morning", value: "morning", }, { label: "Afternoon", value: "afternoon", }, { label: "Evening", value: "evening", },], },
        ]
      },
      {
        columns: 2,
        fields: [
       {
  name: "appointment_type",
  label: "Appointment Type",
  showRadio: true,
  isCard: true,
  description: "Choose how the patient will attend the appointment.",
  type: "radio",
  radioStyle: "card",
  options: [
    { label: "New", value: "new" },
    { label: "Follow Up", value: "follow_up" },
    { label: "Walk-in", value: "walk_in" },
  ],
  gridSpan: 12,
},]
      },
      {
        columns: 2,
        fields: [
          { name: "consultation_fee", label: "Consultation Fee", type: "text", placeholder: "₹ 0.00", disabled: true, gridSpan: 8, },
        ]
      },
      {
        columns: 2,
        fields: [
          { name: "payment_mode", isCard: true, label: "Payment Mode", description: "Select when the consultation payment should be made.", type: "radio", options: [{ label: "Pay Now", value: "pay_now", icon: "CreditCard" }, { label: "Pay Later", value: "pay_later", icon: "Clock3" },], gridSpan: 12, },
        ],
      },
    ],
  },

 validationSchema: z.object({
  patient_id: z.coerce
    .number()
    .int()
    .positive("Patient is required"),

  doctor_id: z.coerce
    .number()
    .int()
    .positive("Doctor is required"),

  department_id: z.coerce
    .number()
    .int()
    .positive("Department is required"),

  appointment_date: z
    .string()
    .min(1, "Appointment date is required"),

  appointment_time: z.enum(
    ["morning", "afternoon", "evening"],
    {
      message: "Appointment slot is required",
    }
  ),

  appointment_type: z.enum(
    ["new", "follow_up", "walk_in"],
    {
      message: "Appointment type is required",
    }
  ),

  // consultation_fee: z.any(),

  payment_mode: z.enum(
    ["pay_now", "pay_later"],
    {
      message: "Payment mode is required",
    }
  ),
}),
};

export const appointmentFallbackColumns =
  appointmentSchema.defaultColumns.map((key) => ({
    key,
    label:
      appointmentSchema.columnMappings.find(
        (mapping) => mapping[key]
      )?.[key] || key,
  }));