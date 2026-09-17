import { X } from "lucide-react";
import DynamicModuleForm from "@components/ui/DynamicModuleForm";
import ActionButton from "@components/ui/ActionButton";
import FlyoutPanel from "@components/ui/FlyoutPanel";
import Spinner from "@components/ui/Spinner";
import { useMedicineForm } from "../hooks/useMedicineForm";
import { medicineModuleSchema } from "../data/module.schema";

function MedicineForm({ isOpen, onClose, selectedMedicine, onAfterSave, menu_id }) {


  const {
    loading,
    fetchingMedicine,
    formData,
    errors,
    handleClose,
    handleChange,
    handleSave,
  } = useMedicineForm({ isOpen, onClose, selectedMedicine, onAfterSave });


  return (
    <FlyoutPanel
      isOpen={isOpen}
      loading={fetchingMedicine}
      onClose={handleClose}
      title={selectedMedicine ? "Edit Medicine" : "Create Medicine"}
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
          {loading || fetchingMedicine ? <Spinner /> : null} Save
        </ActionButton>
      }
    >
      <div className="flyout-form-shell px-4 py-3">
        <div className="ws-main-container">
          
            <DynamicModuleForm
              sections={medicineModuleSchema.form.sections}
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

export default MedicineForm;
