import { useEffect, useState } from "react";
import { patientsModuleSchema } from "./data/module.schema";
import { usePatientsTableConfig } from "./hooks/usePatientsTableConfig";
import { usePatientsModule } from "./hooks/usePatientsModule";
import { getNextSortConfig } from "@utils/sorting";
import { useModuleFilters, useAppSelector } from "@store/hooks";
import { selectPatientsRows } from "./data/patients.slice";

import ModuleControls from "@shared/ModuleControls";
import ModulePageLayout from "@shared/ModulePageLayout";
import ModulePagination from "@shared/ModulePagination";
import DynamicFilter from "@components/dynamic-filter";
import ResizableTable from "@components/table/ResizableTable";
import useMenuPermissions from "@auth/utils/useMenuPermissions";
import PatientForm from "./components/PatientForm";
import PatientTableRow from "./components/PatientTableRow";

function PatientsModulePage({ menu_id }) {

  const resolvedMenuID = menu_id || patientsModuleSchema.menu_id || null;
  const permissions = useMenuPermissions(resolvedMenuID);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const patientList = useAppSelector(selectPatientsRows);
  const { filterState, setSearchText, applyFilterPayload, setSort, clearFilters, } = useModuleFilters("patient-master", patientList);
  const { pagination, page, loading, deleting, selectedRowIds, getPatientList, handlePageChange, handleToggleRow, handleToggleAllRows, handleDeleteSelected, handleDeleteRow, } = usePatientsModule({ filterState });
  const { sortConfig, resolvedColumns, defaultVisibleColumnKeys, resolvedFilterFields, } = usePatientsTableConfig({ resolvedMenuID, filterState });

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
    getPatientList();
  }, [page, filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)]);

  useEffect(() => {
    if (page !== 1) {
      handlePageChange(1)
    }
  }, [filterState.searchText, filterState.order, filterState.order_by, JSON.stringify(filterState.filters)]);

  return (
    <>
      <ModulePageLayout
        title={patientsModuleSchema.title}
        description={patientsModuleSchema.description}
        controls={
          <ModuleControls
            canCreate={permissions.canAdd}
            canDelete={permissions.canDelete}
            loading={loading}
            onRefresh={getPatientList}
            onCreate={() => {
              setSelectedPatient(null);
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
                savedFilters={patientsModuleSchema.savedFilters}
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
            rows={patientList}
            storageKey="patients-module-column-widths"
            defaultVisibleColumnKeys={defaultVisibleColumnKeys}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            editRow={permissions.canEdit ? (patient) => {
              setSelectedPatient(patient);
              setIsFlyoutOpen(true);
            } : undefined}
            onDeleteRow={permissions.canDelete ? handleDeleteRow : undefined}
            allowSelection={permissions.canDelete}
            selectedRowIds={selectedRowIds}
            onToggleRow={handleToggleRow}
            onToggleAllRows={handleToggleAllRows}
            renderRow={(row, index, columns, table) => (
              <PatientTableRow
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
      <PatientForm
        isOpen={isFlyoutOpen}
        onClose={() => setIsFlyoutOpen(false)}
        selectedPatient={selectedPatient}
        onAfterSave={getPatientList}
        menu_id={resolvedMenuID}
      />
    </>
  );
}

export default PatientsModulePage;
