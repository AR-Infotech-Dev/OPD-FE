import {
  Gauge,
  LayoutGrid,
  MapPin,
  Package,
  Shapes,
  Ticket,
  User,
  Users,
} from "lucide-react";

export const accessIdentities = [
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "Super Admin",
    badge: "SUPER ADMIN",
    initials: "AR",
  },
  {
    id: "support-lead",
    name: "Support Lead",
    email: "support@example.com",
    role: "Support Lead",
    badge: "ROLE",
    initials: "SL",
  },
  {
    id: "manager",
    name: "Manager",
    email: "manager@example.com",
    role: "Manager",
    badge: "ROLE",
    initials: "MG",
  },
];

export const accessModules = [
  {
    id: "dashboardddd",
    name: "Dashboard",
    icon: LayoutGrid,
    supports: { view: true, add: false, edit: false, delete: false },
    permissions: { view: true, add: false, edit: false, delete: false },
  },
  {
    id: "user-markers",
    name: "User Markers",
    icon: MapPin,
    supports: { view: true, add: true, edit: true, delete: true },
    permissions: { view: true, add: true, edit: false, delete: false },
  },
  {
    id: "users",
    name: "Users",
    icon: User,
    supports: { view: true, add: true, edit: true, delete: true },
    permissions: { view: true, add: true, edit: true, delete: false },
  },
  {
    id: "customers",
    name: "Customers",
    icon: Gauge,
    supports: { view: true, add: true, edit: true, delete: true },
    permissions: { view: true, add: true, edit: false, delete: false },
  },
  {
    id: "products",
    name: "Products",
    icon: Package,
    supports: { view: true, add: true, edit: true, delete: true },
    permissions: { view: true, add: true, edit: false, delete: false },
  },
  {
    id: "tickets",
    name: "Tickets",
    icon: Ticket,
    supports: { view: true, add: true, edit: true, delete: true },
    permissions: { view: true, add: true, edit: true, delete: true },
  },
  {
    id: "category",
    name: "Category",
    icon: Shapes,
    supports: { view: true, add: true, edit: true, delete: true },
    permissions: { view: true, add: false, edit: false, delete: false },
  },
];

export const accessPermissionColumns = [
  { key: "view", label: "View" },
  { key: "add", label: "Add" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];
