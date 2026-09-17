import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
    fetchDepartments,
    deleteDepartments,
    selectDepartmentsPagination,
    selectDepartmentsPage,
    selectDepartmentsLoading,
    selectDepartmentsDeleting,
    selectDepartmentsSelectedRowIds,
    selectDepartmentsRows,
} from "../data/departments.slice";
import * as departmentsActions from "../data/departments.slice";

export const useDepartmentsModule = ({ filterState }) => {
    const dispatch = useAppDispatch();

    const selectedRowIds = useAppSelector(selectDepartmentsSelectedRowIds);
    const pagination = useAppSelector(selectDepartmentsPagination);
    const loading = useAppSelector(selectDepartmentsLoading);
    const deleting = useAppSelector(selectDepartmentsDeleting);
    const page = useAppSelector(selectDepartmentsPage);
    const departmentList = useAppSelector(selectDepartmentsRows);

    const getDepartmentList = async () => {
        const action = await dispatch(fetchDepartments({ filterState, page }));

        if (fetchDepartments.rejected.match(action)) {
            toast.error(action.payload || "Error while fetching departments");
        }
    };

    const handlePageChange = (pageNumber) => {
        dispatch(departmentsActions.setDepartmentsPage(pageNumber));
    }

    const handleToggleRow = (rowId, checked) => {
        const currentSelectedRowIds = Array.isArray(selectedRowIds) ? selectedRowIds : [];
        const nextSelectedRowIds = checked
            ? [...new Set([...currentSelectedRowIds, rowId])]
            : currentSelectedRowIds.filter((item) => item !== rowId);
        dispatch(departmentsActions.setDepartmentsSelection(nextSelectedRowIds));
    };

    const handleToggleAllRows = (checked) => {
        if (!checked) {
            dispatch(departmentsActions.clearDepartmentsSelection());
            return;
        }

        dispatch(departmentsActions.setDepartmentsSelection(
            departmentList.map((row) => row?._id ?? row?.id ?? row?.department_id).filter(Boolean)
        ))
    };

    const handleDeleteSelected = async () => {
        if (!selectedRowIds.length) {
            toast.error("Please select at least one department to delete.");
            return;
        }
        const action = await dispatch(deleteDepartments(selectedRowIds));

        if (deleteDepartments.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getDepartmentList();
        }
        if (deleteDepartments.rejected.match(action)) {
            toast.error(action.payload);
        }
    };

    const handleDeleteRow = async (row) => {
        const rowId = row?._id ?? row?.id ?? row?.department_id;
        if (!rowId) { toast.error("Department id not found."); return; }
        const action = await dispatch(deleteDepartments([rowId]));

        if (deleteDepartments.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getDepartmentList();
        }
        if (deleteDepartments.rejected.match(action)) {
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
        getDepartmentList,
        handleToggleRow,
        handleToggleAllRows,
        handleDeleteSelected,
        handleDeleteRow,
    }
}
