import { default_filter_fields } from "@/utils/common";
import { buildFallbackColumnsFromKeys } from "../../../utils/moduleStructure";
import { z } from "zod";

const FIXED_TABLE_COLUMNS = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
  // { key: "favorite", className: "icon-col", width: 42, minWidth: 42, resizable: false },
];
export const departmentsModuleSchema = {
  // Copy this object for the next module and update API paths, joined tables,
  // default columns, skip fields, label mappings, and form sections only.
  title: "Departments",
  description: "Manage departments, roles, company assignment, and approval access from one place.",
  menu_id: 20,
  primaryKey: 'department_id',
  api: {
    list: "/departments",
    delete: "/departments/delete",
    create: "/departments/create",
    edit: "/departments",
    definitions: "/system/getDefinations",
    definitionsFallback: "/system/getstructure",
  },
  definitionRequest: {
    menuIDField: "menu_id",
    modelNameField: "model_name",
    modelName: "department",
  },
   filterFieldOptions: {
   
    ...default_filter_fields,
  },
  defaultColumns: [ "department_code", "department_name", "status", ],
  skipFields: ["description"],
  tableCellConfig: [
    { column_name: "department_name", type: "text" },
    { column_name: "department_code", type: "text" },
     { column_name: "status", type: "badge" },
    // { column_name: "status", type: "badge", color_field: "status_color" },
  ],
  columnMappings: [
    { clinic_id: "Clinic ID" },
  { department_code: "Department Code" },
  { department_name: "Department Name" },
  { description: "Description" },
  { status: "Status" },
  ],
  savedFilters: [],
  form: {
   initialValues: {
  department_id: null,
  clinic_id: 1,
  department_code: null,
  department_name: null,
  description: null,
  status: "active",
  created_by: null,
  created_date: null,
  modified_by: null,
  modified_date: null,
},
    sections: [
      // `columns` decides the grid and each field controls label/type/required state.
      {
        columns: 2,
        fields: [
          { name: "department_name", label: "Department Name", type: "text", required: true, placeholder: "Enter department name", },
         { name: "department_code", label: "Department Code", type: "text", required: true, placeholder: "Enter department code", },
        ]
      },
      // {
      //      columns: 2,
      //   fields: [
      //     { name: "clinic_id", label: "Clinic", type: "select", required: true, }, ]
      
      //   },
      {
        columns: 1,
        fields: [
          { name: "description", label: "Description", type: "editor", placeholder: "Enter description", rows: 4, },
        ],
      },
      {
        columns: 1,
        fields: [
        { name: "status", label: "Status", type: "radio",
          options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
           ],
        },
      ],
      },
      
    ],
  },
    
 validationSchema: z.object({
  clinic_id: z.any().refine(
    (value) => value !== "" && value !== null && value !== undefined,
    {
      message: "Clinic ID is required",
    }
  ),



  department_code: z.string().nullable().refine(
    (val) => val !== null && val.trim() !== "",
    {
      message: "Department Code is required",
    }
  ),

  department_name: z.string().nullable().refine(
    (val) => val !== null && val.trim() !== "",
    {
      message: "Department Name is required",
    }
  ),

  description: z.string().nullable(),

  status: z.string().refine(
    (val) => val === "active" || val === "inactive",
    {
      message: "Status is required",
    }
  ),
})
};

export const departmentsFallbackColumns = [
  ...FIXED_TABLE_COLUMNS,
  ...buildFallbackColumnsFromKeys(departmentsModuleSchema.defaultColumns, {
    columnMappings: departmentsModuleSchema.columnMappings,
    tableCellConfig: departmentsModuleSchema.tableCellConfig,
  }),
];
