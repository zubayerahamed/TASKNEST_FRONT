export interface Workspace {
  id: number;
  name: string;
  isActive: boolean;
  isSystemDefined: boolean;
  avatar: string;
  isPrimary: boolean;
  isAdmin: boolean;
  isCollaborator: boolean;
  isWeekendSat: boolean;
  isWeekendSun: boolean;
  isWeekendMon: boolean;
  isWeekendTue: boolean;
  isWeekendWed: boolean;
  isWeekendThu: boolean;
  isWeekendFri: boolean;
}

export interface AddWorkspace {
  name: string;
}

export interface UpdateWorkspace {
  id: number;
  name: string;
}
