import MenuCollapse from '../../../components/ui/MenuCollapse';
import { useState } from 'react';
import { buildMenuTree, isParentMenu, menuId, parentId, moveMenu } from '../../../utils/menuTree';
import { ChevronDown, CornerUpLeft } from 'lucide-react';
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, pointerWithin, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit3, GripVertical, Link2, Settings, Trash2 } from "lucide-react";
import DynamicIcon from "../../../components/ui/DynamicIcon";
import SpinnerIllustration from "@/components/ui/SpinnerIllustration";
import NoTableData from '@/components/table/NoTableData';

const getMenuId = (menu = {}) => menu?.menu_id ?? menu?.menuID ?? menu?.id;
const getMenuName = (menu = {}) => menu?.menu_name || menu?.menuName || menu?.label || "Untitled menu";
const getModuleName = (menu = {}) => menu?.module_name || menu?.moduleName || "-";
const getMenuLink = (menu = {}) => menu?.menu_link || menu?.menuLink || menu?.path || "-";
const getStatus = (menu = {}) => menu?.status || "active";

function MenuRow({ menu, canEdit, canDelete, canSort, onEdit, onDelete, onConfigure, expanded, onToggle, onMoveOut, depth = 0, }) {
  const menuId = getMenuId(menu);
  const status = String(getStatus(menu)).toLowerCase();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: String(menuId), disabled: !canSort });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, marginLeft: depth * 20, width: `calc(100% - ${depth * 20}px)`, }} className={`w-[100%] grid min-w-225 grid-cols-[auto_minmax(220px,1.4fr)_minmax(150px,0.8fr)_minmax(180px,1fr)_90px_auto] items-center gap-3 border border-slate-200 bg-white px-2 py-2 shadow-sm ${isDragging ? "ring-2 ring-indigo-200 z-50" : ""} mb-0`} onClick={event => { if (isParentMenu(menu) && !event.target.closest("button, a, input, select, textarea")) onToggle?.(); }} >
      <button
        type="button"
        {...(canSort ? attributes : {})}
        {...(canSort ? listeners : {})}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 ${canSort ? "cursor-grab" : "cursor-not-allowed opacity-50"}`}
        disabled={!canSort}
        style={{ touchAction: "none" }}
        aria-label={`Move ${getMenuName(menu)}`}
        title="Drag to sort"
      >
        <GripVertical size={16} />
      </button>

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
          <DynamicIcon name={menu.icon_name || menu.iconName} size={16} />
        </div>

        <div className="min-w-0">
          <button
            type="button"
            // Edit permission controls whether row title opens the flyout.
            onClick={canEdit ? () => onEdit?.(menu) : undefined}
            className={`block max-w-full truncate text-left text-sm font-semibold text-slate-700 ${canEdit ? "hover:text-blue-600" : "cursor-default"}`}
          >
            {getMenuName(menu)}
          </button>
          <div className="mt-1 text-xs text-slate-500">ID: {menuId}</div>
        </div>
      </div>

      <div className="truncate text-sm text-slate-700">{isParentMenu(menu) ? "Parent menu" : getModuleName(menu)}</div>

      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
        <Link2 size={14} className="shrink-0" />
        <span className="truncate">{getMenuLink(menu)}</span>
      </div>

      <span className={`justify-self-start rounded-full px-2.5 py-1 text-xs font-semibold ${status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
        {status}
      </span>

      <div className="flex items-center justify-end gap-2">
        {isParentMenu(menu) && <button type="button" onClick={onToggle} aria-expanded={expanded} aria-label={`Toggle ${getMenuName(menu)}`}>
          <ChevronDown size={18} className={"menu-expand-chevron" + (expanded ? "" : " is-collapsed")} />
        </button>}
        {canSort && parentId(menu) !== '0' && <button type="button" onClick={onMoveOut} title="Move to top level" aria-label="Move to top level" className="p-2 text-slate-500"><CornerUpLeft size={15} /></button>}
        {canEdit && (<button type="button" onClick={() => onEdit?.(menu)} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-indigo-50 hover:text-indigo-600" title="Edit menu" > <Edit3 size={15} /> </button>)}
        {canEdit && !isParentMenu(menu) && (<button type="button" onClick={() => onConfigure?.(menu)} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-violet-50 hover:text-violet-600" title="Configure menu" > <Settings size={15} /> </button>)}
        {canDelete && (<button type="button" onClick={() => onDelete?.(menu)} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600" title="Delete menu" > <Trash2 size={15} /> </button>)}
      </div>
    </div>
  );
}

function GroupDropZone({ id, disabled, inactive = false, label, depth = 0 }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'group:' + id, disabled: disabled || inactive });
  if (disabled) return null;
  return <div ref={setNodeRef} style={{ marginLeft: depth * 20 }}
    className={'my-1 rounded border border-dashed px-4 py-3 text-xs ' + (isOver ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-400')}>
    {label}
  </div>;
}

function MenuList({ rows = [], loading = false, canEdit = true, canDelete = true, canSort = true, onEdit, onDelete, onConfigure, onSortChange }) {
  const [collapsed, setCollapsed] = useState({});
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const tree = buildMenuTree(rows);

  const handleDragEnd = ({ active, over }) => {
    if (!canSort || !over) return;
    const group = String(over.id).startsWith('group:');
    const target = group ? String(over.id).slice(6) : String(over.id);
    const next = moveMenu(rows, active.id, target, group);
    if (next !== rows) {
      onSortChange?.(next);
      if (group) setCollapsed(current => ({ ...current, [target]: false }));
    }
  };
  const renderRows = (nodes, depth = 0, visible = true) => <SortableContext items={nodes.map(menuId)} strategy={verticalListSortingStrategy}>
    {nodes.map(menu => {
      const id = menuId(menu), expanded = !collapsed[id];
      return <div key={id} className='bg-[#e5f8f66e]'>
        <MenuRow menu={menu} depth={depth} canEdit={canEdit} canDelete={canDelete} canSort={canSort && visible}
          onEdit={onEdit} onDelete={onDelete} onConfigure={onConfigure} expanded={expanded}
          onToggle={() => setCollapsed(current => ({ ...current, [id]: !current[id] }))}
          onMoveOut={() => onSortChange?.(moveMenu(rows, id, '0', true))} />
        {isParentMenu(menu) && (
          <div className='py-1'>
            <GroupDropZone id={id} disabled={!canSort} inactive={!visible} depth={depth + 1} label={'Drop into ' + getMenuName(menu)} />
            <MenuCollapse open={expanded}>{renderRows(menu.subMenu, depth + 1, visible && expanded)}</MenuCollapse>
          </div>
        )}
      </div>;
    })}
  </SortableContext>;

  if (loading) return <div className="h-full w-full bg-white p-4"><SpinnerIllustration /></div>;
  if (!rows.length)
    return <div className='w-full min-h-[360px] overflow-x-auto px-3 py-3 flex items-center justify-center'>
      <div>
        <NoTableData />
      </div>
    </div>

  return <DndContext sensors={sensors} collisionDetection={args => { const hits = pointerWithin(args); return hits.length ? hits : closestCenter(args); }} onDragEnd={handleDragEnd}>
    <div className="w-full min-h-[360px] overflow-x-auto px-3 py-3" style={{ scrollbarWidth: "none" }}>
      <p className="mb-3 text-xs text-slate-500">{canSort ? 'Drag handles to sort. Drop into a parent to nest menus, then Save Sequence.' : 'Clear search and filters to arrange menus.'}</p>
      {renderRows(tree)}
    </div>
  </DndContext>;
}

export default MenuList;
