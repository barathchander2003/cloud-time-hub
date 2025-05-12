
import React from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, Filter, Search, X } from "lucide-react";

// Mock approval data
const pendingApprovals = [
  {
    id: "1",
    employeeName: "John Smith",
    month: "April 2023",
    submittedDate: "2023-05-01",
    totalHours: 168,
    status: "pending",
  },
  {
    id: "2",
    employeeName: "Sarah Johnson",
    month: "April 2023",
    submittedDate: "2023-04-30",
    totalHours: 160,
    status: "pending",
  },
  {
    id: "3",
    employeeName: "Michael Brown",
    month: "April 2023",
    submittedDate: "2023-05-02",
    totalHours: 120,
    status: "pending",
  },
];

const historyApprovals = [
  {
    id: "4",
    employeeName: "Emily Davis",
    month: "March 2023",
    submittedDate: "2023-04-01",
    reviewedDate: "2023-04-03",
    totalHours: 176,
    status: "approved",
  },
  {
    id: "5",
    employeeName: "Robert Wilson",
    month: "March 2023",
    submittedDate: "2023-03-31",
    reviewedDate: "2023-04-02",
    totalHours: 168,
    status: "approved",
  },
  {
    id: "6",
    employeeName: "Jennifer Lee",
    month: "March 2023",
    submittedDate: "2023-04-01",
    reviewedDate: "2023-04-04",
    totalHours: 152,
    status: "rejected",
    comments: "Hours don't match with project allocation. Please review and resubmit.",
  },
];

const Approvals = () => {
  const [selectedTimesheet, setSelectedTimesheet] = React.useState<any>(null);
  const [comment, setComment] = React.useState("");

  const handleReview = (timesheet: any) => {
    setSelectedTimesheet(timesheet);
    setComment("");
  };

  const handleApprove = () => {
    // In a real app, make API call to approve timesheet
    setSelectedTimesheet(null);
  };

  const handleReject = () => {
    // In a real app, make API call to reject timesheet
    setSelectedTimesheet(null);
  };

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
          <Button>
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
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending 
            <span className="ml-2 bg-primary/10 text-primary font-medium rounded-full px-2 py-0.5 text-xs">
              {pendingApprovals.length}
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
                {pendingApprovals.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell className="font-medium">{timesheet.employeeName}</TableCell>
                    <TableCell>{timesheet.month}</TableCell>
                    <TableCell>{format(new Date(timesheet.submittedDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{timesheet.totalHours}</TableCell>
                    <TableCell>
                      <span className="status-pending">Pending</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleReview(timesheet)}>
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingApprovals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No pending timesheet approvals
                    </TableCell>
                  </TableRow>
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
                {historyApprovals.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell className="font-medium">{timesheet.employeeName}</TableCell>
                    <TableCell>{timesheet.month}</TableCell>
                    <TableCell>{format(new Date(timesheet.submittedDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(timesheet.reviewedDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{timesheet.totalHours}</TableCell>
                    <TableCell>
                      <span className={
                        timesheet.status === "approved" ? "status-approved" : "status-rejected"
                      }>
                        {timesheet.status === "approved" ? "Approved" : "Rejected"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleReview(timesheet)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {historyApprovals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No timesheet approval history
                    </TableCell>
                  </TableRow>
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
                <p className="font-medium">{selectedTimesheet?.totalHours}</p>
              </div>
            </div>

            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm font-medium mb-2">Timesheet Summary</p>
              <p className="text-sm text-muted-foreground mb-2">
                Mock summary data would be displayed here in a real implementation.
              </p>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Work Days: 21</p>
                <p className="text-sm font-medium">Leave Days: 1</p>
                <p className="text-sm font-medium">Holiday/Weekend Days: 8</p>
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
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTimesheet(null)}>
              Cancel
            </Button>
            {selectedTimesheet?.status !== "approved" && selectedTimesheet?.status !== "rejected" && (
              <>
                <Button variant="destructive" onClick={handleReject}>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
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
