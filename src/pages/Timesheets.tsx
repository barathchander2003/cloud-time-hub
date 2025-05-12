
import React, { useState, useEffect } from "react";
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
import { LeaveRequest } from "@/components/timesheets/LeaveRequest";
import { ChevronLeft, ChevronRight, Download, Save, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const Timesheets = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, { hours: number; type: string; note?: string }>>({});
  const [status, setStatus] = useState<"draft" | "submitted" | "approved" | "rejected">("draft");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch timesheet entries from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchEntries = async () => {
      setIsLoading(true);
      
      // Get the month and year for filtering
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      // Calculate the first and last day of the month
      const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate().toString().padStart(2, '0')}`;
      
      try {
        const { data, error } = await supabase
          .from('timesheets')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', firstDay)
          .lte('date', lastDay);
          
        if (error) throw error;
        
        const entriesMap: Record<string, { hours: number; type: string; note?: string }> = {};
        
        // Initialize the entries map with default values for the entire month
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const day = i.toString().padStart(2, '0');
          const date = `${year}-${month.toString().padStart(2, '0')}-${day}`;
          const dayOfWeek = new Date(date).getDay();
          
          // Set defaults for weekends
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            entriesMap[date] = { hours: 0, type: "holiday", note: "Weekend" };
          } else {
            entriesMap[date] = { hours: 8, type: "work" };
          }
        }
        
        // Update the entries map with data from Supabase
        if (data) {
          data.forEach((entry) => {
            const type = entry.hours_worked === 0 ? "leave" : "work";
            entriesMap[entry.date] = { 
              hours: entry.hours_worked, 
              type: type,
              note: entry.description
            };
          });
        }
        
        setEntries(entriesMap);
      } catch (error) {
        console.error('Error fetching timesheet entries:', error);
        toast({
          title: "Failed to fetch data",
          description: "Could not load your timesheet entries. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [user, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleEntryUpdate = async (date: string, entry: { hours: number; type: string; note?: string }) => {
    // Update locally first for immediate UI feedback
    setEntries((prev) => ({ ...prev, [date]: entry }));
    
    // Then save to Supabase
    try {
      // Check if an entry already exists for this date
      const { data: existingEntries } = await supabase
        .from('timesheets')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', date)
        .single();
        
      if (existingEntries) {
        // Update existing entry
        const { error } = await supabase
          .from('timesheets')
          .update({
            hours_worked: entry.hours,
            description: entry.note
          })
          .eq('user_id', user?.id)
          .eq('date', date);
          
        if (error) throw error;
      } else {
        // Insert new entry
        const { error } = await supabase
          .from('timesheets')
          .insert({
            user_id: user?.id,
            date: date,
            hours_worked: entry.hours,
            description: entry.note,
            status: 'draft'
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Entry saved",
        description: "Your timesheet entry has been saved"
      });
    } catch (error) {
      console.error('Error saving timesheet entry:', error);
      toast({
        title: "Failed to save",
        description: "Could not save your entry. Please try again.",
        variant: "destructive"
      });
      
      // Revert the local update if it failed
      fetchEntries();
    }
  };

  // Function to fetch entries - called after submit or when entry update fails
  const fetchEntries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate().toString().padStart(2, '0')}`;
    
    try {
      const { data, error } = await supabase
        .from('timesheets')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', firstDay)
        .lte('date', lastDay);
        
      if (error) throw error;
      
      const entriesMap = { ...entries };
      
      if (data) {
        data.forEach((entry) => {
          const type = entry.hours_worked === 0 ? "leave" : "work";
          entriesMap[entry.date] = { 
            hours: entry.hours_worked, 
            type: type,
            note: entry.description
          };
        });
      }
      
      setEntries(entriesMap);
    } catch (error) {
      console.error('Error fetching timesheet entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save draft timesheet
  const handleSaveDraft = async () => {
    try {
      // We've been saving each entry individually, so this just confirms to the user
      toast({
        title: "Draft saved",
        description: "Your timesheet draft has been saved"
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Failed to save",
        description: "Could not save your draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Export timesheet as CSV
  const handleExport = () => {
    // Convert entries to CSV format
    const rows = [["Date", "Hours", "Type", "Description"]];
    
    Object.entries(entries).forEach(([date, entry]) => {
      rows.push([
        date,
        entry.hours.toString(),
        entry.type,
        entry.note || ""
      ]);
    });
    
    const csvContent = rows.map(row => row.join(",")).join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = `timesheet-${format(currentDate, "yyyy-MM")}.csv`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast({
      title: "Timesheet exported",
      description: `Your timesheet for ${format(currentDate, "MMMM yyyy")} has been exported`
    });
  };

  // Submit timesheet for approval
  const handleSubmit = async () => {
    try {
      // Update all entries to "submitted" status
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const { error } = await supabase
        .from('timesheets')
        .update({ status: 'Pending' })
        .eq('user_id', user?.id)
        .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
        .lte('date', `${year}-${month.toString().padStart(2, '0')}-31`);
        
      if (error) throw error;
      
      setStatus("submitted");
      
      toast({
        title: "Timesheet submitted",
        description: "Your timesheet has been submitted for approval"
      });
    } catch (error) {
      console.error('Error submitting timesheet:', error);
      toast({
        title: "Failed to submit",
        description: "Could not submit your timesheet. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Calculate stats
  const totalHours = Object.values(entries).reduce((sum, entry) => sum + entry.hours, 0);
  const workDays = Object.values(entries).filter(entry => entry.hours > 0 && entry.type === "work").length;
  const leaveDays = Object.values(entries).filter(entry => entry.type === "leave").length;

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
          <LeaveRequest onRequestSubmitted={fetchEntries} />
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={handleExport}>
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
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <MonthlyCalendar
                date={currentDate}
                entries={entries}
                onEntryUpdate={handleEntryUpdate}
              />
            )}
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
                <p><strong>5.</strong> Use the Request Leave button for leave applications</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timesheets;
