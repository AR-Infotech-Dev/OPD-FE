import { hasMenuAccess } from '../../../utils/menuAccess';
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getStoredMenuList, getStoredPermissions } from "@auth/utils/authStorage";
import { accessPermissionColumns } from "../data/accessControlData";
import { flattenMenuModules } from "../data/helper";
import {
  getAccessMenus,
  getIdentityPermissions,
  saveIdentityPermissions,
} from "../data/accessControl.service";
import {
  applyPermissionMapToModules,
  buildDefaultModules,
  normalizePermissionMap,
  preparePermissionsJson,
  updateModulePermission,
} from "../utils/accessControl.utils";

const DEFAULT_MODULES = buildDefaultModules();

export function useAccessControlModule({ currentUser = {} }) {
  const isSuperAdmin = currentUser?.role_slug === "super_admin";
  const currentCompanyId = isSuperAdmin ? "" : currentUser?.company_id || currentUser?.default_company || "";

  const accessMenus = flattenMenuModules(getStoredMenuList());
  const accessMenu = accessMenus.find(menu => menu.module_name === 'access-control' || menu.menu_link === '/access-control');
  const canEdit = isSuperAdmin || hasMenuAccess(accessMenu?.menu_id, accessMenus, getStoredPermissions(), 'edit');
  const requestVersion = useRef(0);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [defaultModules, setDefaultModules] = useState(DEFAULT_MODULES);
  const [modules, setModules] = useState([]);

  const fetchMenus = async () => {
    try {
      setLoadingMenus(true);
      const res = await getAccessMenus();

      if (!res?.success) {
        toast.error(res?.message || "Error while fetching menu list");
        setDefaultModules([]);
        return [];
      }

      const menuModules = flattenMenuModules(res.data || []);
      const nextModules = buildDefaultModules(menuModules);
      setDefaultModules(nextModules);
      return nextModules;
    } catch (error) {
      toast.error(error.message || "Error while fetching menu list");
      setDefaultModules([]);
      return [];
    } finally {
      setLoadingMenus(false);
    }
  };

  const fetchPreviousPermissions = async (identity) => {
    if (!identity?.id) return {};

    try {
      setLoadingPermissions(true);
      const res = await getIdentityPermissions(identity.id, identity.company_id);

      if (!res?.success) throw new Error(res?.message || "Unable to load role permissions");
      return normalizePermissionMap(res);
    } catch (error) {
      throw error;
    } finally {
      setLoadingPermissions(false);
    }
  };

  const loadSelectedPermissions = async (identity = selectedIdentity) => {
    if (!identity) {
      setModules([]);
      return;
    }

    const version = ++requestVersion.current;
    setModules([]);
    try {
      const [menuRows, permissionMap] = await Promise.all([fetchMenus(), fetchPreviousPermissions(identity)]);
      if (version === requestVersion.current) setModules(applyPermissionMapToModules(menuRows, permissionMap));
    } catch (error) {
      if (version === requestVersion.current) { setModules([]); toast.error(error.message); }
    }
  };

  useEffect(() => {
    if (!selectedIdentity) {
      setModules([]);
      return;
    }

    loadSelectedPermissions(selectedIdentity);
    return () => { requestVersion.current++; };

  }, [selectedIdentity]);

  const setModulePermission = (moduleId, permissionKey, nextValue) => {
    setModules(current => updateModulePermission(current, moduleId, permissionKey, nextValue));
  };

  const hasAllModulePermissions = modules.length > 0 && modules.every((module) =>
    accessPermissionColumns.every((column) =>
      !module.supports[column.key] || Boolean(module.permissions[column.key])
    )
  );

  const toggleAllModules = () => {
    const shouldEnable = !hasAllModulePermissions;

    setModules((current) =>
      current.map((module) => ({
        ...module,
        permissions: Object.fromEntries(
          accessPermissionColumns.map((column) => [
            column.key,
            shouldEnable && Boolean(module.supports[column.key]),
          ])
        ),
      }))
    );
  };

  const resetDefault = () => {
    setModules(
      defaultModules.map((module) => ({
        ...module,
        permissions: { ...module.permissions },
      }))
    );
    toast.info("Default permissions restored");
  };

  const saveChanges = async () => {
    if (!canEdit || saving || loadingMenus || loadingPermissions || !modules.length) return;
    const permissions = preparePermissionsJson(modules);
    if (!selectedIdentity?.id) {
      toast.error("Please select a role first");
      return;
    }

    setSaving(true);
    try {
    const res = await saveIdentityPermissions({
      identity: selectedIdentity,
      permissions,
    });

    if (res?.success) {
      await loadSelectedPermissions();
      toast.success(res?.message || "Permissions updated successfully");
      return;
    }

    toast.error(res?.message || "Unable to save permissions");
    } catch (error) { toast.error(error.message); } finally { setSaving(false); }
  };

  return {
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
  };
}
