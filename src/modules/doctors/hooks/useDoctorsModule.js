import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
    fetchDoctors,
    deleteDoctors,
    selectDoctorsPagination,
    selectDoctorsPage,
    selectDoctorsLoading,
    selectDoctorsDeleting,
    selectDoctorsSelectedRowIds,
    selectDoctorsRows,
} from "../data/doctors.slice";
import * as doctorsActions from "../data/doctors.slice";

export const useDoctorsModule = ({ filterState }) => {
    const dispatch = useAppDispatch();

    const selectedRowIds = useAppSelector(selectDoctorsSelectedRowIds);
    const pagination = useAppSelector(selectDoctorsPagination);
    const loading = useAppSelector(selectDoctorsLoading);
    const deleting = useAppSelector(selectDoctorsDeleting);
    const page = useAppSelector(selectDoctorsPage);
    const doctorList = useAppSelector(selectDoctorsRows);

    const getDoctorList = async () => {
        const action = await dispatch(fetchDoctors({ filterState, page }));

        if (fetchDoctors.rejected.match(action)) {
            toast.error(action.payload || "Error while fetching doctors");
        }
    };

    const handlePageChange = (pageNumber) => {
        dispatch(doctorsActions.setDoctorsPage(pageNumber));
    }

    const handleToggleRow = (rowId, checked) => {
        const currentSelectedRowIds = Array.isArray(selectedRowIds) ? selectedRowIds : [];
        const nextSelectedRowIds = checked
            ? [...new Set([...currentSelectedRowIds, rowId])]
            : currentSelectedRowIds.filter((item) => item !== rowId);
        dispatch(doctorsActions.setDoctorsSelection(nextSelectedRowIds));
    };

    const handleToggleAllRows = (checked) => {
        if (!checked) {
            dispatch(doctorsActions.clearDoctorsSelection());
            return;
        }

        dispatch(doctorsActions.setDoctorsSelection(
            doctorList.map((row) => row?._id ?? row?.id ?? row?.adminID).filter(Boolean)
        ))
    };

    const handleDeleteSelected = async () => {
        if (!selectedRowIds.length) {
            toast.error("Please select at least one doctor to delete.");
            return;
        }
        const action = await dispatch(deleteDoctors(selectedRowIds));

        if (deleteDoctors.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getDoctorList();
        }
        if (deleteDoctors.rejected.match(action)) {
            toast.error(action.payload);
        }
    };

    const handleDeleteRow = async (row) => {
        const rowId = row?._id ?? row?.id ?? row?.adminID;
        if (!rowId) { toast.error("Doctor id not found."); return; }
        const action = await dispatch(deleteDoctors([rowId]));

        if (deleteDoctors.fulfilled.match(action)) {
            toast.success(action.payload.message);
            await getDoctorList();
        }
        if (deleteDoctors.rejected.match(action)) {
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
        getDoctorList,
        handleToggleRow,
        handleToggleAllRows,
        handleDeleteSelected,
        handleDeleteRow,
    }
}
