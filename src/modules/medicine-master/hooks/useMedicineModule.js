import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
    fetchMedicine,
    deleteMedicines,
    selectMedicinePagination,
    selectMedicinePage,
    selectMedicineLoading,
    selectMedicineDeleting,
    selectMedicineSelectedRowIds,
    selectMedicineRows,
} from "../data/medicine.slice";
import * as medicineActions from "../data/medicine.slice";

export const useMedicineModule = ({ filterState }) => {
    const dispatch = useAppDispatch();

    const selectedRowIds = useAppSelector(selectMedicineSelectedRowIds);
    const pagination = useAppSelector(selectMedicinePagination);
    const loading = useAppSelector(selectMedicineLoading);
    const deleting = useAppSelector(selectMedicineDeleting);
    const page = useAppSelector(selectMedicinePage);
    const userList = useAppSelector(selectMedicineRows);

    const getUserList = async () => {
        const action = await dispatch(fetchMedicine({ filterState, page }));

        if (fetchMedicine.rejected.match(action)) {
            toast.error(action.payload || "Error while fetching medicine");
        }
    };

    const handlePageChange = (pageNumber) => {
        dispatch(medicineActions.setMedicinePage(pageNumber));
    }

    const handleToggleRow = (rowId, checked) => {
        const currentSelectedRowIds = Array.isArray(selectedRowIds) ? selectedRowIds : [];
        const nextSelectedRowIds = checked
            ? [...new Set([...currentSelectedRowIds, rowId])]
            : currentSelectedRowIds.filter((item) => item !== rowId);
        dispatch(medicineActions.setMedicineSelection(nextSelectedRowIds));
    };

    const handleToggleAllRows = (checked) => {
        if (!checked) {
            dispatch(medicineActions.clearMedicineSelection());
            return;
        }

        dispatch(medicineActions.setMedicineSelection(
            userList.map((row) => row?._id ?? row?.id ?? row?.adminID).filter(Boolean)
        ))
    };

    const handleDeleteSelected = async () => {
        if (!selectedRowIds.length) {
            toast.error("Please select at least one user to delete.");
            return;
        }
        const action = await dispatch(deleteMedicines(selectedRowIds));

        if (deleteMedicines.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getUserList();
        }
        if (deleteMedicines.rejected.match(action)) {
            toast.error(action.payload);
        }
    };

    const handleDeleteRow = async (row) => {
        const rowId = row?._id ?? row?.id ?? row?.adminID;
        if (!rowId) { toast.error("User id not found."); return; }
        const action = await dispatch(deleteMedicines([rowId]));

        if (deleteMedicines.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getUserList();
        }
        if (deleteMedicines.rejected.match(action)) {
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
        getUserList,
        handleToggleRow,
        handleToggleAllRows,
        handleDeleteSelected,
        handleDeleteRow,
    }
}
