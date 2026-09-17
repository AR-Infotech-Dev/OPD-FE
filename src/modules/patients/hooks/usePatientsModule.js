import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
    fetchPatients,
    deletePatients,
    selectPatientsPagination,
    selectPatientsPage,
    selectPatientsLoading,
    selectPatientsDeleting,
    selectPatientsSelectedRowIds,
    selectPatientsRows,
} from "../data/patients.slice";
import * as patientsActions from "../data/patients.slice";

export const usePatientsModule = ({ filterState }) => {
    const dispatch = useAppDispatch();

    const selectedRowIds = useAppSelector(selectPatientsSelectedRowIds);
    const pagination = useAppSelector(selectPatientsPagination);
    const loading = useAppSelector(selectPatientsLoading);
    const deleting = useAppSelector(selectPatientsDeleting);
    const page = useAppSelector(selectPatientsPage);
    const patientList = useAppSelector(selectPatientsRows);

    const getPatientList = async () => {
        const action = await dispatch(fetchPatients({ filterState, page }));

        if (fetchPatients.rejected.match(action)) {
            toast.error(action.payload || "Error while fetching patients");
        }
    };

    const handlePageChange = (pageNumber) => {
        dispatch(patientsActions.setPatientsPage(pageNumber));
    }

    const handleToggleRow = (rowId, checked) => {
        const currentSelectedRowIds = Array.isArray(selectedRowIds) ? selectedRowIds : [];
        const nextSelectedRowIds = checked
            ? [...new Set([...currentSelectedRowIds, rowId])]
            : currentSelectedRowIds.filter((item) => item !== rowId);
        dispatch(patientsActions.setPatientsSelection(nextSelectedRowIds));
    };

    const handleToggleAllRows = (checked) => {
        if (!checked) {
            dispatch(patientsActions.clearPatientsSelection());
            return;
        }

        dispatch(patientsActions.setPatientsSelection(
            patientList.map((row) => row?._id ?? row?.id ?? row?.adminID).filter(Boolean)
        ))
    };

    const handleDeleteSelected = async () => {
        if (!selectedRowIds.length) {
            toast.error("Please select at least one patient to delete.");
            return;
        }
        const action = await dispatch(deletePatients(selectedRowIds));

        if (deletePatients.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getPatientList();
        }
        if (deletePatients.rejected.match(action)) {
            toast.error(action.payload);
        }
    };

    const handleDeleteRow = async (row) => {
        const rowId = row?._id ?? row?.id ?? row?.adminID;
        if (!rowId) { toast.error("Patient id not found."); return; }
        const action = await dispatch(deletePatients([rowId]));

        if (deletePatients.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getPatientList();
        }
        if (deletePatients.rejected.match(action)) {
            toast.error(action.payload);
        }
    };

    return {
        pagination,
        page,
        loading,
        deleting,
        selectedRowIds,
        handlePageChange,
        getPatientList,
        handleToggleRow,
        handleToggleAllRows,
        handleDeleteSelected,
        handleDeleteRow,
    }
}
