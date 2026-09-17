function AppointmentSummary({ formData }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
     <h3 className="text-lg font-semibold text-slate-900">
        Appointment Summary
      </h3>

     <div className="mt-3 space-y-2 text-xs">
        <div>
         <span className="text-sm text-slate-500">Patient:</span>{" "}
          {formData.patient_id || "-"}
        </div>

        <div>
          <span className="text-sm text-slate-500">Department:</span>{" "}
          {formData.department_id || "-"}
        </div>

        <div>
          <span className="text-sm text-slate-500">Doctor:</span>{" "}
          {formData.doctor_id || "-"}
        </div>

        <div>
          <span className="text-sm text-slate-500">Date:</span>{" "}
          {formData.appointment_date || "-"}
        </div>

        <div>
          <span className="text-sm text-slate-500">Slot:</span>{" "}
          {formData.appointment_time || "-"}
        </div>

        <div>
          <span className="text-sm text-slate-500">Appointment Type:</span>{" "}
          {formData.appointment_type || "-"}
        </div>

        <div>
          <span className="text-sm text-slate-500">Payment:</span>{" "}
          {formData.payment_mode || "-"}
        </div>

        <div>
          <span className="text-sm text-slate-500">Fee:</span>{" "}
          {formData.consultation_fee || "-"}
        </div>
      </div>
    </div>
  );
}

export default AppointmentSummary;