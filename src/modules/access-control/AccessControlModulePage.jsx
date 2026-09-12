import { useAuth } from "@auth/components/AuthProvider";
import ModulePageLayout from "../shared/ModulePageLayout";
import IdentitySelector from "./components/IdentitySelector";
import PermissionsMatrix from "./components/PermissionsMatrix";
import { useAccessControlModule } from "./hooks/useAccessControlModule";

function AccessControlModulePage() {
  const { authSession } = useAuth();
  const currentUser = authSession?.user || {};

  const {
    canEdit,
    saving,
    currentCompanyId,
    selectedIdentity,
    setSelectedIdentity,
    loadingMenus,
    loadingPermissions,
    modules,
    hasAllModulePermissions,
    loadSelectedPermissions,
    setModulePermission,
    toggleAllModules,
    resetDefault,
    saveChanges,
  } = useAccessControlModule({ currentUser });

  return (
    <>
      <ModulePageLayout
        title="Access Control Management"
        description="Manage role permissions. Changes apply to every user with that role in the selected company."
        controls={
          <div className="absolute right-6 top-7 flex gap-2">
            <button
              type="button"
              className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => loadSelectedPermissions()}
            >
              Refresh Menus
            </button>
            <button
              type="button"
              className="h-8 rounded-md border border-gray-400 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              disabled={!canEdit || saving || loadingMenus || loadingPermissions}
              onClick={resetDefault}
            >
              Reset to Default
            </button>
            <button
              type="button"
              className="h-8 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              disabled={!canEdit || saving || !selectedIdentity || loadingMenus || loadingPermissions || !modules.length}
              onClick={saveChanges}
            >
              Save Changes
            </button>
          </div>
        }
      >
        <div className="mt-1 grid min-h-full grid-cols-1 gap-1.5 xl:grid-cols-[290px_minmax(0,1fr)]">
          <fieldset disabled={saving} className="min-w-0">
          <IdentitySelector
            companyId={currentCompanyId}
            selectedIdentity={selectedIdentity}
            onSelect={setSelectedIdentity}
          />
          </fieldset>
          <PermissionsMatrix
            readOnly={!canEdit || saving}
            modules={modules}
            loadingMenus={loadingMenus}
            selectedIdentity={selectedIdentity}
            loadingPermissions={loadingPermissions}
            onEnableAll={toggleAllModules}
            enableAllLabel={hasAllModulePermissions ? "Disable All" : "Enable All"}
            onPermissionChange={setModulePermission}
          />
        </div>
      </ModulePageLayout>
    </>
  );
}

export default AccessControlModulePage;
