import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SubmenuType from "../../interface/submenutype_interface";

interface SidebarSubmenuProps {
  submenu: SubmenuType[];
  name: string;
  icon: JSX.Element;
  path: string;
  index: number;
}

function SidebarSubmenu({
  submenu,
  name,
  icon,
  path,
  index,
}: SidebarSubmenuProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (
      submenu &&
      submenu.length > 0 &&
      submenu.some((m) => m.path === location.pathname)
    ) {
      setIsExpanded(true);
    }
  }, [location.pathname, submenu]);

  return (
    <>
      <div
        className={`nav-link ${{ isExpanded } ? "active" : ""}  `}
        onClick={() => setIsExpanded(!isExpanded)}
        data-toggle={`#data-${name.toLowerCase().replace(/\s/g, "-")}`}
        data-target={`#data-${name.toLowerCase().replace(/\s/g, "-")}`}
        aria-expanded={isExpanded}
        aria-controls={`data-${name.toLowerCase().replace(/\s/g, "-")}`}
      >
        {icon}
        <i className="menu-icon"></i>
        <span className="menu-title">{name}</span>
        <i className="menu-arrow" />
      </div>
      <div
        className={`${
          isExpanded
            ? `#data-${name.toLowerCase().replace(/\s/g, "-")} show`
            : `collapse`
        }`}
        id={`data-${name.toLowerCase().replace(/\s/g, "-")}`}
      >
        <ul className="nav flex-column sub-menu">
          {submenu.map((m: SubmenuType, subIndex) => (
            <li key={subIndex} className="nav-item">
              <NavLink end to={m.path} className="nav-link">
                {m.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SidebarSubmenu;
