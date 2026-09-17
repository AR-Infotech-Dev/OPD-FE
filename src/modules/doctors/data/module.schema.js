import { default_filter_fields } from "@/utils/common";
import { buildFallbackColumnsFromKeys } from "../../../utils/moduleStructure";
import { z } from "zod";



const FIXED_TABLE_COLUMNS = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  // { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
];
export const doctorsModuleSchema = {
  // Copy this object for the next module and update API paths, joined tables,
  // default columns, skip fields, label mappings, and form sections only.
  title: "Doctors",
  description: "Manage doctors, and approval access from one place.",
  menu_id: 20,
  primaryKey: 'doctor_id',
  api: {
    list: "/doctors",
    delete: "/doctors/delete",
    create: "/doctors/create",
    edit: "/doctors",
    definitions: "/system/getDefinations",
    definitionsFallback: "/system/getstructure",
  },
  definitionRequest: {
    menuIDField: "menu_id",
    modelNameField: "model_name",
    modelName: "doctor",
  },
  filterFieldOptions: {
    clinic_id: {
      type: "select",
      optionsSource: {
        apiUrl: "/system/searchList",
        body: {
          tableName: "clinic_master",
          list: "clinic_id,clinic_name",
          wherec: "clinic_name",
        },
        rowsPath: ["data"],
        valueKey: "clinic_id",
        labelKey: "clinic_name",
      },
    },
    ...default_filter_fields,
  },
  // defaultColumns: ["name", "doctorName", "email", "contactNo", "roleID", "status", "company_id"],
  // skipFields: ['default_company', "doctor_setting", "gfcmToken", "otp", "country_code", "otp_exp_time", "g_cal_token", "one_drive_access_token", "is_google_sync", "is_one_drive_sync", "ftoken", "isVerified", "photo", "adminID", "latitude", "longitude", "roleOfdoctor", "password"],
  defaultColumns: [],
  skipFields: [],
  tableCellConfig: [
    // { column_name: "name", type: "person" },
    { column_name: "doctor_name", type: "person" },
    // { column_name: "roleID", type: "tag" },
    { column_name: "status", type: "badge", color_field: "status_color" },
  ],
  columnMappings: [
    // { is_sys_doctor: "System Doctor" },
    // { isEmailSend: "Verification Email Sent" },
    // { contactNo: "Contact No" },
    // { whatsappNo: "Whatsapp No" },
    // { dateOfBirth: "Date Of Birth" },
    // { lastLogin: "Last Login" },
    // { company_id: "Company Name" },
    // { doctor_name: "Doctor Name" },
    // { roleID: "Doctor Role" },
    // { is_approver: "Approval Privileges" },
    // { otp: "OTP" },
  ],
  savedFilters: [],
  form: {
    initialValues: {
      doctor_id: null,
      clinic_id: 1,
      department_id: null,
      user_id: 0,

      doctor_code: null,
      doctor_name: null,
      display_name: null,

      mobile_no: null,
      email: null,

      qualification: null,
      specialization: null,
      registration_no: null,

      consultation_fee: null,
      followup_fee: null,

      profile_image: null,
      signature_image: null,

      status: "inactive",

      created_by: null,
      created_date: null,
      modified_by: null,
      modified_date: null,

      // doctor_id: null,
      // name: null,
      // default_company: null,
      // time_zone: "Asia/Kolkata",
      // company_id: null,
      // is_approver: "no",
      // doctorName: null,
      // email: null,
      // isEmailSend: "no",
      // password: null,
      // is_sys_doctor: "no",
      // roleID: null,
      // address: null,
      // google_location: null,
      // contactNo: null,
      // whatsappNo: null,
      // dateOfBirth: null,
      // created_by: null,
      // modified_by: null,
      // status: "inactive",
    },
    sections: [
      // `columns` decides the grid and each field controls label/type/required state.
      {
        columns: 2,
        fields: [
          // { name: "doctor_code", label: "Doctor Code", type: "text", required: true, placeholder: "Enter doctor code" },
          { name: "doctor_name", label: "Doctor Name", type: "text", required: true, placeholder: "Enter doctor name" },
          { name: "display_name", label: "Display Name", type: "text", placeholder: "Enter doctor display name" },

          // { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email" },
          // { name: "dateOfBirth", label: "Date of birth", type: "date", required: true, placeholder: "Birth date" },
        ]
      },
      {
        columns: 3,
        fields: [
          {
            name: "department_id",
            label: "Department Name",
            type: "select",
            required: true,
            options: [
              { value: "1", label: "General Medicine" },
              { value: "2", label: "General Surgery" },
              { value: "3", label: "Pediatrics" },
              { value: "4", label: "Gynecology" },
              { value: "5", label: "Orthopedics" },
              { value: "6", label: "Cardiology" },
              { value: "7", label: "Dermatology" },
              { value: "8", label: "Neurology" },
              { value: "9", label: "Radiology" },
              { value: "10", label: "Emergency Medicine" },
            ],
          },
          { name: "mobile_no", label: "Mobile Number", type: "text", required: true, placeholder: "Enter doctor mobile number" },
          { name: "email", label: "Email", type: "email", placeholder: "Enter email" },

          // { name: "doctorName", label: "Doctor Name", type: "text", required: true, disabled: true, placeholder: "Enter doctor name" },
          // { name: "whatsappNo", label: "Whatsapp Number", type: "text", placeholder: "Enter whatsapp number" },
          // {
          //   name: "time_zone",
          //   label: "Time Zone",
          //   type: "select",
          //   options: [
          //     { value: "Asia/Kolkata", label: "(UTC+05:30) India Standard Time (IST)" },
          //     { value: "UTC+04:00", label: "(UTC+04:00) Gulf Standard Time (GST)" },
          //     { value: "UTC+00:00", label: "(UTC+00:00) Greenwich Mean Time (GMT)" },
          //   ],
          // },
        ],
      },
      {
        columns: 3,
        fields: [
          { name: "qualification", label: "Qualification", type: "text", placeholder: "Enter qualification" },
          { name: "specialization", label: "Specialization", type: "text", placeholder: "Enter specialization" },
          { name: "registration_no", label: "Registration No", type: "number", placeholder: "Enter registration number" },

          // {
          //   name: "company_id",
          //   label: "Company",
          //   type: "smartSelectInput",
          //   required: true,
          //   id: "company_id",
          //   config: {
          //     apiUrl: "/system/searchList",
          //     type: "company",
          //     source: "company_master",
          //     list: "company_name,company_id",
          //     check: "company_name",
          //     preload: true,
          //     labelKey: "company_name",
          //     valueKey: "company_id",
          //     placeholder: "Select Company",
          //     multi: false
          //   }
          // },

        ]
      },
      {
        columns: 2,
        fields: [
          { name: "consultation_fee", label: "Consultation Fee", type: "number", placeholder: "Enter consultation fee" },
          { name: "followup_fee", label: "Follow-up Fee", type: "number", placeholder: "Enter follow-up fee" },
        ],
      },
      {
        columns: 2,
        fields: [
          { name: "profile_image", label: "Profile Image", type: "file", placeholder: "Upload profile image" },
          { name: "signature_image", label: "Signature Image", type: "file", placeholder: "Upload signature image" },
        ],
      },
      {
        columns: 1,
        fields: [
          {
            name: "status",
            label: "Status",
            type: "radio",
            required: true,
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
          // {
          //   name: "roleID",
          //   label: "Doctor Role",
          //   type: "smartSelect",
          //   required: true,
          //   id: "roleID",
          //   config: {
          //     type: 'roles',
          //     valueKey: 'role_id',
          //     source: 'doctor_role_master',
          //     statusCheck: true,
          //     getLabel: (item) => `${item.roleName}`,
          //     getValue: (item) => item.roleID,
          //     placeholder: 'Select Role',
          //     list: "roleName,roleID",
          //     allowAddNew: false, preload: false, cache: false, showRecent: false
          //   },
          //   // <SmartSelectInput
          //   //     id="customer" label="" value={defaultFormData?.customer_id}
          //   //     onSelect={(data) => {
          //   //       handleInputChange("customer_id", data)
          //   //     }}
          //   //     onObjectSelect={() => { }}
          //   // config={{
          //   //   type: 'customer', valueKey: 'customer_id', source: 'customer', statusCheck: true,
          //   //   getLabel: (item) => `${item.name}`,
          //   //   getValue: (item) => item.customer_id,
          //   //   placeholder: 'Select Customer',
          //   //   list: "name,customer_id",
          //   //   allowAddNew: true, preload: true, cache: true, showRecent: true
          //   // }}
          //   //   />
          // },
        ],
      },
    ],
  },
  validationSchema: z.object({

    // doctor_code: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
    //   message: "Doctor Code is required",
    // }),
    doctor_name: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
      message: "Doctor Name is required",
    }),
    display_name: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
      message: "Display Name is required",
    }),
    department_id: z.any().refine((value) => value !== "" && value !== null && value !== undefined, {
      message: "Department is required",
    }),
    mobile_no: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
      message: "Mobile No is required",
    }).refine((val) => /^\d{10}$/.test(val), {
      message: "Mobile No must be 10 digits",
    }),
    // email: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
    //   message: "Email is required",
    // }).refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    //   message: "Invalid email address",
    // }),
    // qualification: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
    //   message: "Qualification is required",
    // }),
    // specialization: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
    //   message: "Specialization is required",
    // }),
    // registration_no: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
    //   message: "Registration No is required",
    // }),
    consultation_fee: z.coerce.number().nullable().refine((val) => val !== null && val >= 0, {
      message: "Consultation Fee is required",
    }),
    followup_fee: z.coerce.number().nullable().refine((val) => val !== null && val >= 0, {
      message: "Follow-up Fee is required",
    }),
    profile_image: z.any().nullable(),
    signature_image: z.any().nullable(),
    status: z.string()
    

    // name: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
    //   message: "Name is required",
    // }),
    // doctorName: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
    //   message: "Doctor Name is required",
    // }),
    // email: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
    //   message: "Email is required",
    // }).refine((val) => /\S+@\S+\.\S+/.test(val), {
    //   message: "Invalid email address",
    // }),
    // dateOfBirth: z.coerce.date().nullable()
    //   .refine((val) => val !== null, {
    //     message: "Date of Birth is required",
    //   })
    //   .refine((val) => val && val >= new Date("1900-01-01"), {
    //     message: "Too old",
    //   })
    //   .refine((val) => val && val <= new Date(), {
    //     message: "Birth date cannot be in the future",
    //   }),
    // roleID: z.any().refine((value) => value !== "" && value !== null && value !== undefined, {
    //   message: "Role is required",
    // }),
    // status: z.string()
  })
};

export const doctorsFallbackColumns = [
  ...FIXED_TABLE_COLUMNS,
  ...buildFallbackColumnsFromKeys(doctorsModuleSchema.defaultColumns, {
    columnMappings: doctorsModuleSchema.columnMappings,
    tableCellConfig: doctorsModuleSchema.tableCellConfig,
  }),
];
