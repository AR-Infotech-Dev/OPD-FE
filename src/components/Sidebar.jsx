import MenuCollapse from './ui/MenuCollapse';
import DynamicIcon from './ui/DynamicIcon';
import { isParentMenu } from '../utils/menuTree';
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { useAuth } from "@auth/components/AuthProvider";
import { APP_NAME } from "@api/config";
import { getStoredMenuList, getStoredPermissions } from "@auth/utils/authStorage";
import { buildAllowedMenuTree, getMenuId, getMenuLabel, getMenuLink, normalizePath, } from "@auth/utils/permissions";

const buildSidebar = (menus = [], permissions = {}, user = {}) => {
  const convert = rows => rows.map(menu => ({
    id: getMenuId(menu), title: getMenuLabel(menu), path: isParentMenu(menu) ? '' : normalizePath(getMenuLink(menu)),
    iconName: menu.icon_name || menu.iconName, isParent: isParentMenu(menu), items: convert(menu.subMenu || []),
  })).filter(menu => menu.isParent || menu.path || menu.items.length);
  return convert(buildAllowedMenuTree(menus, permissions, user));
};

function NavigationMenu({ group, collapsedGroups, setCollapsedGroups, onSelectModule }) {
  const collapsed = Boolean(collapsedGroups[group.id]);
  
  if (group.isParent || group.items.length) return (
    <div className="sidebar-group">
      <button type="button" className="sidebar-group-title sidebar-group-toggle" aria-expanded={!collapsed}
        onClick={() => setCollapsedGroups(current => ({ ...current, [group.id]: !current[group.id] }))}>
        <span className="flex items-center gap-2"><DynamicIcon name={group.iconName} size={16} /> {group.title}</span>
        <ChevronDown size={14} className={'menu-expand-chevron' + (collapsed ? ' is-collapsed' : '')} />
      </button>
      <MenuCollapse open={!collapsed}>
        <div className="sidebar-group-items pl-3">
          {group.items.map(child => <NavigationMenu key={child.id} group={child} collapsedGroups={collapsedGroups}
            setCollapsedGroups={setCollapsedGroups} onSelectModule={onSelectModule} />)}
          {!group.items.length && <span className="px-3 py-2 text-xs text-slate-400">No menus</span>}
        </div>
      </MenuCollapse>
    </div>
  );
  return <NavLink to={group.path} className="no-underline" onClick={() => onSelectModule?.(group.path)}>
    {({ isActive }) => <span className={'sidebar-item w-full ' + (isActive ? 'active' : '')}>
      <span className="sidebar-icon"><DynamicIcon name={group.iconName} size={16} /></span><span>{group.title}</span>
    </span>}
  </NavLink>;
}

function Sidebar({ onSelectModule, isMobileOpen = false, onClose }) {
  const { authSession } = useAuth();
  const [menus, setMenus] = useState(() => getStoredMenuList());
  const [loading, setLoading] = useState(() => !getStoredMenuList().length);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const permissions = useMemo(() => getStoredPermissions(), [authSession]);
  const sidebarGroups = useMemo(
    () => buildSidebar(menus, permissions, authSession?.user),
    [menus, permissions, authSession?.user]
  );

  useEffect(() => {
    const syncMenus = (event) => {
      const nextMenus = event?.detail || getStoredMenuList();
      setMenus(nextMenus);
      setLoading(false);
    };

    const storedMenus = getStoredMenuList();
    if (storedMenus.length) {
      setMenus(storedMenus);
      setLoading(false);
    }

    window.addEventListener("crm:menus-updated", syncMenus);
    return () => window.removeEventListener("crm:menus-updated", syncMenus);
  }, []);

  useEffect(() => {
    const nextCollapsed = {};
    sidebarGroups.forEach((group) => {
      nextCollapsed[group.id] = false;
    });
    setCollapsedGroups(nextCollapsed);
  }, [sidebarGroups.length]);

  return (
    <>
      <button type="button" className={`sidebar-backdrop ${isMobileOpen ? "is-visible" : ""}`} onClick={onClose} aria-label="Close navigation menu" tabIndex={isMobileOpen ? 0 : -1} />
      <aside className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand" title={APP_NAME}>
          <img src="/logo.png" alt={APP_NAME} className="sidebar-logo" />
          <span className="sidebar-brand-fallback">{APP_NAME}</span>
          <button type="button" className="sidebar-mobile-close" onClick={onClose} aria-label="Close navigation menu" > <X size={18} /> </button>
        </div>

        <div className="sidebar-sections">
          <section className="sidebar-group">
            <div className="sidebar-group-title px-2">Main Menu</div>
            <div className="sidebar-group-items">
              {loading && <div className="p-3 text-xs text-slate-500">Loading menu...</div>}
              {!loading && sidebarGroups.length === 0 && (<div className="p-3 text-xs text-slate-500">No menu access</div>)}
              {!loading && sidebarGroups.map(group => <NavigationMenu key={group.id} group={group} collapsedGroups={collapsedGroups} setCollapsedGroups={setCollapsedGroups} onSelectModule={onSelectModule} />)}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
