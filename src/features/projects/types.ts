export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  avatar: string;
  islandId: string;
  order: number;
  hasMenu?: boolean;
  hasCheck?: boolean;
  hasCalendar?: boolean;
}
export interface Island {
  id: string;
  title: string;
  variant: 'light' | 'dark';
  tasks: Task[];
  position: {
    x: number;
    y: number;
  };
}
export interface Project {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
  date: string;
  owner: string;
  progress: number;
}
export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}
export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: string[];
}