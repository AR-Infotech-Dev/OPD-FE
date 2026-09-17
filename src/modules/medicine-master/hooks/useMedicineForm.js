import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getMedicineIdentifier, normalizeMedicineData, generateCredentials } from "../utils/medicine.utils";
import { getMedicineDetails, saveMedicine } from "../data/medicine.service";
import { medicineModuleSchema } from "../data/module.schema";

export const useMedicineForm = ({ isOpen, onClose, onAfterSave, selectedMedicine }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingMedicine, setFetchingMedicine] = useState(false);
    const [formData, setFormData] = useState(medicineModuleSchema.form.initialValues);
    const [errors, setErrors] = useState({});
    const mode = selectedMedicine ? "edit" : "create";
    const userID = getMedicineIdentifier(selectedMedicine);

    useEffect(() => {
        const fetchMedicineDetails = async () => {
            if (!isOpen || !userID) { return; }
            try {
                setFetchingMedicine(true);
                const res = await getMedicineDetails(userID)
                const userData = res?.data;
                setFormData(normalizeMedicineData(userData));
            } catch (error) {
                toast.error("Unable to fetch user details");
                setFormData(normalizeMedicineData(selectedMedicine));
            } finally {
                setFetchingMedicine(false);
            }
        };
        // EDIT MODE
        if (selectedMedicine && isOpen) { fetchMedicineDetails(); return; }
        // CREATE MODE
        setFormData(medicineModuleSchema.form.initialValues);
    }, [selectedMedicine, isOpen, userID]);

    const handleClose = () => {
        setFormData(medicineModuleSchema.form.initialValues);
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
        const result = medicineModuleSchema.validationSchema.safeParse(formData);
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
            const res = await saveMedicine({ mode, userID, formData });
            if (res.success) {
                toast.success(
                    res?.message ||
                    `Medicine ${mode === "create" ? "created" : "updated"} successfully`
                );
                setFormData(medicineModuleSchema.form.initialValues);
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
        fetchingMedicine,
        formData,
        errors,
        handleClose,
        handleChange,
        handleSave,
    }
}
