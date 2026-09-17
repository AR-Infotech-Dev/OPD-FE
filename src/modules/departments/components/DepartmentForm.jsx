import { X } from "lucide-react";
import DynamicModuleForm from "@components/ui/DynamicModuleForm";
import ActionButton from "@components/ui/ActionButton";
import FlyoutPanel from "@components/ui/FlyoutPanel";
import Spinner from "@components/ui/Spinner";
import { useDepartmentForm } from "../hooks/useDepartmentsForm";
import { departmentsModuleSchema } from "../data/module.schema";

function DepartmentForm({ isOpen, onClose, selectedDepartment, onAfterSave, menu_id }) {


  const { loading, fetchingDepartment, formData, errors, handleClose, handleChange, handleSave, } = useDepartmentForm({ isOpen, onClose, selectedDepartment, onAfterSave });


  return (
    <FlyoutPanel
      isOpen={isOpen}
      loading={fetchingDepartment}
      onClose={handleClose}
      title={selectedDepartment ? "Edit Department" : "Create Department"}
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
          {loading || fetchingDepartment ? <Spinner /> : null} Save
        </ActionButton>
      }
    >
      <div className="flyout-form-shell px-4 py-3">
        <div className="ws-main-container">
          
            <DynamicModuleForm
              sections={departmentsModuleSchema.form.sections}
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

export default DepartmentForm;
