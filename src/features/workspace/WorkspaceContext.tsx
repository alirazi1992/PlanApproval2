import React, { createContext, useContext, useState } from 'react';
import { WorkspaceTabId } from './types';

interface WorkspaceContextValue {
  activeTab: WorkspaceTabId;
  setActiveTab: (tab: WorkspaceTabId) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined
);

export const WorkspaceProvider = ({
  children,
  initialTab = 'cases'
}: {
  children: React.ReactNode;
  initialTab?: WorkspaceTabId;
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>(initialTab);

  return (
    <WorkspaceContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }

  return context;
};
