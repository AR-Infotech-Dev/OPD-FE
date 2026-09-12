import DefaultLabel from "./DefaultLabel";
import DynamicIcon, { normalizeIconName } from '../ui/DynamicIcon';
import ValidationError from './ValidationError';

const DEFAULT_ICON_OPTIONS = [
  // Dashboard
  "layout-dashboard",
  "house",
  "layout-grid",
  "panels-top-left",
  "panel-left",
  "square-menu",
  "gauge",
  "activity",

  // Users & companies
  "users",
  "user-round",
  "circle-user-round",
  "contact-round",
  "user-cog",
  "id-card",
  "building-2",
  "briefcase-business",
  "handshake",

  // Tickets & support
  "ticket",
  "tickets",
  "headset",
  "life-buoy",
  "circle-help",
  "message-square",
  "messages-square",
  "mail",
  "phone-call",
  "inbox",

  // Products & orders
  "package",
  "packages",
  "boxes",
  "shopping-cart",
  "store",
  "truck",
  "factory",
  "clipboard-list",

  // Documents
  "file",
  "file-text",
  "file-spreadsheet",
  "receipt-text",
  "notepad-text",
  "folder",
  "folder-open",
  "files",

  // Reports
  "chart-line",
  "chart-pie",
  "chart-no-axes-column-increasing",
  "trending-up",
  "presentation",
  "table-2",

  // Finance
  "wallet",
  "credit-card",
  "banknote",
  "badge-indian-rupee",
  "circle-dollar-sign",
  "landmark",
  "calculator",

  // Workflow
  "workflow",
  "route",
  "network",
  "git-branch",
  "repeat-2",
  "shuffle",
  "refresh-cw",

  // Date & notification
  "calendar",
  "calendar-days",
  "clock-3",
  "alarm-clock",
  "bell",
  "bell-ring",

  // Actions
  "search",
  "filter",
  "list-filter",
  "list",
  "list-checks",
  "tag",
  "tags",
  "plus",
  "pencil",
  "trash-2",
  "download",
  "cloud-upload",

  // System
  "settings",
  "sliders-horizontal",
  "wrench",
  "database",
  "server",
  "cloud",
  "shield-check",
  "shield-user",
  "lock-keyhole",
  "key-round",

  // Location
  "map",
  "map-pin",
  "navigation",
  "globe-2",

  // AI & automation
  "sparkles",
  "wand-sparkles",
  "zap",
  "bot",
  "brain-circuit",
];

function IconPicker({ field, value, onChange, error }) {
  const options = DEFAULT_ICON_OPTIONS;

  const isDisabled = Boolean(field.disabled || field.readOnly);

  const handleSelect = (iconName) => {
    if (isDisabled) return;

    onChange?.({
      target: {
        name: field.name,
        value: iconName,
      },
    });
  };

  return (
    <div className="flex min-w-0 flex-col gap-1 p-1">
      <DefaultLabel
        label={field.label}
        required={field.required}
      />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2 rounded-sm border border-slate-200 p-2">
          {options.map((iconName) => {
            const isActive = normalizeIconName(value) === iconName;

            return (
              <button
                key={iconName}
                type="button"
                title={iconName}
                aria-label={`Select ${iconName}`}
                aria-pressed={isActive}
                disabled={isDisabled}
                onClick={() => handleSelect(iconName)}
                className={`m-auto flex h-10 w-10 items-center justify-center rounded-md border text-slate-600 transition-all ${isActive
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                  : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <DynamicIcon name={iconName} size={18} strokeWidth={1.8} />
              </button>
            );
          })}
        </div>

      {error ? <ValidationError error={error} /> : null}
    </div>
  );
}
export default IconPicker;
