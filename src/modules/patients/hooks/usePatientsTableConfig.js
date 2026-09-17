import { toast } from "react-toastify";
import { useMemo, useState, useEffect } from "react";
import { defaultSortConfig } from "@utils/sorting";
import { getDefinitions, buildFilterFieldsFromStructure, buildTableColumnsFromStructure, } from "@utils/moduleStructure";
import { patientsFallbackColumns, patientsModuleSchema } from "../data/module.schema";

export const usePatientsTableConfig = ({ resolvedMenuID, filterState }) => {

    const [fields, setFields] = useState([]);

    const sortConfig = {
        key: filterState.order_by || defaultSortConfig.key,
        direction: String(filterState.order || defaultSortConfig.direction).toLowerCase(),
    };

    const columnOptions = {
        skipFields: patientsModuleSchema.skipFields,
        columnMappings: patientsModuleSchema.columnMappings,
        tableCellConfig: patientsModuleSchema.tableCellConfig,
        filterFieldOptions: patientsModuleSchema.filterFieldOptions,
    };

    const resolvedColumns = useMemo(
        () => buildTableColumnsFromStructure(fields, patientsFallbackColumns, columnOptions),
        [fields]
    );

    const defaultVisibleColumnKeys = useMemo(
        () => patientsFallbackColumns.map((column) => column.key),
        []
    );

    const resolvedFilterFields = useMemo(() =>
        buildFilterFieldsFromStructure(
            fields,
            patientsModuleSchema.defaultColumns.map((key) => ({
                label:
                    patientsFallbackColumns.find((column) => column.key === key)?.label || key,
                value: key,
                type: "text",
            })),
            columnOptions
        ),
        [fields]
    );
    const getColumnList = async () => {
        const res = await getDefinitions(resolvedMenuID);
        if (res.success) {
            setFields(res.data || []);
            return;
        }
        toast.error(res?.message || "Error while fetching model fields");
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
}