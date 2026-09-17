import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getDepartmentIdentifier, normalizeDepartmentData, generateCredentials } from "../utils/Departments.utils";
import { getDepartmentDetails, saveDepartment} from "../data/departments.service";
import { departmentsModuleSchema } from "../data/module.schema";

export const useDepartmentForm = ({ isOpen, onClose, onAfterSave, selectedDepartment }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingDepartment, setFetchingDepartment] = useState(false);
    const [formData, setFormData] = useState(departmentsModuleSchema.form.initialValues);
    const [errors, setErrors] = useState({});
    const mode = selectedDepartment ? "edit" : "create";
    const department_id = getDepartmentIdentifier(selectedDepartment);

    useEffect(() => {
        const fetchDepartmentDetails = async () => {
            if (!isOpen || !department_id) { return; }
            try {
                setFetchingDepartment(true);
                const res = await getDepartmentDetails(department_id);
                const departmentData = res?.data;
                setFormData(normalizeDepartmentData(departmentData));
            } catch (error) {
                toast.error("Unable to fetch department details");
                setFormData(normalizeDepartmentData(selectedDepartment));
            } finally {
                setFetchingDepartment(false);
            }
        };
        // EDIT MODE
        if (selectedDepartment && isOpen) { fetchDepartmentDetails(); return; }
        // CREATE MODE
        setFormData(departmentsModuleSchema.form.initialValues);
    }, [selectedDepartment, isOpen, department_id]);

    const handleClose = () => {
        setFormData(departmentsModuleSchema.form.initialValues);
        setErrors({});
        onClose();
    }
    const handleChange = (event) => {
        const { name, value } = event.target;
        let nextData = {
            ...formData,
            [name]: value,
        };

        if ((name === "name" || name === "dateOfBirth") && nextData.name && nextData.dateOfBirth) {
            const credentials = generateCredentials(nextData.name, nextData.dateOfBirth);
            nextData = {
                ...nextData,
                ...credentials,
            };
        }

        setFormData(nextData);
    };
    const handleSave = async () => {
        const result = departmentsModuleSchema.validationSchema.safeParse(formData);
        if (result.success == false) {
            const newErrors = {};
            result.error.issues.forEach((item) => {
                newErrors[item.path[0]] = item.message;
            });
            setErrors(newErrors);
            return;
        }
        try {
            setErrors({});
            setLoading(true);
            const res = await saveDepartment({ mode, department_id, formData });
            if (res.success) {
                toast.success(
                    res?.message ||
                    `Department ${mode === "create" ? "created" : "updated"} successfully`
                );
                setFormData(departmentsModuleSchema.form.initialValues);
                onClose();
                onAfterSave?.();
                return;
            }
            toast.error(res?.message || "Something went wrong");
        } catch (error) {
            toast.error(error.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        fetchingDepartment,
        formData,
        errors,
        handleClose,
        handleChange,
        handleSave,
    }
}
