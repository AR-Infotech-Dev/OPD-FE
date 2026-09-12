import { X } from "lucide-react";
import FlyoutPanel from "@components/ui/FlyoutPanel";
import ActionButton from "@components/ui/ActionButton";
import Spinner from "@components/ui/Spinner";
import DynamicModuleForm from "@components/ui/DynamicModuleForm";
import { userroleModuleSchema } from "../data/module.schema";
import { useUserRoleForm } from "../hooks/useUserRoleForm";

function UserRoleForm({ isOpen, onClose, selectedUserRole, onAfterSave, menu_id }) {
  const {
    loading,
    fetchingUserRole,
    formData,
    errors,
    handleClose,
    handleChange,
    handleSave,
  } = useUserRoleForm({ isOpen, onClose, selectedUserRole, onAfterSave });

  if (!isOpen) {
    return null;
  }

  return (
    <FlyoutPanel
      isOpen={isOpen}
      onClose={handleClose}
      title={selectedUserRole ? "Edit UserRole" : "Create UserRole"}
      closeButton={
        <button className="flyout-close" onClick={handleClose} aria-label="Close panel">
          <X size={18} />
        </button>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <ActionButton disabled={loading || fetchingUserRole} variant="flyoutSecondary" onClick={handleClose}>
            Cancel
          </ActionButton>
          <ActionButton
            className={loading ? "bg-purple-200 cursor-not-allowed" : ""}
            disabled={loading || fetchingUserRole}
            variant="flyoutSecondary"
            onClick={handleSave}
          >
            {loading || fetchingUserRole ? <Spinner /> : null} Save
          </ActionButton>
        </div>
      }
      panelClassName="!w-[540px]"
    >
      <div className="flyout-form-shell">
        <div className="ws-main-container">
          {fetchingUserRole ? (
            <div className="p-5 text-center">
              <Spinner />
            </div>
          ) : (
            <div className="rounded-xl bg-white px-4 py-3">
              <DynamicModuleForm
                sections={userroleModuleSchema.form.sections}
                values={formData}
                onChange={handleChange}
                errors={errors}
                menuId={menu_id}
              />
            </div>
          )}
        </div>
      </div>
    </FlyoutPanel>
  );
}

export default UserRoleForm;
