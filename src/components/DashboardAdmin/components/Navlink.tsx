import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import * as React from "react";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

export default function NavLink({ to, children }: NavLinkProps) {
  const location = useLocation();

  // ACTIVE jika:
  // /product
  // /product/details
  // /product/edit/123

const isActive = location.pathname.includes(to);
  return (
    <RouterNavLink
      to={to}
      className={`relative flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
        isActive
          ? "bg-primary text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Garis samping kiri */}
      <span
        className={`absolute -left-2.5 top-0 h-full w-1 rounded-r-md ${
          isActive ? "bg-primary" : "bg-transparent"
        }`}
      />
      {children}
    </RouterNavLink>
  );
}
