// import { Settings } from "lucide-react";
// import { TestTube } from "lucide-react";
// import { useEffect, useState } from "react";
// import { departmentsModuleSchema } from "./data/module.schema";
// import { useDepartmentsTableConfig } from "./hooks/useDepartmentsTableConfig";
// import { useDepartmentsModule } from "./hooks/useDepartmentsModule";
// import { getNextSortConfig } from "@utils/sorting";
// import { useModuleFilters, useAppSelector } from "@store/hooks";
// import { selectDepartmentsRows } from "./data/departments.slice";

// import ModuleControls from "@shared/ModuleControls";
// import ModulePageLayout from "@shared/ModulePageLayout";
// import ModulePagination from "@shared/ModulePagination";
// import DynamicFilter from "@components/dynamic-filter";
// import ResizableTable from "@components/table/ResizableTable";
// import useMenuPermissions from "@auth/utils/useMenuPermissions";
// import DepartmentForm from "./components/DepartmentForm";
// import DepartmentTableRow from "./components/DepartmentTableRow";

// function DepartmentsModulePage({ menu_id }) {

//   const resolvedMenuID = menu_id || departmentsModuleSchema.menu_id || null;
//   const permissions = useMenuPermissions(resolvedMenuID);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
//   const departmentList = useAppSelector(selectDepartmentsRows);
//   const { filterState, setSearchText, applyFilterPayload, setSort, clearFilters, } = useModuleFilters("department-master", departmentList);
//   const { pagination, page, loading, deleting, selectedRowIds, getDepartmentList, handlePageChange, handleToggleRow, handleToggleAllRows, handleDeleteSelected, handleDeleteRow, } = useDepartmentsModule({ filterState });
//   const { sortConfig, resolvedColumns, defaultVisibleColumnKeys, resolvedFilterFields, } = useDepartmentsTableConfig({ resolvedMenuID, filterState });

//   const handleSortChange = (columnKey) => {
//     const nextSort = getNextSortConfig(sortConfig, columnKey);

//     if (page !== 1) {
//       handlePageChange(1);
//     }

//     setSort({
//       order_by: nextSort.key,
//       order: nextSort.direction.toUpperCase(),
//     });
//   };

//   useEffect(() => {
//     getDepartmentList();
//   }, [page, filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)]);

//   useEffect(() => {
//     if (page !== 1) {
//       handlePageChange(1)
//     }
//   }, [filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)]);

//   return (
//     <>
//       <ModulePageLayout
//         title={departmentsModuleSchema.title}
//         description={departmentsModuleSchema.description}
//         controls={
//           <ModuleControls
//             canCreate={permissions.canAdd}
//             canDelete={permissions.canDelete}
//             loading={loading}
//             onRefresh={getDepartmentList}
//             onCreate={() => {
//               setSelectedDepartment(null);
//               setIsFlyoutOpen(true);
//             }}
//             onDeleteSelected={handleDeleteSelected}
//             showDelete={selectedRowIds.length !== 0}
//             deleteDisabled={deleting || loading || selectedRowIds.length === 0}
//             deleteLabel={`Delete Selected${selectedRowIds.length ? ` (${selectedRowIds.length})` : ""}`}
//             deleting={deleting}
//             filter={
//               <DynamicFilter
//                 filterState={filterState}
//                 fields={resolvedFilterFields}
//                 savedFilters={departmentsModuleSchema.savedFilters}
//                 onSearch={setSearchText}
//                 onApplyFilters={applyFilterPayload}
//                 onSaveFilter={() => { }}
//                 onDeleteFilter={() => { }}
//                 onSelectSavedFilter={() => { }}
//                 onClearFilters={clearFilters}
//               />
//             }
//           />
//         }
//         table={
//           <ResizableTable
//             loading={loading}
//             menuId={resolvedMenuID}
//             columns={resolvedColumns}
//             rows={departmentList}
//             storageKey="departments-module-column-widths"
//             defaultVisibleColumnKeys={defaultVisibleColumnKeys}
//             sortConfig={sortConfig}
//             onSortChange={handleSortChange}
//             editRow={permissions.canEdit ? (department) => {
//               setSelectedDepartment(department);
//               setIsFlyoutOpen(true);
//             } : undefined}
//             onDeleteRow={permissions.canDelete ? handleDeleteRow : undefined}
//             allowSelection={permissions.canDelete}
//             selectedRowIds={selectedRowIds}
//             onToggleRow={handleToggleRow}
//             onToggleAllRows={handleToggleAllRows}
//             renderRow={(row, index, columns, table) => (
//               <DepartmentTableRow
//                 row={row}
//                 index={index}
//                 columns={columns}
//                 table={table}
//               />
//             )}
//           />
//         }
//         footer={<ModulePagination pagination={pagination} onPageChange={handlePageChange} />}
//       />
//       <DepartmentForm
//         isOpen={isFlyoutOpen}
//         onClose={() => setIsFlyoutOpen(false)}
//         selectedDepartment={selectedDepartment}
//         onAfterSave={getDepartmentList}
//         menu_id={resolvedMenuID}
//       />
//     </>
//   );
// }

// export default DepartmentsModulePage;














import {Beaker} from "lucide-react";
import { useEffect, useState } from "react";

