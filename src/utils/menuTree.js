export const isParentMenu = menu => [true, 1, '1', 'true', 'yes'].includes(menu?.is_parent);
export const menuId = menu => String(menu?.menu_id ?? menu?.menuID ?? menu?.id);
export const parentId = menu => String((menu && 'parent_id' in menu ? menu.parent_id : menu?.parentID) || 0);
export function buildMenuTree(menus = []) {
  const nodes = new Map();
  function collect(rows, inheritedParent = '0') {
    for (const row of rows) {
      const id = menuId(row);
      if (nodes.has(id)) continue;
      const parent = parentId(row) !== '0' ? parentId(row) : inheritedParent;
      nodes.set(id, {...row, parent_id: parent === '0' ? null : parent, subMenu: []});
      collect(row.subMenu || row.submenu || row.children || [], id);
    }
  }
  collect(menus);
  const roots = [];
  for (const node of nodes.values()) {
    const seen = new Set([menuId(node)]);
    let ancestor = parentId(node), cyclic = false;
    while (nodes.has(ancestor)) {
      if (seen.has(ancestor)) { cyclic = true; break; }
      seen.add(ancestor); ancestor = parentId(nodes.get(ancestor));
    }
    const parent = nodes.get(parentId(node));
    if (parent && !cyclic) parent.subMenu.push(node); else roots.push(node);
  }
  const sort = rows => rows.sort((a, b) => (Number(a.menu_index ?? 999) - Number(b.menu_index ?? 999)) || Number(menuId(a)) - Number(menuId(b))).map(row => ({...row, subMenu: sort(row.subMenu)}));
  return sort(roots);
}
export function menuPositions(rows) {
  const counts = new Map();
  return rows.map(row => {
    const parent = parentId(row), index = (counts.get(parent) || 0) + 1;
    counts.set(parent, index);
    return {menu_id: Number(menuId(row)), parent_id: parent === '0' ? null : Number(parent), menu_index: index};
  });
}
export function moveMenu(rows, activeId, targetId, intoGroup = false) {
  const active = rows.find(row => menuId(row) === String(activeId));
  const target = rows.find(row => menuId(row) === String(targetId));
  if (!active || (target && menuId(active) === menuId(target))) return rows;
  if (intoGroup && target && !isParentMenu(target)) return rows;
  if (!target && !(intoGroup && String(targetId) === '0')) return rows;
  const destination = intoGroup ? String(targetId) : parentId(target);
  const byId = new Map(rows.map(row => [menuId(row), row]));
  const seen = new Set([menuId(active)]);
  let cursor = destination;
  while (cursor !== '0' && byId.has(cursor)) {
    if (seen.has(cursor)) return rows;
    seen.add(cursor); cursor = parentId(byId.get(cursor));
  }
  const next = rows.filter(row => menuId(row) !== menuId(active));
  const moved = {...active, parent_id: destination === '0' ? null : Number(destination)};
  if (intoGroup) next.push(moved);
  else {
    const oldIndex = rows.indexOf(active), targetIndex = rows.indexOf(target);
    const insertAt = next.findIndex(row => menuId(row) === menuId(target));
    next.splice(insertAt + (parentId(active) === destination && oldIndex < targetIndex ? 1 : 0), 0, moved);
  }
  const positions = new Map(menuPositions(next).map(row => [String(row.menu_id), row]));
  return next.map(row => ({...row, ...positions.get(menuId(row))}));
}
