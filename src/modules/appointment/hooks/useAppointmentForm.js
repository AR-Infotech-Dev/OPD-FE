import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { appointmentSchema } from "../data/module.schema";
import {
  getAppointmentDetails,
  saveAppointment,
} from "../data/appointment.service";

export const useAppointmentForm = ({
  isOpen,
  onClose,
  selectedAppointment,
  onAfterSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchingAppointment, setFetchingAppointment] = useState(false);
  const [formData, setFormData] = useState(
    appointmentSchema.form.initialValues
  );
  const [errors, setErrors] = useState({});

  const mode = selectedAppointment ? "edit" : "create";

  const appointmentId =
    selectedAppointment?.appointment_id ||
    selectedAppointment?.id ||
    null;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!isOpen || !appointmentId) return;

      try {
        setFetchingAppointment(true);

        const res = await getAppointmentDetails(appointmentId);

        setFormData(
          res?.data || selectedAppointment || appointmentSchema.form.initialValues
        );

        setErrors({});
      } catch (error) {
        toast.error("Unable to fetch appointment details");

        setFormData(
          selectedAppointment || appointmentSchema.form.initialValues
        );
      } finally {
        setFetchingAppointment(false);
      }
    };

    if (selectedAppointment && isOpen) {
      fetchDetails();
      return;
    }

    setFormData(appointmentSchema.form.initialValues);
    setErrors({});
  }, [selectedAppointment, isOpen, appointmentId]);

  const handleClose = () => {
    setFormData(appointmentSchema.form.initialValues);
    setErrors({});
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const validatePayload = (payload) => {
    const result = appointmentSchema.validationSchema.safeParse(payload);

    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path?.[0];

      if (fieldName) {
        nextErrors[fieldName] = issue.message;
      }
    });

    setErrors(nextErrors);
    return false;
  };

  const handleSave = async () => {
      console.log("FORM DATA:", formData);
  console.log("PATIENT ID:", formData.patient_id);
    const payload = {
      ...formData,
        patient_id: Number(formData.patient_id),
  doctor_id: Number(formData.doctor_id),
  department_id: Number(formData.department_id),

  appointment_date: formData.appointment_date,
  appointment_time: formData.appointment_time,

  appointment_type: formData.appointment_type,

  // consultation_fee: formData.consultation_fee || 0,

  payment_mode: formData.payment_mode,

  payment_status: formData.payment_status || "pending",
status: formData.status || "booked",
    };
   console.log("APPOINTMENT PAYLOAD:", payload);
    if (!validatePayload(payload)) return;

    try {
      setLoading(true);

      const res = await saveAppointment({
        mode,
        appointmentId,
        payload,
      });

      if (res.success) {
        toast.success(
          res.message ||
            `Appointment ${
              mode === "create" ? "created" : "updated"
            } successfully`
        );

        setFormData(appointmentSchema.form.initialValues);
        setErrors({});

        onClose();
        onAfterSave?.();

        return;
      }

      toast.error(
        res?.msg ||
          res?.message ||
          "Something went wrong"
      );
    } catch (error) {
      toast.error(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return {
    appointmentId,
    loading,
    fetchingAppointment,
    formData,
    errors,
    handleClose,
    handleChange,
    handleSave,
  };
};