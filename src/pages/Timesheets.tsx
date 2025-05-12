
import React, { useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MonthlyCalendar from "@/components/timesheets/MonthlyCalendar";
import { ChevronLeft, ChevronRight, Download, Save, Send } from "lucide-react";

// Mock timesheet entries
const initialEntries: Record<string, { hours: number; type: string; note?: string }> = {
  "2025-05-01": { hours: 8, type: "work" },
  "2025-05-02": { hours: 8, type: "work" },
  "2025-05-03": { hours: 0, type: "holiday", note: "Weekend" },
  "2025-05-04": { hours: 0, type: "holiday", note: "Weekend" },
  "2025-05-05": { hours: 8, type: "work" },
  "2025-05-06": { hours: 8, type: "work" },
  "2025-05-07": { hours: 8, type: "work" },
  "2025-05-08": { hours: 8, type: "work" },
  "2025-05-09": { hours: 4, type: "work", note: "Half day" },
  "2025-05-10": { hours: 0, type: "holiday", note: "Weekend" },
  "2025-05-11": { hours: 0, type: "holiday", note: "Weekend" },
  "2025-05-12": { hours: 8, type: "work" },
};

const Timesheets = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, { hours: number; type: string; note?: string }>>(initialEntries);
  const [status, setStatus] = useState<"draft" | "submitted" | "approved" | "rejected">("draft");
  
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleEntryUpdate = (date: string, entry: { hours: number; type: string; note?: string }) => {
    setEntries((prev) => ({ ...prev, [date]: entry }));
  };

  // Calculate stats
  const totalHours = Object.values(entries).reduce((sum, entry) => sum + entry.hours, 0);
  const workDays = Object.values(entries).filter(entry => entry.hours > 0 && entry.type === "work").length;
  const leaveDays = Object.values(entries).filter(entry => entry.type === "leave").length;
  
  const handleSubmit = () => {
    setStatus("submitted");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Timesheet</h1>
          <p className="text-muted-foreground">
            Manage and submit your monthly timesheet
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Monthly Timesheet</CardTitle>
              <CardDescription>
                Click on a day to add or edit time entries
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-medium min-w-[140px] text-center">
                {format(currentDate, "MMMM yyyy")}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MonthlyCalendar
              date={currentDate}
              entries={entries}
              onEntryUpdate={handleEntryUpdate}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Click on a day to add or edit time entries
            </div>
            <div className="text-sm font-medium">
              Status: 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium
                ${status === "draft" ? "bg-gray-100 text-gray-800" : 
                  status === "submitted" ? "bg-yellow-100 text-yellow-800" :
                  status === "approved" ? "bg-green-100 text-green-800" : 
                  "bg-red-100 text-red-800"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </CardFooter>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>
                Current timesheet statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{totalHours}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Work Days</p>
                  <p className="text-2xl font-bold">{workDays}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leave Days</p>
                  <p className="text-2xl font-bold">{leaveDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p><strong>1.</strong> Click on any day in the calendar to add or edit time entries</p>
                <p><strong>2.</strong> Enter hours worked or select leave type</p>
                <p><strong>3.</strong> Save your draft regularly</p>
                <p><strong>4.</strong> Submit your timesheet at the end of the month</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timesheets;
