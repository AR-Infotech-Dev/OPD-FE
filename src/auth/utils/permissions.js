import { hasMenuAccess, pickActionPermissions } from '../../utils/menuAccess';
import { buildMenuTree, isParentMenu } from '../../utils/menuTree';
import { getStoredMenuList, getStoredPermissions } from "./authStorage";
import { getMenus, getPermissions } from "../data/auth.service";

let menuListRequest = null;
let menuListForbidden = false;

export const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  return ["1", "true", "yes", "y", "on"].includes(String(value || "").toLowerCase());
};

export const normalizePath = (value = "") => {
  const path = String(value || "").trim();
  if (!path) return "";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.replace(/\/+$/, "") || "/";
};

export const getMenuId = (menu = {}) => menu?.menu_id || menu?.menuID || menu?.menuId || menu?.id;
export const getMenuLabel = (menu = {}) => menu?.menuName || menu?.menu_name || menu?.label || menu?.module_name || "Menu";
export const getMenuLink = (menu = {}) => menu?.menuLink || menu?.menu_link || menu?.path || "";

const getMenuIcon = (menu = {}) => menu?.iconName || menu?.icon_name || menu?.icon || "";

const getPermissionSource = (payload = {}) =>
  payload?.permissions ||
  payload?.data?.permissions ||
  payload?.data?.rows ||
  payload?.data?.result ||
  payload?.data?.list ||
  payload?.rows ||
  payload?.result ||
  payload?.list ||
  payload?.data ||
  payload;

export const flattenMenus = (menus = []) =>
  menus.flatMap((menu) => [
    menu,
    ...(menu?.subMenu || menu?.submenu || menu?.children || []).flatMap((child) => flattenMenus([child])),
  ]);

export const findMenuByPath = (pathname, menus = getStoredMenuList()) => {
  const currentPath = normalizePath(pathname);
  return flattenMenus(menus).find((menu) => normalizePath(getMenuLink(menu)) === currentPath) || null;
};

export const hasMenuViewPermission = ({ menuId, pathname, user } = {}) => {
  const roleSlug = user?.role_slug;
  if (roleSlug === "super_admin") return true;

  const resolvedMenuId = menuId || getMenuId(findMenuByPath(pathname));
  if (!resolvedMenuId) return false;

  const permissions = getStoredPermissions();
  return hasMenuAccess(resolvedMenuId, flattenMenus(buildMenuTree(getStoredMenuList())), permissions);
};

export const hasMenuActionPermission = ({ menuId, action, user } = {}) => {
  if (user?.role_slug === "super_admin") return true;

  // Same helper is used for add/edit/delete buttons, so every page reads permission in one simple way.
  return hasMenuAccess(menuId, flattenMenus(buildMenuTree(getStoredMenuList())), getStoredPermissions(), action);
};

export const getFirstAllowedPath = ({ user } = {}) => {
  const menus = flattenMenus(buildAllowedMenuTree(getStoredMenuList(), getStoredPermissions(), user));
  const first = menus.find((menu) =>
    normalizePath(getMenuLink(menu)) && hasMenuViewPermission({ menuId: getMenuId(menu), user })
  );
  return first ? normalizePath(getMenuLink(first)) : "";
};

export const normalizePermissionMap = (payload = {}) => {
  let source = getPermissionSource(payload);
  if (source?.permissions !== undefined) source = source.permissions;
  if (typeof source === 'string') { try { source = JSON.parse(source); } catch { source = {}; } }

  if (Array.isArray(source)) {
    return pickActionPermissions(source.reduce((accumulator, item) => {
      const menuId = item?.menu_id || item?.menuID || item?.menuId || item?.id;
      if (menuId) accumulator[String(menuId)] = item;
      return accumulator;
    }, {}));
  }

  return pickActionPermissions(source);
};

export const buildMenusFromPermissions = (permissions = {}) => {
  const rows = Array.isArray(permissions)
    ? permissions.map((permission) => [undefined, permission])
    : Object.entries(permissions || {});

  return rows
    .map(([permissionKey, permission]) => {
      const menu = permission?.menu || permission?.menuData || permission?.menu_details || permission;
      const menuId = getMenuId(menu) || permission?.menu_id || permission?.menuID || permission?.menuId || permissionKey;
      const menuLink = getMenuLink(menu) || permission?.menu_link || permission?.menuLink || permission?.path;

      if (!menuId || (!menuLink && !isParentMenu(menu))) return null;

      return {
        menu_id: menuId,
        is_parent: isParentMenu(menu),
        menu_index: menu.menu_index,
        status: menu.status,
        menuName: getMenuLabel(menu),
        menu_link: menuLink,
        icon_name: getMenuIcon(menu),
        parentID: menu?.parentID || menu?.parent_id || permission?.parentID || permission?.parent_id || 0,
        subMenu: [],
      };
    })
    .filter(Boolean);
};

export const fetchUserPermissions = async (userId, companyId = "") => {
  if (!userId) return {};

  const res = await getPermissions(userId, companyId);

  return res?.success ? normalizePermissionMap(res) : {};
};

const fetchBootstrapMenus = async () => {
  const res = await getMenus();
  if (res?.success || (res?.status !== 404 && res?.code !== 404)) {
    return res;
  }
};

export const fetchMenuList = async (options = {}) => {
  const { fallbackPermissions, forceRefresh = false } = options;
  const storedMenus = getStoredMenuList();
  if (!forceRefresh && storedMenus.length) return storedMenus;
  if (menuListForbidden) return buildMenusFromPermissions(fallbackPermissions);

  if (menuListRequest) return menuListRequest;

  menuListRequest = (async () => {
    const res = await fetchBootstrapMenus();

    if (res?.success) return res.data || [];
    if (res?.type === "FORBIDDEN" || res?.code === 2007 || res?.status === 403) {
      menuListForbidden = true;
    }
    return buildMenusFromPermissions(fallbackPermissions);
  })();

  try {
    return await menuListRequest;
  } finally {
    menuListRequest = null;
  }
};

export const canViewMenu = (menu = {}, permissions = getStoredPermissions(), user = {}, menus = getStoredMenuList()) => {
  if (user?.role_slug === "super_admin") return true;

  const menuId = getMenuId(menu);
  if (!menuId) return false;

  return hasMenuAccess(menuId, flattenMenus(buildMenuTree(menus)), permissions);
};

export const buildAllowedMenuTree = (menus = [], permissions = getStoredPermissions(), user = {}) => {
  const tree = buildMenuTree(menus), allMenus = flattenMenus(tree);
  const prune = rows => rows.map(menu => {
    if (menu.status && menu.status !== 'active') return null;
    if (user?.role_slug !== 'super_admin' && !hasMenuAccess(getMenuId(menu), allMenus, permissions)) return null;
    const children = prune(menu.subMenu || []);
    if (isParentMenu(menu) && !children.length && user?.role_slug !== 'super_admin') return null;
    return {...menu, subMenu: children};
  }).filter(Boolean);
  return prune(tree);
};
