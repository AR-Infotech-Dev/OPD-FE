import { hasMenuAccess, sanitizeMenuPermissions, pickActionPermissions } from '../../../utils/menuAccess';
import { accessModules } from '../data/accessControlData';

export const buildDefaultModules = (rows = accessModules) => rows.map(module => ({
  ...module, permissions: {view: false, add: false, edit: false, delete: false},
}));

export const getModulePermissionKey = (module = {}) => String(module.menu_id || module.id);

export const normalizePermissionMap = (payload = {}) => {
  let source = payload?.permissions || payload?.data?.permissions || payload?.data || payload;
  if (source?.permissions !== undefined) source = source.permissions;
  if (typeof source === 'string') { try { source = JSON.parse(source); } catch { return {}; } }
  if (Array.isArray(source)) source = Object.fromEntries(source.map(item => [item?.menu_id || item?.menuID || item?.menuId || item?.id, item]).filter(([id]) => id));
  return pickActionPermissions(source);
};

export const applyPermissionMapToModules = (moduleRows = [], permissionMap = {}) => {
  const allowed = sanitizeMenuPermissions(moduleRows, permissionMap);
  return moduleRows.map(module => ({...module, permissions: allowed[getModulePermissionKey(module)] || {
    view: false, add: false, edit: false, delete: false,
  }}));
};

export const preparePermissionsJson = (moduleRows = []) => sanitizeMenuPermissions(moduleRows,
  Object.fromEntries(moduleRows.map(module => [getModulePermissionKey(module), module.permissions]))
);

export const hasModuleParentAccess = (module, modules) => {
  const parentId = module.parent_id || 0;
  if (!parentId) return true;
  const permissions = Object.fromEntries(modules.map(row => [getModulePermissionKey(row), row.permissions]));
  return hasMenuAccess(parentId, modules, permissions);
};

export const updateModulePermission = (modules, moduleId, key, value) => {
  const target = modules.find(module => module.id === moduleId);
  if (!target || !target.supports[key] || !hasModuleParentAccess(target, modules) || (key !== 'view' && !target.permissions.view)) return modules;
  const updated = modules.map(module => module.id === moduleId
    ? {...module, permissions: {...module.permissions, [key]: value}} : module);
  return applyPermissionMapToModules(updated, preparePermissionsJson(updated));
};
