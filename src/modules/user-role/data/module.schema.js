import { z } from "zod";
import { buildFallbackColumnsFromKeys } from "../../../utils/moduleStructure";

const FIXED_TABLE_COLUMNS = [
  { key: "select", className: "check-col", checkbox: true, width: 42, minWidth: 42, resizable: false },
];

export const userroleModuleSchema = {
  title: "User Role Master",
  description: "Manage user roles and their permissions from one place.",
  menu_id: null,
  primaryKey: "roleID",
  api: {
    list: "/user-roles",
    delete: "/user-roles/delete",
    create: "/user-roles/create",
    edit: "/user-roles",
    definitions: "/system/getDefinations",
    definitionsFallback: "/system/getstructure",
  },
  definitionRequest: {
    menuIDField: "menu_id",
    modelNameField: "model_name",
    modelName: "user-roles",
  },
  staticJoined: [],
  tableCellConfig: [
    { column_name: "roleName", type: "text" },
    { column_name: "slug", type: "clip" },

  ],
  defaultColumns: [],
  skipFields: ["role", "groupID", "is_delete", "is_sys_user"],
  columnMappings: [
    { roleName: "Role Name" },
  ],
  savedFilters: [],
  form: {
    initialValues: {
      roleID: null,
      roleName: "",
      isDelete: "Y",
      slug: null,
      created_by: null,
      created_date: null,
      modified_by: null,
      modified_date: null,
      status: "active",
      company_id: null,
    },
    sections: [
      {
        columns: 2,
        fields: [
          { name: "roleName", label: "Role Name", type: "text", required: true, placeholder: "Enter role name", gridSpan: 6 },
          { name: "slug", label: "Slug", type: "text", required: true, placeholder: "Enter slug", gridSpan: 6 },
        ],
      },

    ],
  },
  validationSchema: z.object({
    roleName: z.string().nullable().refine((val) => val !== null && val.trim() !== "", {
      message: "Role Name is required",
    }),
    slug: z.string().trim().min(1, "Slug is required"),
    company_id: z.any().optional(),
  }),
};

export const userroleFallbackColumns = [
  ...FIXED_TABLE_COLUMNS,
  ...buildFallbackColumnsFromKeys(userroleModuleSchema.defaultColumns, {
    columnMappings: userroleModuleSchema.columnMappings,
    tableCellConfig: userroleModuleSchema.tableCellConfig,
  }),
];
