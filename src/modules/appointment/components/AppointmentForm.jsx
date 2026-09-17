import { X } from "lucide-react";

import FlyoutPanel from "../../../components/ui/FlyoutPanel";
import ActionButton from "../../../components/ui/ActionButton";
import Spinner from "../../../components/ui/Spinner";
import DynamicModuleForm from "../../../components/ui/DynamicModuleForm";

import { appointmentSchema } from "../data/module.schema";
import { useAppointmentForm } from "../hooks/useAppointmentForm";
import AppointmentPreview from "./AppointmentSummary";

function AppointmentForm({
  isOpen,
  onClose,
  selectedAppointment,
  onAfterSave,
  menu_id,
}) {
  const {
    loading,
    fetchingAppointment,
    formData,
    errors,
    handleClose,
    handleChange,
    handleSave,
  } = useAppointmentForm({
    isOpen,
    onClose,
    selectedAppointment,
    onAfterSave,
  });

  return (
    <FlyoutPanel
      isOpen={isOpen}
      loading={fetchingAppointment}
      onClose={handleClose}
      title={
        selectedAppointment
          ? "Edit Appointment"
          : "Create Appointment"
      }
     panelClassName="!w-[800px] !max-w-[90vw]"
      closeButton={
        <button
          className="flyout-close"
          onClick={handleClose}
          aria-label="Close panel"
        >
          <X size={18} />
        </button>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <ActionButton
            disabled={loading || fetchingAppointment}
            variant="flyoutSecondary"
            onClick={handleClose}
          >
            Cancel
          </ActionButton>

          <ActionButton
            className={
              loading
                ? "bg-purple-200 cursor-not-allowed"
                : ""
            }
            disabled={loading || fetchingAppointment}
            variant="flyoutSecondary"
            onClick={handleSave}
          >
            {loading || fetchingAppointment ? <Spinner /> : null}
            Save
          </ActionButton>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">

  {/* LEFT - Form */}
  <div className="flyout-form-shell">
    <div className="ws-main-container">
      <div className="rounded-sm bg-white px-4 py-3">
        <DynamicModuleForm
          sections={appointmentSchema.form.sections}
          values={formData}
          onChange={handleChange}
          errors={errors}
          menuId={menu_id}
        />
      </div>
    </div>
  </div>

  {/* RIGHT - Preview */}
  <div className="flyout-form-shell ">
    <div className="ws-main-container">
      <div className="rounded-sm bg-white px-4 py-3">

        <AppointmentPreview formData={formData} />

      </div>
    </div>
  </div>

</div>
    </FlyoutPanel>
  );
}

export default AppointmentForm;