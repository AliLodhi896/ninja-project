/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import _uniqueId from 'lodash/uniqueId';

type MobileSubMenuProperties = {
  children?: any;
  title?: string;
  ref?: any;
  defaultOpen?: boolean;
};
export function MobileSubMenu({
  children,
  title,
  ref,
  defaultOpen = false,
}: MobileSubMenuProperties) {
  const menuRef: LegacyRef<HTMLLIElement> = React.createRef<HTMLLIElement>();
  const [id] = useState(_uniqueId());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    menuRef?.current?.setAttribute('id', id);
    defaultOpen && handleClick();
  }, []);

  const handleClick = () => {
    const newStatus = !open;
    setOpen(newStatus);

    if (newStatus) {
      if (!menuRef?.current?.classList.contains('sub-open'))
        menuRef?.current?.classList.add('sub-open');
    } else {
      if (menuRef?.current?.classList.contains('sub-open'))
        menuRef?.current?.classList.remove('sub-open');
    }
  };

  return (
    <li ref={menuRef} className="nav-item nav-main-item">
      <a
        className="nav-link nav-main-link nav-main-link-submenu"
        onClick={handleClick}
        style={open ? { backgroundColor: '#2C2F36' } : {}}
      >
        {title}
        <i className={`fa fa-arrow-${open ? 'down' : 'right'}`}></i>
      </a>
      <ul className="nav-main-submenu">{children}</ul>
    </li>
  );
}

type MobileSubMenuItemProperties = {
  children?: any;
  onClick?: () => any;
};
export function MobileSubMenuItem({ onClick, children }: MobileSubMenuItemProperties) {
  // TODO: get parent referance and close the submenu when click called
  return (
    <li className="nav-item nav-main-item" onClick={onClick}>
      {children}
    </li>
  );
}
