import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getPatientIdentifier, normalizePatientData, generateCredentials } from "../utils/patients.utils";
import { getPatientDetails, savePatient } from "../data/patients.service";
import { patientsModuleSchema } from "../data/module.schema";

export const usePatientForm = ({ isOpen, onClose, onAfterSave, selectedPatient }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingPatient, setFetchingPatient] = useState(false);
    const [formData, setFormData] = useState(patientsModuleSchema.form.initialValues);
    const [errors, setErrors] = useState({});
    const mode = selectedPatient ? "edit" : "create";
    const patient_id = getPatientIdentifier(selectedPatient);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            if (!isOpen || !patient_id) { return; }
            try {
                setFetchingPatient(true);
                const res = await getPatientDetails(patient_id)
                const patientData = res?.data;
                setFormData(normalizePatientData(patientData));
            } catch (error) {
                toast.error("Unable to fetch patient details");
                setFormData(normalizePatientData(selectedPatient));
            } finally {
                setFetchingPatient(false);
            }
        };
        // EDIT MODE
        if (selectedPatient && isOpen) { fetchPatientDetails(); return; }
        // CREATE MODE
        setFormData(patientsModuleSchema.form.initialValues);
    }, [selectedPatient, isOpen, patient_id]);

    const handleClose = () => {
        setFormData(patientsModuleSchema.form.initialValues);
        setErrors({});
        onClose();
    }
    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     let nextData = {
    //         ...formData,
    //         [name]: value,
    //     };

    //     if ((name === "name" || name === "dateOfBirth") && nextData.name && nextData.dateOfBirth) {
    //         const credentials = generateCredentials(nextData.name, nextData.dateOfBirth);
    //         nextData = {
    //             ...nextData,
    //             ...credentials,
    //         };
    //     }

    //     setFormData(nextData);
    // };
    const handleChange = (event) => {
        const { name, value } = event.target;
        let nextData = {
            ...formData,
            [name]: value,
        };
        // Generate Full Name
        if (name === "first_name" || name === "middle_name" || name === "last_name") {
            nextData.full_name = [nextData.first_name, nextData.middle_name, nextData.last_name,]
                .filter(Boolean)
                .map((item) => item.trim())
                .filter(Boolean)
                .join(" ");
        }

        // Calculate Age from Date of Birth
        if (name === "date_of_birth") {
            if (value) {
                const today = new Date();
                const birthDate = new Date(value);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDifference =
                    today.getMonth() - birthDate.getMonth();
                if ( monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate()) ) {
                    age--;
                }
                nextData.age = age;
            } else { 
                nextData.age = ""; 
            }
        }

        setFormData(nextData);
    };

    const handleSave = async () => {
        const result = patientsModuleSchema.validationSchema.safeParse(formData);
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
            const res = await savePatient({ mode, patient_id, formData });
            if (res.success) {
                toast.success(
                    res?.message ||
                    `Patient ${mode === "create" ? "created" : "updated"} successfully`
                );
                setFormData(patientsModuleSchema.form.initialValues);
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
        fetchingPatient,
        formData,
        errors,
        handleClose,
        handleChange,
        handleSave,
    }
}
