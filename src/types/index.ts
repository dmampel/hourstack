export interface Resource {
  id: string;
  label: string;
  url: string;
  type: 'link' | 'file';
  data?: string; // Para base64 de archivos pequeños
}

export interface Project {
  id: string;
  name: string;
  client?: string;
  hourlyRate: number;
  currency: 'ARS' | 'USD';
  color?: string;
  createdAt: Date;
  resources?: Resource[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string; // Base64
}

export interface Session {
  id: string;
  projectId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  description: string;
  earnings: number;
  isPaid: boolean;
  paidAt?: Date;
  notes?: string;
  attachments?: Attachment[];
}

export interface UserSettings {
  name: string;
  weeklyGoal: number;
  defaultCurrency: 'USD' | 'ARS';
}

export interface ActiveTimer {
  projectId: string;
  startTime: Date | null; // null means paused
  elapsedTime: number;    // seconds accumulated before last pause
}
