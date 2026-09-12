import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
    fetchUserRole,
    deleteUser_Role,
    selectUserRolePagination,
    selectUserRolePage,
    selectUserRoleLoading,
    selectUserRoleDeleting,
    selectUserRoleSelectedRowIds,
    selectUserRoleRows,
} from "../data/userrole.slice";
import * as userroleActions from "../data/userrole.slice";

export const useUserRoleModule = ({ filterState }) => {
    const dispatch = useAppDispatch();

    const selectedRowIds = useAppSelector(selectUserRoleSelectedRowIds);
    const pagination = useAppSelector(selectUserRolePagination);
    const loading = useAppSelector(selectUserRoleLoading);
    const deleting = useAppSelector(selectUserRoleDeleting);
    const page = useAppSelector(selectUserRolePage);
    const userroleList = useAppSelector(selectUserRoleRows);

    const getUserRoleList = async () => {
        const action = await dispatch(fetchUserRole({ filterState, page }));

        if (fetchUserRole.rejected.match(action)) {
            toast.error(action.payload || "Error while fetching user roles");
        }
    };

    const handlePageChange = (pageNumber) => {
        dispatch(userroleActions.setUserRolePage(pageNumber));
    }

    const handleToggleRow = (rowId, checked) => {
        const currentSelectedRowIds = Array.isArray(selectedRowIds) ? selectedRowIds : [];
        const nextSelectedRowIds = checked
            ? [...new Set([...currentSelectedRowIds, rowId])]
            : currentSelectedRowIds.filter((item) => item !== rowId);
        dispatch(userroleActions.setUserRoleSelection(nextSelectedRowIds));
    };

    const handleToggleAllRows = (checked) => {
        if (!checked) {
            dispatch(userroleActions.clearUserRoleSelection());
            return;
        }

        dispatch(userroleActions.setUserRoleSelection(
            userroleList.map((row) => row?.roleID?? row?._id ?? row?.id).filter(Boolean)
        ))
    };

    const handleDeleteSelected = async () => {
        if (!selectedRowIds.length) {
            toast.error("Please select at least one user role to delete.");
            return;
        }
        const action = await dispatch(deleteUser_Role(selectedRowIds));

        if (deleteUser_Role.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getUserRoleList();
        }
        if (deleteUser_Role.rejected.match(action)) {
            toast.error(action.payload);
        }
    };

    const handleDeleteRow = async (row) => {
        const rowId = row?.roleID ?? row?._id ?? row?.id;
        if (!rowId) { toast.error("User role id not found."); return; }
        if (!window.confirm("Delete this user role?")) return;

        const action = await dispatch(deleteUser_Role([rowId]));

        if (deleteUser_Role.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getUserRoleList();
        }
        if (deleteUser_Role.rejected.match(action)) {
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
        getUserRoleList,
        handleToggleRow,
        handleToggleAllRows,
        handleDeleteSelected,
        handleDeleteRow,
    }
}
