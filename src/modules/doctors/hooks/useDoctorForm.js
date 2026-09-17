import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getDoctorIdentifier, normalizeDoctorData, generateCredentials } from "../utils/doctors.utils";
import { getDoctorDetails, saveDoctor } from "../data/doctors.service";
import { doctorsModuleSchema } from "../data/module.schema";

export const useDoctorForm = ({ isOpen, onClose, onAfterSave, selectedDoctor }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingDoctor, setFetchingDoctor] = useState(false);
    const [formData, setFormData] = useState(doctorsModuleSchema.form.initialValues);
    const [errors, setErrors] = useState({});
    const mode = selectedDoctor ? "edit" : "create";
    const doctor_id = getDoctorIdentifier(selectedDoctor);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (!isOpen || !doctor_id) { return; }
            try {
                setFetchingDoctor(true);
                const res = await getDoctorDetails(doctor_id)
                const doctorData = res?.data;
                setFormData(normalizeDoctorData(doctorData));
            } catch (error) {
                toast.error("Unable to fetch doctor details");
                setFormData(normalizeDoctorData(selectedDoctor));
            } finally {
                setFetchingDoctor(false);
            }
        };
        // EDIT MODE
        if (selectedDoctor && isOpen) { fetchDoctorDetails(); return; }
        // CREATE MODE

        
        setFormData(doctorsModuleSchema.form.initialValues);
    }, [selectedDoctor, isOpen, doctor_id]);

    const handleClose = () => {
        setFormData(doctorsModuleSchema.form.initialValues);
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
        const result = doctorsModuleSchema.validationSchema.safeParse(formData);
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
            const res = await saveDoctor({ mode, doctor_id, formData });
            if (res.success) {
                toast.success(
                    res?.message ||
                    `Doctor ${mode === "create" ? "created" : "updated"} successfully`
                );
                setFormData(doctorsModuleSchema.form.initialValues);
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
        fetchingDoctor,
        formData,
        errors,
        handleClose,
        handleChange,
        handleSave,
    }
}
