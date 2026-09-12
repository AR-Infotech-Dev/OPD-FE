import { Component, lazy, Suspense } from 'react';
import { Folder } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const iconCache = new Map();
const compactName = value => value.replace(/[^a-z0-9]/gi, '').toLowerCase();
const iconNames = new Map(Object.keys(dynamicIconImports).map(name => [compactName(name), name]));
// Older menu records used this deprecated PascalCase export name.
iconNames.set('menusquare', 'square-menu');

export function normalizeIconName(name) {
  if (typeof name !== 'string') return 'folder';
  const trimmed = name.trim();
  if (Object.prototype.hasOwnProperty.call(dynamicIconImports, trimmed)) return trimmed;
  return iconNames.get(compactName(trimmed)) || 'folder';
}

function getIconComponent(name) {
  if (!iconCache.has(name)) iconCache.set(name, lazy(dynamicIconImports[name]));
  return iconCache.get(name);
}

class IconBoundary extends Component {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function DynamicIcon({name, size = 16, ...props}) {
  const iconName = normalizeIconName(name);
  const Icon = getIconComponent(iconName);
  const fallback = <Folder size={size} {...props} />;
  return (
    <IconBoundary key={iconName} fallback={fallback}>
      <Suspense fallback={fallback}>
        <Icon size={size} {...props} />
      </Suspense>
    </IconBoundary>
  );
}
