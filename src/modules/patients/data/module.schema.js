import { default_filter_fields } from "@/utils/common";
import { buildFallbackColumnsFromKeys } from "../../../utils/moduleStructure";
import { z } from "zod";



const FIXED_TABLE_COLUMNS = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  // { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
];
export const patientsModuleSchema = {
  // Copy this object for the next module and update API paths, joined tables,
  // default columns, skip fields, label mappings, and form sections only.
  title: "Patients",
  description: "Manage patients, and access from one place.",
  menu_id: 20,
  primaryKey: 'patient_id',
  api: {
    list: "/patients",
    delete: "/patients/delete",
    create: "/patients/create",
    edit: "/patients",
    definitions: "/system/getDefinations",
    definitionsFallback: "/system/getstructure",
  },
  definitionRequest: {
    menuIDField: "menu_id",
    modelNameField: "model_name",
    modelName: "patient",
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
  // defaultColumns: ["name", "patientName", "email", "contactNo", "roleID", "status", "company_id"],
  // skipFields: ['default_company', "patient_setting", "gfcmToken", "otp", "country_code", "otp_exp_time", "g_cal_token", "one_drive_access_token", "is_google_sync", "is_one_drive_sync", "ftoken", "isVerified", "photo", "adminID", "latitude", "longitude", "roleOfUser", "password"],
  defaultColumns: [],
  skipFields: [],
  tableCellConfig: [
    // { column_name: "name", type: "person" },
    // { column_name: "patientName", type: "person" },
    // { column_name: "roleID", type: "tag" },
    // { column_name: "status", type: "badge", color_field: "status_color" },
  ],
  columnMappings: [
    // { is_sys_user: "System User" },
    // { isEmailSend: "Verification Email Sent" },
    // { contactNo: "Contact No" },
    // { whatsappNo: "Whatsapp No" },
    // { date_of_birth: "Date Of Birth" },
    // { lastLogin: "Last Login" },
    // { company_id: "Company Name" },
    // { userName: "User Name" },
    // { roleID: "User Role" },
    // { is_approver: "Approval Privileges" },
    // { otp: "OTP" },
  ],
  savedFilters: [],
  form: {
    initialValues: {
      patient_id: null,
      clinic_id: 1,
      patient_code: null,

      first_name: null,
      middle_name: null,
      last_name: null,
      full_name: null,

      mobile_no: null,
      alternate_mobile_no: null,
      email: null,

      date_of_birth: null,
      age: null,
      age_unit: "years",

      gender: "male",
      blood_group: null,
      marital_status: null,

      address: null,
      city: null,
      state: null,
      pincode: null,

      allergies: null,

      status: "active",

      created_by: null,
      created_date: null,

      modified_by: null,
      modified_date: null
    },
    // {
    //   patient_id: null,
    //   adminID: null,
    //   name: null,
    //   default_company: null,
    //   time_zone: "Asia/Kolkata",
    //   company_id: null,
    //   is_approver: "no",
    //   patientName: null,
    //   email: null,
    //   isEmailSend: "no",
    //   password: null,
    //   // is_sys_user: "no",
    //   roleID: null,
    //   address: null,
    //   google_location: null,
    //   contactNo: null,
    //   whatsappNo: null,
    //   dateOfBirth: null,
    //   created_by: null,
    //   modified_by: null,
    //   status: "inactive",
    // },
    sections: [
      // `columns` decides the grid and each field controls label/type/required state.
      {
        columns: 3,
        fields: [
          { name: "first_name", label: "First Name", type: "text", required: true, placeholder: "Enter first name" },
          { name: "middle_name", label: "Middle Name", type: "text", placeholder: "Enter middle name" },
          { name: "last_name", label: "Last Name", type: "text", required: true, placeholder: "Enter last name" },
        ]
      },
      {
        columns: 2,
        fields: [
          { name: "full_name", label: "Patient Name", type: "text", required: true, readOnly: true, placeholder: "Enter patient name" },
          { name: "mobile_no", label: "Mobile Number", type: "text", required: true, placeholder: "Enter patient mobile number" },

          // { name: "email", label: "Email", type: "email", placeholder: "Enter email" },
          // { name: "date_of_birth", label: "Date of birth", type: "date", required: true, placeholder: "Birth date" },
        ]
      },
      {
        columns: 4,
        fields: [
          { name: "date_of_birth", label: "Date of birth", type: "date", required: true, placeholder: "Birth date" },
          { name: "age", label: "Age", type: "number", readOnly: true, placeholder: "Age" },
          {
            name: "age_unit",
            label: "Age Unit",
            type: "select",
            options: [
              { value: "years", label: "years" },
              { value: "months", label: "months" },
              { value: "days", label: "days" }
            ],
          },
          {
            name: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" }
            ],
          },

          // { name: "patientName", label: "Patient Name", type: "text", required: true, disabled: true, placeholder: "Enter patient name" },
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
        ]
      },
      {
        columns: 2,
        fields: [
          {
            name: "blood_group",
            label: "Blood Group",
            type: "select",
            options: [
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" }
            ]
          },
          { name: "email", label: "Email", type: "email", placeholder: "Enter email" },
        ]
      },
      // {
      //   columns: 3,
      //   fields: [
      //     // { name: "google_location", label: "Google Location", type: "text", placeholder: "Enter google location" },
      //     {
      //       name: "status",
      //       label: "Status",
      //       type: "radio",
      //       required: true,
      //       options: [
      //         { value: "active", label: "Active" },
      //         { value: "inactive", label: "Inactive" },
      //       ],
      //     },
      //   ]
      // },
      {
        columns: 1,
        fields: [
          { name: "address", label: "Address", type: "editor", placeholder: "Enter address", rows: 4 },
        ]
      },

      // {
      //   columns: 3,
      //   fields: [
      //     {
      //       name: "roleID",
      //       label: "Patient Role",
      //       type: "smartSelectInput",
      //       required: true,
      //       id: "roleID",
      //       config: {
      //         apiUrl: "/system/searchList",
      //         type: "role",
      //         source: "patient_role_master",
      //         list: "roleName,roleID",
      //         check: "roleName",
      //         preload: true,
      //         labelKey: "roleName",
      //         valueKey: "roleID",
      //         placeholder: "Select Role",
      //         multi: false
      //       }
      //     },
      //     {
      //       name: "company_id",
      //       label: "Company",
      //       type: "smartSelectInput",
      //       required: true,
      //       id: "company_id",
      //       config: {
      //         apiUrl: "/system/searchList",
      //         type: "company",
      //         source: "company_master",
      //         list: "company_name,company_id",
      //         check: "company_name",
      //         preload: true,
      //         labelKey: "company_name",
      //         valueKey: "company_id",
      //         placeholder: "Select Company",
      //         multi: false
      //       }
      //     },
      //     {
      //       name: "is_approver",
      //       label: "Approval Privileges",
      //       type: "radio",
      //       options: [
      //         { value: "yes", label: "Yes" },
      //         { value: "no", label: "No" },
      //       ],
      //     },
      //   ]
      // },
      // {
      //   columns: 3,
      //   fields: [
      // { name: "google_location", label: "Google Location", type: "text", placeholder: "Enter google location" },
      // {
      //   name: "roleID",
      //   label: "User Role",
      //   type: "smartSelect",
      //   required: true,
      //   id: "roleID",
      //   config: {
      //     type: 'roles',
      //     valueKey: 'role_id',
      //     source: 'user_role_master',
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
      //   ],
      // },

      // {
      //   columns: 1,
      //   fields: [
      //     { name: "address", label: "Address", type: "editor", placeholder: "Enter address", rows: 4 },
      //   ],
      // },
    ],
  },
  // validationSchema: z.object({
  //   name: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
  //     message: "Name is required",
  //   }),
  //   email: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
  //     message: "Email is required",
  //   }).refine((val) => /\S+@\S+\.\S+/.test(val), {
  //     message: "Invalid email address",
  //   }),
  //   patientName: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
  //     message: "Patient Name is required",
  //   }),
  //   dateOfBirth: z.coerce.date().nullable()
  //     .refine((val) => val !== null, {
  //       message: "Date of Birth is required",
  //     })
  //     .refine((val) => val && val >= new Date("1900-01-01"), {
  //       message: "Too old",
  //     })
  //     .refine((val) => val && val <= new Date(), {
  //       message: "Birth date cannot be in the future",
  //     }),
  //   roleID: z.any().refine((value) => value !== "" && value !== null && value !== undefined, {
  //     message: "Role is required",
  //   }),
  //   status: z.string()

  // })
  validationSchema: z.object({

    first_name: z.string()
      .nullable()
      .refine((val) => val !== null && val.trim() !== "", {
        message: "First Name is required",
      })
      .refine((val) => val && val.trim().length >= 2, {
        message: "First Name must be at least 2 characters",
      }),

    last_name: z.string()
      .nullable()
      .refine((val) => val !== null && val.trim() !== "", {
        message: "Last Name is required",
      })
      .refine((val) => val && val.trim().length >= 2, {
        message: "Last Name must be at least 2 characters",
      }),


    full_name: z.string()
      .nullable()
      .refine((val) => val !== null && val.trim() !== "", {
        message: "Patient Name is required",
      })
      .refine((val) => val && val.trim().length >= 2, {
        message: "Patient Name must be at least 2 characters",
      }),

    mobile_no: z.string()
      .nullable()
      .refine((val) => val !== null && val.trim() !== "", {
        message: "Mobile Number is required",
      })
      .refine((val) => /^\d{10}$/.test(val), {
        message: "Mobile Number must be 10 digits",
      }),

    date_of_birth: z.coerce.date()
      .nullable()
      .refine((val) => val !== null, {
        message: "Date of Birth is required",
      })
      .refine((val) => val && val >= new Date("1900-01-01"), {
        message: "Too old",
      })
      .refine((val) => val && val <= new Date(), {
        message: "Birth date cannot be in the future",
      }),

    gender: z.string()
      .nullable()
      .refine((val) => val !== null && val !== "", {
        message: "Gender is required",
      })
      .refine((val) => ["male", "female", "other"].includes(val), {
        message: "Invalid Gender",
      }),

  })
};

export const patientsFallbackColumns = [
  ...FIXED_TABLE_COLUMNS,
  ...buildFallbackColumnsFromKeys(patientsModuleSchema.defaultColumns, {
    columnMappings: patientsModuleSchema.columnMappings,
    tableCellConfig: patientsModuleSchema.tableCellConfig,
  }),
];
