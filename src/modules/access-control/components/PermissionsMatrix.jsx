import MenuCollapse from '../../../components/ui/MenuCollapse';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { hasModuleParentAccess } from '../utils/accessControl.utils';
import SpinnerIllustration from "@/components/ui/SpinnerIllustration";
import { accessPermissionColumns } from "../data/accessControlData";
import PermissionToggle from "./PermissionToggle";

function PermissionsEmptyState() {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-6 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-32 w-44 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
            <span className="text-4xl font-bold">ID</span>
          </div>
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-700">Select Role</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Select a role from the sidebar. These permissions apply to all users assigned to that role in the selected company.
        </p>
      </div>
    </div>
  );
}

function PermissionsMatrix({
  readOnly = false,
  modules,
  loadingMenus,
  selectedIdentity,
  loadingPermissions,
  onEnableAll,
  enableAllLabel = "Enable All",
  onPermissionChange,
}) {
  const [collapsed, setCollapsed] = useState({});
  const isModuleVisible = module => {
    const seen = new Set();
    let parentId = String(module.parent_id || 0);
    while (parentId !== '0') {
      if (seen.has(parentId) || collapsed[parentId]) return false;
      seen.add(parentId);
      const parent = modules.find(row => String(row.menu_id || row.id) === parentId);
      if (!parent) break;
      parentId = String(parent.parent_id || 0);
    }
    return true;
  };
  return (
    <section className="min-w-0 overflow-hidden border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-700">Module Permissions{selectedIdentity ? ` — ${selectedIdentity.name}` : ""}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          {loadingMenus && <span>Loading menus...</span>}
          {loadingPermissions && <span>Loading permissions...</span>}
          {selectedIdentity && (
            <>
              <span>Bulk Actions:</span>
              <button type="button" className="font-semibold text-blue-600 hover:text-blue-700" disabled={readOnly || loadingPermissions || loadingMenus} onClick={onEnableAll}>
                {enableAllLabel}
              </button>
            </>
          )}
        </div>
      </div>

      {!selectedIdentity ? (
        <PermissionsEmptyState />
      ) : loadingPermissions ? (
        <div className="flex min-h-[420px] items-center justify-center text-sm text-slate-500">
          <SpinnerIllustration />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[minmax(180px,1fr)_80px_80px_80px_80px] border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              <div>Module</div>
              {accessPermissionColumns.map((column) => (
                <div key={column.key} className="text-center">
                  {column.label}
                </div>
              ))}
            </div>

            <p className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">Turning off a parent’s View removes access to all menus inside it. Enable the parent before selecting child permissions.</p>
            {modules.map((module) => {
              const Icon = module.icon;
              const parentAllowed = hasModuleParentAccess(module, modules);

              return (
                <MenuCollapse key={module.id} open={isModuleVisible(module)}>
                <div
                  data-menu-id={module.menu_id}
                  className="grid min-h-11 grid-cols-[minmax(180px,1fr)_80px_80px_80px_80px] items-center border-b border-slate-100 px-4 text-xs text-slate-700 last:border-b-0 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-2 font-medium text-slate-800" style={{paddingLeft: (module.depth || 0) * 16}}>
                    {module.is_parent && <button type="button" aria-label={'Toggle ' + module.name} aria-expanded={!collapsed[module.menu_id]}
                      onClick={() => setCollapsed(current => ({...current, [module.menu_id]: !current[module.menu_id]}))}>
                      <ChevronDown size={14} className={"menu-expand-chevron" + (collapsed[module.menu_id] ? " is-collapsed" : "")} />
                    </button>}
                    <Icon size={15} className="shrink-0 text-slate-400" />
                    <span className="truncate" title={module.pathLabel}>{module.name}{!parentAllowed && <span className="ml-2 text-[10px] font-normal text-slate-400">Enable parent access</span>}</span>
                  </div>

                  {accessPermissionColumns.map((column) => {
                    const supported = Boolean(module.supports[column.key]);
                    const disabled = readOnly || !parentAllowed || !supported || (column.key !== "view" && !module.permissions.view);

                    return (
                      <div key={column.key} className="text-center">
                        {supported ? (
                          <PermissionToggle
                            label={module.name + " " + column.label}
                            checked={parentAllowed && Boolean(module.permissions[column.key])}
                            disabled={disabled}
                            onChange={(nextValue) => onPermissionChange(module.id, column.key, nextValue)}
                          />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </div>
                    );
                  })}

                </div>
                </MenuCollapse>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default PermissionsMatrix;
