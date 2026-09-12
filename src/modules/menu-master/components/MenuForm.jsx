import { X } from "lucide-react";
import FlyoutPanel from "../../../components/ui/FlyoutPanel";
import ActionButton from "../../../components/ui/ActionButton";
import Spinner from "../../../components/ui/Spinner";
import DynamicModuleForm from "../../../components/ui/DynamicModuleForm";
import { menuMasterSchema } from "../data/module.schema";
import { useMenuForm } from "../hooks/useMenuForm";

function MenuForm({ isOpen, onClose, selectedMenu, onAfterSave, menu_id: permissionMenuId }) {
  const {
    loading,
    fetchingMenu,
    formData,
    errors,
    handleChange,
    handleSave,
    handleClose,
  } = useMenuForm({ isOpen, onClose, selectedMenu, onAfterSave });



  const sections = menuMasterSchema.form.sections.map(section => ({
    ...section,
    fields: section.fields.filter(field => !formData.is_parent || !['module_name', 'menu_link', 'table_name', 'label', 'plural_label'].includes(field.name)),
  })).filter(section => section.fields.length);

  return (
    <FlyoutPanel
      isOpen={isOpen}
      loading={fetchingMenu}
      onClose={handleClose}
      title={selectedMenu ? "Edit Menu" : "Create Menu"}
      panelClassName="!w-[540px] max-w-full"
      closeButton={
        <button className="flyout-close" onClick={handleClose}>
          <X size={18} />
        </button>
      }
      footer={
        <ActionButton
          disabled={loading || fetchingMenu}
          variant="flyoutPrimary"
          onClick={handleSave}
        >
          {loading || fetchingMenu ? <Spinner /> : null}
          Save
        </ActionButton>
      }
    >
      <div className="flyout-form-shell">
        <div className="ws-main-container">
          
            <div className="rounded-xl bg-white px-4 py-3">
              {/* <label className="mb-4 flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                <input type="checkbox" checked={Boolean(formData.is_parent)} disabled={loading || fetchingMenu}
                  onChange={event => handleChange({target: {name: 'is_parent', value: event.target.checked}})} />
                <span><span className="block text-sm font-semibold">Parent menu</span>
                  <span className="text-xs text-slate-500">Groups child menus in an accordion. No menu link or database table is needed.</span>
                </span>
              </label> */}
              <DynamicModuleForm
                sections={sections}
                values={formData}
                onChange={handleChange}
                errors={errors}
                menuId={permissionMenuId}
              />
            </div>
          
        </div>
      </div>
    </FlyoutPanel>
  );
}

export default MenuForm;
