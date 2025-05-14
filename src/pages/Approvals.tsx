import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Clock, File, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ApprovalData } from "@/types/database";
import { downloadFile } from "@/services/storage-service";
import { useSupabaseQuery, updateSupabaseRecord } from "@/hooks/use-supabase";

// Sample data as fallback
const mockRequests: ApprovalData[] = [
  {
    id: "1",
    type: "leave",
    employee: "Sarah Johnson",
    employeeId: "2",
    submitted: "2025-05-10T10:30:00Z",
    startDate: "2025-05-20",
    endDate: "2025-05-25",
    status: "pending",
    notes: "Annual leave",
    document: null,
  },
  {
    id: "2",
    type: "expenses",
    employee: "Michael Brown",
    employeeId: "3",
    submitted: "2025-05-09T14:15:00Z",
    amount: 245.50,
    status: "approved",
    approvedBy: "Jane Doe",
    notes: "Client meeting expenses",
    document: "receipt.pdf",
  },
  {
    id: "3",
    type: "timesheet",
    employee: "Emily Davis",
    employeeId: "4",
    submitted: "2025-05-08T17:45:00Z",
    period: "April 2025",
    status: "pending",
    notes: "Overtime hours",
    document: null,
  },
  {
    id: "4",
    type: "leave",
    employee: "Robert Wilson",
    employeeId: "5",
    submitted: "2025-05-07T09:00:00Z",
    startDate: "2025-06-10",
    endDate: "2025-06-17",
    status: "rejected",
    notes: "Personal leave",
    rejectedReason: "Staff shortage during that period",
    document: "medical.pdf",
  },
  {
    id: "5",
    type: "expenses",
    employee: "John Smith",
    employeeId: "1",
    submitted: "2025-05-06T11:20:00Z",
    amount: 189.75,
    status: "pending",
    notes: "Training materials",
    document: "invoice.pdf",
  },
];

const Approvals = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalData | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false);
  
  const { data: requests, loading, error, refetch } = useSupabaseQuery('approvals', {
    orderBy: { column: 'submitted_at', ascending: false }
  });
  
  const handleApprove = async (id: string) => {
    try {
      const result = await updateSupabaseRecord('approvals', id, { 
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewer_id: user?.id
      });
      
      if (result.success) {
        toast({
          title: "Request Approved",
          description: "The request has been approved successfully.",
        });
        refetch();
      }
    } catch (error: any) {
      console.error("Error approving request:", error);
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      const result = await updateSupabaseRecord('approvals', id, { 
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewer_id: user?.id
      });
      
      if (result.success) {
        toast({
          title: "Request Rejected",
          description: "The request has been rejected.",
        });
        refetch();
      }
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const viewDetails = (request: ApprovalData) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };
  
  const handleDownloadDocument = async (documentUrl: string | null | undefined) => {
    if (!documentUrl) {
      toast({
        title: "Error",
        description: "No document available to download",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Extract the bucket name and file path from the URL
      const url = new URL(documentUrl);
      const pathParts = url.pathname.split('/');
      const bucketName = pathParts[1]; // Assumes format: /storage/v1/object/public/[bucket-name]/[file-path]
      const filePath = pathParts.slice(2).join('/');
      
      await downloadFile(bucketName, filePath);
      
      toast({
        title: "Download Started",
        description: "Your document download has started.",
      });
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download Failed",
        description: error.message || "Could not download document",
        variant: "destructive",
      });
    }
  };
  
  const filteredRequests = requests?.filter(req => {
    const matchesFilter = filter === "all" || req.status === filter;
    const matchesSearch = 
      req.employee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.notes && req.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  }) || [];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approval Requests</h1>
        <p className="text-muted-foreground">
          Review and manage approval requests from employees.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search requests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                <TableHead className="hidden md:table-cell">Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="capitalize">{request.type}</TableCell>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(request.submitted)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {request.type === "leave" ? (
                      <>
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </>
                    ) : request.type === "expenses" ? (
                      <>${request.amount?.toFixed(2)}</>
                    ) : (
                      <>{request.period || "N/A"}</>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {request.document && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownloadDocument(request.document)}
                        >
                          <File className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {request.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-3 py-0"
                        onClick={() => viewDetails(request)}
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No approval requests found</h3>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your filters or search terms." 
                : "There are no pending approval requests that require your attention."}
            </p>
            {(searchTerm || filter !== "all") && (
              <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(""); setFilter("all");}}>
                Reset Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              {selectedRequest?.type.charAt(0).toUpperCase() + selectedRequest?.type.slice(1)} request from {selectedRequest?.employee}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Status:</p>
              <div className="col-span-2">
                {selectedRequest && getStatusBadge(selectedRequest.status)}
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Submitted:</p>
              <p className="col-span-2">{selectedRequest && formatDate(selectedRequest.submitted)}</p>
            </div>
            
            {selectedRequest?.type === "leave" && (
              <>
                <div className="grid grid-cols-3 items-center gap-4">
                  <p className="text-sm font-medium">Period:</p>
                  <p className="col-span-2">
                    {formatDate(selectedRequest?.startDate)} to {formatDate(selectedRequest?.endDate)}
                  </p>
                </div>
              </>
            )}
            
            {selectedRequest?.type === "expenses" && (
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium">Amount:</p>
                <p className="col-span-2">${selectedRequest?.amount?.toFixed(2)}</p>
              </div>
            )}
            
            {selectedRequest?.type === "timesheet" && (
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium">Period:</p>
                <p className="col-span-2">{selectedRequest?.period || "N/A"}</p>
              </div>
            )}
            
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Notes:</p>
              <p className="col-span-2">{selectedRequest?.notes || "No notes provided"}</p>
            </div>
            
            {selectedRequest?.document && (
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium">Document:</p>
                <div className="col-span-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadDocument(selectedRequest.document)}
                  >
                    <File className="mr-2 h-4 w-4" />
                    View Document
                  </Button>
                </div>
              </div>
            )}
            
            {selectedRequest?.status === "rejected" && selectedRequest?.rejectedReason && (
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium">Reason for Rejection:</p>
                <p className="col-span-2">{selectedRequest.rejectedReason}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            {selectedRequest?.status === "pending" && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="text-red-600" 
                  onClick={() => {
                    if (selectedRequest) {
                      handleReject(selectedRequest.id);
                      setShowDetailsDialog(false);
                    }
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  onClick={() => {
                    if (selectedRequest) {
                      handleApprove(selectedRequest.id);
                      setShowDetailsDialog(false);
                    }
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            )}
            <Button 
              variant="ghost" 
              onClick={() => setShowDetailsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Approvals;
