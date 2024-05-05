import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface SidebarContextValue {
  collapsed: boolean | undefined;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextValue>({} as SidebarContextValue);

export const SidebarContextProvider = (props: any) => {
  const [collapsed, setCollapsed] = useState(true);

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
    }),
    [collapsed],
  );

  return <SidebarContext.Provider value={value}>{props.children}</SidebarContext.Provider>;
};

export const useSidebar = () => useContext(SidebarContext);
