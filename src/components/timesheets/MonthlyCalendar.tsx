
import React from "react";
import { addDays, endOfMonth, endOfWeek, format, getDay, isToday, startOfMonth, startOfWeek } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthlyCalendarProps {
  date: Date;
  entries?: Record<string, { hours: number; type: string; note?: string }>;
  onDateClick?: (date: Date) => void;
  onEntryUpdate?: (date: string, entry: { hours: number; type: string; note?: string }) => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  date,
  entries = {},
  onDateClick,
  onEntryUpdate,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [hours, setHours] = React.useState("8");
  const [entryType, setEntryType] = React.useState("work");
  const [note, setNote] = React.useState("");
  
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    const dateKey = formatDateKey(day);
    const currentEntry = entries[dateKey] || { hours: 8, type: "work", note: "" };
    
    setHours(currentEntry.hours.toString());
    setEntryType(currentEntry.type);
    setNote(currentEntry.note || "");
    
    if (onDateClick) {
      onDateClick(day);
    }
  };

  const handleSaveEntry = () => {
    if (!selectedDate) return;
    
    const dateKey = formatDateKey(selectedDate);
    
    if (onEntryUpdate) {
      onEntryUpdate(dateKey, {
        hours: parseFloat(hours),
        type: entryType as string,
        note: note,
      });
    }
    
    setSelectedDate(null);
  };

  // Generate calendar days
  const calendarDays = [];
  let day = startDate;
  
  while (day <= endDate) {
    const dayFormatted = formatDateKey(day);
    const isCurrentMonth = day.getMonth() === date.getMonth();
    const dayEntry = entries[dayFormatted];
    
    calendarDays.push({
      date: day,
      isCurrentMonth,
      isToday: isToday(day),
      entry: dayEntry,
    });
    
    day = addDays(day, 1);
  }

  return (
    <div className="border rounded-md bg-white">
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-medium text-sm bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map(({ date, isCurrentMonth, isToday, entry }) => (
          <div
            key={date.toString()}
            className={`min-h-24 p-2 border border-gray-100 transition-colors hover:bg-gray-50 ${
              !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
            } ${isToday ? "bg-blue-50" : ""}`}
            onClick={() => handleDateClick(date)}
          >
            <div className="flex justify-between mb-1">
              <span className={`text-sm font-medium ${isToday ? "bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full" : ""}`}>
                {format(date, "d")}
              </span>
              {entry && (
                <span className="text-xs font-medium">{entry.hours}h</span>
              )}
            </div>
            {entry && (
              <div
                className={`text-xs p-1 rounded truncate ${
                  entry.type === "work"
                    ? "bg-blue-100 text-blue-800"
                    : entry.type === "leave"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {entry.type === "work"
                  ? "Work"
                  : entry.type === "leave"
                  ? "Leave"
                  : "Holiday"}
                {entry.note && `: ${entry.note}`}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Entry Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `Time Entry - ${format(selectedDate, "MMMM d, yyyy")}`
                : "Time Entry"}
            </DialogTitle>
            <DialogDescription>
              Enter your time for this day.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Entry Type</Label>
              <Select value={entryType} onValueChange={setEntryType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select entry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for this entry"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDate(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEntry}>Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthlyCalendar;
