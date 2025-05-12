
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, Filter, Search, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Approvals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [historyApprovals, setHistoryApprovals] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch timesheet data from Supabase
  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    setIsLoading(true);
    try {
      // Fetch pending timesheets
      const { data: pendingData, error: pendingError } = await supabase
        .from('timesheets')
        .select(`
          *,
          users:user_id (
            email
          )
        `)
        .eq('status', 'Pending');

      if (pendingError) throw pendingError;

      // Fetch approved/rejected timesheets
      const { data: historyData, error: historyError } = await supabase
        .from('timesheets')
        .select(`
          *,
          users:user_id (
            email
          )
        `)
        .in('status', ['Approved', 'Rejected']);

      if (historyError) throw historyError;

      // Group timesheets by user and month
      const pending = groupTimesheetsByUserAndMonth(pendingData);
      const history = groupTimesheetsByUserAndMonth(historyData);

      setPendingApprovals(pending);
      setHistoryApprovals(history);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      toast({
        title: "Failed to fetch data",
        description: "Could not load timesheet approval data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to group timesheet entries by user and month
  const groupTimesheetsByUserAndMonth = (data) => {
    const grouped = {};
    
    if (!data || data.length === 0) return [];
    
    data.forEach(entry => {
      const userId = entry.user_id;
      const date = new Date(entry.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${userId}_${year}_${month}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          userId: userId,
          employeeName: entry.users?.email?.split('@')[0] || 'Unknown',
          email: entry.users?.email || 'unknown@example.com',
          month: format(date, 'MMMM yyyy'),
          submittedDate: entry.created_at,
          reviewedDate: entry.status !== 'Pending' ? entry.updated_at : null,
          status: entry.status,
          entries: [],
          totalHours: 0,
          comments: entry.description || ''
        };
      }
      
      grouped[key].entries.push(entry);
      grouped[key].totalHours += parseFloat(entry.hours_worked);
    });
    
    return Object.values(grouped);
  };

  const handleReview = (timesheet) => {
    setSelectedTimesheet(timesheet);
    setComment("");
  };

  const handleApprove = async () => {
    if (!selectedTimesheet) return;
    
    setIsSubmitting(true);
    
    try {
      // Update all timesheet entries for this user and month to approved
      const userId = selectedTimesheet.userId;
      const [, year, month] = selectedTimesheet.id.split('_');
      
      // Calculate the first and last day of the month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, parseInt(month) + 1, 0);
      
      const firstDayStr = format(firstDay, 'yyyy-MM-dd');
      const lastDayStr = format(lastDay, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('timesheets')
        .update({
          status: 'Approved',
          description: comment.length > 0 ? comment : null
        })
        .eq('user_id', userId)
        .gte('date', firstDayStr)
        .lte('date', lastDayStr);
        
      if (error) throw error;
      
      toast({
        title: "Timesheet approved",
        description: `You have approved the timesheet for ${selectedTimesheet.employeeName}`
      });
      
      // Refresh the data
      fetchTimesheets();
      
      // Close the dialog
      setSelectedTimesheet(null);
    } catch (error) {
      console.error('Error approving timesheet:', error);
      toast({
        title: "Approval failed",
        description: "Could not approve the timesheet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTimesheet || !comment) {
      toast({
        title: "Comment required",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update all timesheet entries for this user and month to rejected
      const userId = selectedTimesheet.userId;
      const [, year, month] = selectedTimesheet.id.split('_');
      
      // Calculate the first and last day of the month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, parseInt(month) + 1, 0);
      
      const firstDayStr = format(firstDay, 'yyyy-MM-dd');
      const lastDayStr = format(lastDay, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('timesheets')
        .update({
          status: 'Rejected',
          description: comment
        })
        .eq('user_id', userId)
        .gte('date', firstDayStr)
        .lte('date', lastDayStr);
        
      if (error) throw error;
      
      toast({
        title: "Timesheet rejected",
        description: `You have rejected the timesheet for ${selectedTimesheet.employeeName}`
      });
      
      // Refresh the data
      fetchTimesheets();
      
      // Close the dialog
      setSelectedTimesheet(null);
    } catch (error) {
      console.error('Error rejecting timesheet:', error);
      toast({
        title: "Rejection failed",
        description: "Could not reject the timesheet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPendingApprovals = pendingApprovals.filter(timesheet => 
    timesheet.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    timesheet.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    timesheet.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistoryApprovals = historyApprovals.filter(timesheet => 
    timesheet.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    timesheet.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    timesheet.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    timesheet.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timesheet Approvals</h1>
          <p className="text-muted-foreground">
            Review and manage timesheet submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => {
            toast({
              title: "Coming soon",
              description: "Bulk approval functionality is coming soon."
            });
          }}>
            Approve All
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search submissions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending 
            <span className="ml-2 bg-primary/10 text-primary font-medium rounded-full px-2 py-0.5 text-xs">
              {filteredPendingApprovals.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredPendingApprovals.map((timesheet) => (
                      <TableRow key={timesheet.id}>
                        <TableCell className="font-medium">
                          {timesheet.employeeName}
                          <div className="text-xs text-muted-foreground">{timesheet.email}</div>
                        </TableCell>
                        <TableCell>{timesheet.month}</TableCell>
                        <TableCell>{timesheet.submittedDate ? format(new Date(timesheet.submittedDate), "MMM d, yyyy") : "N/A"}</TableCell>
                        <TableCell>{timesheet.totalHours.toFixed(1)}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleReview(timesheet)}>
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPendingApprovals.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No pending timesheet approvals
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredHistoryApprovals.map((timesheet) => (
                      <TableRow key={timesheet.id}>
                        <TableCell className="font-medium">
                          {timesheet.employeeName}
                          <div className="text-xs text-muted-foreground">{timesheet.email}</div>
                        </TableCell>
                        <TableCell>{timesheet.month}</TableCell>
                        <TableCell>{timesheet.submittedDate ? format(new Date(timesheet.submittedDate), "MMM d, yyyy") : "N/A"}</TableCell>
                        <TableCell>{timesheet.reviewedDate ? format(new Date(timesheet.reviewedDate), "MMM d, yyyy") : "N/A"}</TableCell>
                        <TableCell>{timesheet.totalHours.toFixed(1)}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                            ${timesheet.status === "Approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {timesheet.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleReview(timesheet)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredHistoryApprovals.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No timesheet approval history
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedTimesheet} onOpenChange={(open) => !open && setSelectedTimesheet(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Timesheet</DialogTitle>
            <DialogDescription>
              {selectedTimesheet?.employeeName} - {selectedTimesheet?.month}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Employee</p>
                <p className="font-medium">{selectedTimesheet?.employeeName}</p>
                <p className="text-sm text-muted-foreground">{selectedTimesheet?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Month</p>
                <p className="font-medium">{selectedTimesheet?.month}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted Date</p>
                <p className="font-medium">
                  {selectedTimesheet?.submittedDate && format(new Date(selectedTimesheet.submittedDate), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="font-medium">{selectedTimesheet?.totalHours.toFixed(1)}</p>
              </div>
            </div>

            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm font-medium mb-2">Timesheet Summary</p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTimesheet?.entries?.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{entry.hours_worked}</TableCell>
                      <TableCell>{entry.hours_worked === 0 ? "Leave" : "Work"}</TableCell>
                      <TableCell>{entry.description || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">
                  Work Days: {selectedTimesheet?.entries?.filter(e => e.hours_worked > 0).length || 0}
                </p>
                <p className="text-sm font-medium">
                  Leave Days: {selectedTimesheet?.entries?.filter(e => e.hours_worked === 0).length || 0}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Comments</p>
              <Textarea
                placeholder="Add your review comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              {selectedTimesheet?.status === "Rejected" && selectedTimesheet?.comments && (
                <div className="text-sm text-red-500 italic mt-2">
                  Previous rejection reason: {selectedTimesheet.comments}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTimesheet(null)} disabled={isSubmitting}>
              Close
            </Button>
            {selectedTimesheet?.status !== "Approved" && selectedTimesheet?.status !== "Rejected" && (
              <>
                <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
                  <X className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Rejecting..." : "Reject"}
                </Button>
                <Button onClick={handleApprove} disabled={isSubmitting}>
                  <Check className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Approving..." : "Approve"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Approvals;
