import { Island } from '../projects/types';

export type WorkspaceTabId =
  | 'relationship'
  | 'opportunities'
  | 'leads'
  | 'calendar'
  | 'cases'
  | 'reports'
  | 'quotes';

export interface WorkspaceTab {
  id: WorkspaceTabId;
  label: string;
  description: string;
  accent: string;
}

export interface WorkspaceMetric {
  id: string;
  label: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export interface WorkspaceReminder {
  id: string;
  title: string;
  owner: string;
  due: string;
}

export interface WorkspaceSnapshot {
  id: WorkspaceTabId;
  headline: string;
  subline: string;
  priority: string;
  islands: Island[];
  metrics: WorkspaceMetric[];
  reminders: WorkspaceReminder[];
}
