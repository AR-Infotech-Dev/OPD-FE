
import { useEffect, useState } from "react";

import { useModuleFilters } from "../../store/hooks";
import { getNextSortConfig } from "../../utils/sorting";
import ModuleControls from "../shared/ModuleControls";
import ModulePageLayout from "../shared/ModulePageLayout";
import ModulePagination from "../shared/ModulePagination";
import DynamicFilter from "../../components/dynamic-filter";
import ResizableTable from "../../components/table/ResizableTable";
import useMenuPermissions from "@auth/utils/useMenuPermissions";

import AppointmentForm from "./components/AppointmentForm";
import AppointmentTableRow from "./components/AppointmentTableRow";
import { appointmentSchema } from "./data/module.schema";
import { useAppointmentModule } from "./hooks/useAppointmentModule";
import { useAppointmentTableConfig } from "./hooks/useAppointmentTableConfig";

function AppointmentModulePage({ menu_id }) {
  const resolvedMenuID = menu_id || appointmentSchema.menu_id || null;
  const permissions = useMenuPermissions(resolvedMenuID);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  const {
    filterState,
    setSearchText,
    applyFilterPayload,
    setSort,
    clearFilters,
  } = useModuleFilters("appointment");

  const {
    appointmentList,
    pagination,
    page,
    loading,
    deleting,
    selectedRowIds,
    handlePageChange,
    getAppointments,
    handleToggleRow,
    handleToggleAllRows,
    handleDeleteSelected,
    handleDeleteRow,
  } = useAppointmentModule({ filterState });

  const {
    sortConfig,
    resolvedColumns,
    defaultVisibleColumnKeys,
    resolvedFilterFields,
  } = useAppointmentTableConfig({
    resolvedMenuID,
    filterState,
  });

  useEffect(() => {
    getAppointments();
  }, [
    page,
    filterState.searchText,
    filterState.order,
    filterState.order_by,
    JSON.stringify(filterState.filters),
  ]);

  useEffect(() => {
    if (page !== 1) {
      handlePageChange(1);
    }
  }, [
    filterState.searchText,
    filterState.order,
    filterState.order_by,
    JSON.stringify(filterState.filters),
  ]);

  const openCreateFlyout = () => {
    setSelectedAppointment(null);
    setIsFlyoutOpen(true);
  };

  const openEditFlyout = (appointment) => {
    setSelectedAppointment(appointment);
    setIsFlyoutOpen(true);
  };

  const closeFlyout = () => {
    setIsFlyoutOpen(false);
    setSelectedAppointment(null);
  };

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

  return (
    <>
      <ModulePageLayout
        title={appointmentSchema.title}
        description={appointmentSchema.description}
        controls={
          <ModuleControls
            canCreate={permissions.canAdd}
            canDelete={permissions.canDelete}
            loading={loading}
            onRefresh={getAppointments}
            onCreate={openCreateFlyout}
            onDeleteSelected={handleDeleteSelected}
            showDelete={selectedRowIds.length > 0}
            deleteDisabled={
              deleting ||
              loading ||
              selectedRowIds.length === 0
            }
            deleting={deleting}
            createLabel="Add Appointment"
            filter={
              <DynamicFilter
                filterState={filterState}
                fields={resolvedFilterFields}
                savedFilters={appointmentSchema.savedFilters}
                onSearch={setSearchText}
                onApplyFilters={applyFilterPayload}
                onSaveFilter={() => {}}
                onDeleteFilter={() => {}}
                onSelectSavedFilter={() => {}}
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
            rows={appointmentList}
            storageKey="appointment-module-column-widths"
            defaultVisibleColumnKeys={defaultVisibleColumnKeys}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            editRow={
              permissions.canEdit
                ? openEditFlyout
                : undefined
            }
            onDeleteRow={
              permissions.canDelete
                ? handleDeleteRow
                : undefined
            }
            allowSelection={permissions.canDelete}
            selectedRowIds={selectedRowIds}
            onToggleRow={handleToggleRow}
            onToggleAllRows={handleToggleAllRows}
            renderRow={(row, index, columns, table) => (
              <AppointmentTableRow
                row={row}
                index={index}
                columns={columns}
                table={table}
              />
            )}
          />
        }
        footer={
          <ModulePagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        }
      />

      <AppointmentForm
        isOpen={isFlyoutOpen}
        onClose={closeFlyout}
        selectedAppointment={selectedAppointment}
        onAfterSave={getAppointments}
        menu_id={resolvedMenuID}
      />
    </>
  );
}

export default AppointmentModulePage;



