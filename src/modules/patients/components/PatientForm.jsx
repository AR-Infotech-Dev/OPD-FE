import { X } from "lucide-react";
import DynamicModuleForm from "@components/ui/DynamicModuleForm";
import ActionButton from "@components/ui/ActionButton";
import FlyoutPanel from "@components/ui/FlyoutPanel";
import Spinner from "@components/ui/Spinner";
import { usePatientForm } from "../hooks/usePatientForm";
import { patientsModuleSchema } from "../data/module.schema";

function PatientForm({ isOpen, onClose, selectedPatient, onAfterSave, menu_id }) {


  const {
    loading,
    fetchingPatient,
    formData,
    errors,
    handleClose,
    handleChange,
    handleSave,
  } = usePatientForm({ isOpen, onClose, selectedPatient, onAfterSave });


  return (
    <FlyoutPanel
      isOpen={isOpen}
      loading={fetchingPatient}
      onClose={handleClose}
      title={selectedPatient ? "Edit Patient" : "Create Patient"}
      panelClassName="!w-[640px] max-w-full"
      closeButton={
        <button className="flyout-close" onClick={handleClose} aria-label="Close panel">
          <X size={18} />
        </button>
      }
      footer={
        <ActionButton
          className={loading ? "bg-purple-200 cursor-not-allowed" : ""}
          disabled={loading}
          variant="flyoutPrimary"
          onClick={handleSave}
        >
          {loading || fetchingPatient ? <Spinner /> : null} Save
        </ActionButton>
      }
    >
      <div className="flyout-form-shell px-4 py-3">
        <div className="ws-main-container">

          <DynamicModuleForm
            sections={patientsModuleSchema.form.sections}
            values={formData}
            onChange={handleChange}
            errors={errors}
            menuId={menu_id}
          />

        </div>
      </div>
    </FlyoutPanel>
  );
}

export default PatientForm;
