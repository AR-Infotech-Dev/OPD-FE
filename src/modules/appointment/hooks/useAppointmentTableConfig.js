import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { defaultSortConfig } from "@utils/sorting";
import {
  buildFilterFieldsFromStructure,
  buildTableColumnsFromStructure,
  getDefinitions,
} from "@utils/moduleStructure";

import {
  appointmentFallbackColumns,
  appointmentSchema,
} from "../data/module.schema";

export const useAppointmentTableConfig = ({
  resolvedMenuID,
  filterState,
}) => {
  const [fields, setFields] = useState([]);

  const sortConfig = {
    key: filterState.order_by || defaultSortConfig.key,
    direction: String(
      filterState.order || defaultSortConfig.direction
    ).toLowerCase(),
  };

  const columnOptions = {
    skipFields: appointmentSchema.skipFields,
    columnMappings: appointmentSchema.columnMappings,
    tableCellConfig: appointmentSchema.tableCellConfig,
  };

  const resolvedColumns = useMemo(
    () =>
      buildTableColumnsFromStructure(
        fields,
        appointmentFallbackColumns,
        columnOptions
      ),
    [fields]
  );

  const defaultVisibleColumnKeys = useMemo(
    () =>
      appointmentFallbackColumns.map(
        (column) => column.key
      ),
    []
  );

  const resolvedFilterFields = useMemo(
    () =>
      buildFilterFieldsFromStructure(
        fields,
        appointmentSchema.defaultColumns.map((key) => ({
          label:
            appointmentFallbackColumns.find(
              (column) => column.key === key
            )?.label || key,
          value: key,
          type: "text",
        })),
        columnOptions
      ),
    [fields]
  );

  const getColumnList = async () => {
    if (!resolvedMenuID) {
      setFields([]);
      return;
    }

    const res = await getDefinitions(resolvedMenuID);

    if (res?.success) {
      setFields(res.data || []);
      return;
    }

    toast.error(
      res?.message ||
        "Error while fetching appointment fields"
    );
  };

  useEffect(() => {
    getColumnList();
  }, [resolvedMenuID]);

  return {
    sortConfig,
    resolvedColumns,
    defaultVisibleColumnKeys,
    resolvedFilterFields,
  };
};