import { departmentsModuleSchema } from "./data/module.schema";
import { useDepartmentsTableConfig } from "./hooks/useDepartmentsTableConfig";
import { useDepartmentsModule } from "./hooks/useDepartmentsModule";
import { getNextSortConfig } from "@utils/sorting";
import { useModuleFilters, useAppSelector } from "@store/hooks";
import { selectDepartmentsRows } from "./data/departments.slice";

import PreTestForm from "./components/PreTestForm";
import ModuleControls from "@shared/ModuleControls";
import ModulePageLayout from "@shared/ModulePageLayout";
import ModulePagination from "@shared/ModulePagination";
import DynamicFilter from "@components/dynamic-filter";
import ResizableTable from "@components/table/ResizableTable";
import useMenuPermissions from "@auth/utils/useMenuPermissions";
import DepartmentForm from "./components/DepartmentForm";
import DepartmentTableRow from "./components/DepartmentTableRow";

function DepartmentsModulePage({ menu_id }) {

  const resolvedMenuID = menu_id || departmentsModuleSchema.menu_id || null;
  const permissions = useMenuPermissions(resolvedMenuID);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

const [selectedDepartmentConfiguration, setSelectedDepartmentConfiguration] = useState(null);
const [isConfigurationFlyoutOpen, setIsConfigurationFlyoutOpen] = useState(false);

  const departmentList = useAppSelector(selectDepartmentsRows);
  const { filterState, setSearchText, applyFilterPayload, setSort, clearFilters, } = useModuleFilters("department-master", departmentList);
  const { pagination, page, loading, deleting, selectedRowIds, getDepartmentList, handlePageChange, handleToggleRow, handleToggleAllRows, handleDeleteSelected, handleDeleteRow, } = useDepartmentsModule({ filterState });
  const { sortConfig, resolvedColumns, defaultVisibleColumnKeys, resolvedFilterFields, } = useDepartmentsTableConfig({ resolvedMenuID, filterState });

  const handleSortChange = (columnKey) => {
    const nextSort = getNextSortConfig(sortConfig, columnKey);

    if (page !== 1) {
      handlePageChange(1);
    }

    setSort({
      order_by: nextSort.key,
      order: nextSort.direction.toUpperCase(),
    });
  };

  useEffect(() => {
    getDepartmentList();
  }, [page, filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)]);

  useEffect(() => {
    if (page !== 1) {
      handlePageChange(1)
    }
  }, [filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)]);

  return (
    <>
      <ModulePageLayout
        title={departmentsModuleSchema.title}
        description={departmentsModuleSchema.description}
        controls={
          <ModuleControls
            canCreate={permissions.canAdd}
            canDelete={permissions.canDelete}
            loading={loading}
            onRefresh={getDepartmentList}
            onCreate={() => {
              setSelectedDepartment(null);
              setIsFlyoutOpen(true);
            }}
            onDeleteSelected={handleDeleteSelected}
            showDelete={selectedRowIds.length !== 0}
            deleteDisabled={deleting || loading || selectedRowIds.length === 0}
            deleteLabel={`Delete Selected${selectedRowIds.length ? ` (${selectedRowIds.length})` : ""}`}
            deleting={deleting}
            filter={
              <DynamicFilter
                filterState={filterState}
                fields={resolvedFilterFields}
                savedFilters={departmentsModuleSchema.savedFilters}
                onSearch={setSearchText}
                onApplyFilters={applyFilterPayload}
                onSaveFilter={() => { }}
                onDeleteFilter={() => { }}
                onSelectSavedFilter={() => { }}
                onClearFilters={clearFilters}
              />
            }
          />
        }
        table={
          <ResizableTable
            loading={loading}
            menuId={resolvedMenuID}
            columns={resolvedColumns}
            rows={departmentList}
            
            rowActions={[
  {
    key: "configuration",
    label: "Configuration",
    icon: Beaker,
    onClick: (department) => {
      setSelectedDepartmentConfiguration(department);
      setIsConfigurationFlyoutOpen(true);
    },
  },
]}

            storageKey="departments-module-column-widths"
            defaultVisibleColumnKeys={defaultVisibleColumnKeys}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            editRow={permissions.canEdit ? (department) => {
              setSelectedDepartment(department);
              setIsFlyoutOpen(true);
            } : undefined}
            onDeleteRow={permissions.canDelete ? handleDeleteRow : undefined}
            allowSelection={permissions.canDelete}
            selectedRowIds={selectedRowIds}
            onToggleRow={handleToggleRow}
            onToggleAllRows={handleToggleAllRows}
            renderRow={(row, index, columns, table) => (
              <DepartmentTableRow
                row={row}
                index={index}
                columns={columns}
                table={table}
              />
            )}
          />
        }
        footer={<ModulePagination pagination={pagination} onPageChange={handlePageChange} />}
      />
      <DepartmentForm
        isOpen={isFlyoutOpen}
        onClose={() => setIsFlyoutOpen(false)}
        selectedDepartment={selectedDepartment}
        onAfterSave={getDepartmentList}
        menu_id={resolvedMenuID}
      />
      <PreTestForm
  isOpen={isConfigurationFlyoutOpen}
  onClose={() => setIsConfigurationFlyoutOpen(false)}
  selectedDepartment={selectedDepartmentConfiguration}
  onAfterSave={getDepartmentList}
  menu_id={resolvedMenuID}
/>
    </>
  );
}

export default DepartmentsModulePage;
