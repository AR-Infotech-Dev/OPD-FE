import { useEffect, useState } from 'react';
import './menu-collapse.css';

export default function MenuCollapse({ open, children }) {
  const [settled, setSettled] = useState(open);
  useEffect(() => {
    if (!open) { setSettled(false); return; }
    const timer = window.setTimeout(() => setSettled(true), 250);
    return () => window.clearTimeout(timer);
  }, [open]);
  return (
    <div className={'menu-collapse' + (open ? ' is-open' : '') + (open && settled ? ' is-settled' : '')} aria-hidden={!open} inert={open ? undefined : ''}>
      <div className="menu-collapse-content">{children}</div>
    </div>
  );
}
