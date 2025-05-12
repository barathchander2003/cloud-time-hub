
export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";
export type EntryType = "work" | "leave" | "holiday";

export interface TimesheetEntry {
  id: string;
  date: string;
  hours: number;
  type: EntryType;
  description?: string;
  documentId?: string;
}

export interface Timesheet {
  id: string;
  employeeId: string;
  year: number;
  month: number;
  status: TimesheetStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
  entries: TimesheetEntry[];
  totalHours: number;
  totalWorkHours: number;
  totalLeaveHours: number;
}
