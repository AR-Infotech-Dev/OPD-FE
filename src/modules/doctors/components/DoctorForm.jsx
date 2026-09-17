import { X } from "lucide-react";
import DynamicModuleForm from "@components/ui/DynamicModuleForm";
import ActionButton from "@components/ui/ActionButton";
import FlyoutPanel from "@components/ui/FlyoutPanel";
import Spinner from "@components/ui/Spinner";
import { useDoctorForm } from "../hooks/useDoctorForm";
import { doctorsModuleSchema } from "../data/module.schema";

function DoctorForm({ isOpen, onClose, selectedDoctor, onAfterSave, menu_id }) {


  const {
    loading,
    fetchingDoctor,
    formData,
    errors,
    handleClose,
    handleChange,
    handleSave,
  } = useDoctorForm({ isOpen, onClose, selectedDoctor, onAfterSave });


  return (
    <FlyoutPanel
      isOpen={isOpen}
      loading={fetchingDoctor}
      onClose={handleClose}
      title={selectedDoctor ? "Edit Doctor" : "Create Doctor"}
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
          {loading || fetchingDoctor ? <Spinner /> : null} Save
        </ActionButton>
      }
    >
      <div className="flyout-form-shell px-4 py-3">
        <div className="ws-main-container">
          
            <DynamicModuleForm
              sections={doctorsModuleSchema.form.sections}
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

export default DoctorForm;
