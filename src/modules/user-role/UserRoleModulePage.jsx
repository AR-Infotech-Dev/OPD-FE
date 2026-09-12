import { useEffect, useState } from "react";

import { useAppSelector, useModuleFilters } from "../../store/hooks";
import { getNextSortConfig } from "../../utils/sorting";

import ModuleControls from "../shared/ModuleControls";
import ModulePageLayout from "../shared/ModulePageLayout";
import ModulePagination from "../shared/ModulePagination";

import DynamicFilter from "../../components/dynamic-filter";
import ResizableTable from "../../components/table/ResizableTable";
import useMenuPermissions from "@auth/utils/useMenuPermissions";
import { selectUserRoleRows } from "./data/userrole.slice";

import UserRoleForm from "./components/UserRoleForm";
import UserRoleTableRow from "./components/UserRoleTableRow";
import { userroleModuleSchema } from "./data/module.schema";
import { useUserRoleModule } from "./hooks/useUserRoleModule";
import { useUserRoleTableConfig } from "./hooks/useUserRoleTableConfig";

function UserRoleModulePage({ menu_id }) {
  const resolvedMenuID = menu_id || userroleModuleSchema.menu_id || null;
  const permissions = useMenuPermissions(resolvedMenuID);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(null);


  const userroleList = useAppSelector(selectUserRoleRows);
  const { filterState, setSearchText, applyFilterPayload, setSort, clearFilters } = useModuleFilters(
    "userroles",
    userroleList
  );
  const {
    pagination,
    page,
    loading,
    deleting,
    selectedRowIds,
    handlePageChange,
    getUserRoleList,
    handleToggleRow,
    handleToggleAllRows,
    handleDeleteSelected,
    handleDeleteRow,
  } = useUserRoleModule({ filterState });
  const {
    sortConfig,
    resolvedColumns,
    defaultVisibleColumnKeys,
    resolvedFilterFields,
  } = useUserRoleTableConfig({ resolvedMenuID, filterState });

  useEffect(() => {
    getUserRoleList();
  }, [page, filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)]);

  useEffect(() => {
    if (page !== 1) {
      handlePageChange(1);
    }
  }, [filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)]);

  return (
    <>
      <ModulePageLayout
        title={userroleModuleSchema.title}
        description={userroleModuleSchema.description}
        controls={
          <ModuleControls
            canCreate={permissions.canAdd}
            canDelete={permissions.canDelete}
            loading={loading}
            onRefresh={getUserRoleList}
            onCreate={() => {
              setSelectedUserRole(null);
              setIsFlyoutOpen(true);
            }}
            onDeleteSelected={handleDeleteSelected}
            showDelete={selectedRowIds.length > 0}
            deleteDisabled={deleting || loading || selectedRowIds.length === 0}
            deleting={deleting}
            createLabel="Add User Role"
            filter={
              <DynamicFilter
                filterState={filterState}
                fields={resolvedFilterFields}
                savedFilters={userroleModuleSchema.savedFilters}
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
            rows={userroleList}
            storageKey="userroles-module-column-widths"
            defaultVisibleColumnKeys={defaultVisibleColumnKeys}
            sortConfig={sortConfig}
            onSortChange={(columnKey) => {
              const nextSort = getNextSortConfig(sortConfig, columnKey);
              if (page !== 1) {
                handlePageChange(1);
              }
              setSort({
                order_by: nextSort.key,
                order: nextSort.direction.toUpperCase(),
              });
            }}
            editRow={permissions.canEdit ? (userrole) => {
              setSelectedUserRole(userrole);
              setIsFlyoutOpen(true);
            } : undefined}
            onDeleteRow={permissions.canDelete ? handleDeleteRow : undefined}
            allowSelection={permissions.canDelete}
            selectedRowIds={selectedRowIds}
            onToggleRow={handleToggleRow}
            onToggleAllRows={handleToggleAllRows}
            renderRow={(row, index, columns, table) => (
              <UserRoleTableRow
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

      <UserRoleForm
        isOpen={isFlyoutOpen}
        onClose={() => {
          setIsFlyoutOpen(false);
          setSelectedUserRole(null);
        }}
        selectedUserRole={selectedUserRole}
        onAfterSave={getUserRoleList}
        menu_id={resolvedMenuID}
      />
    </>
  );
}

export default UserRoleModulePage;
