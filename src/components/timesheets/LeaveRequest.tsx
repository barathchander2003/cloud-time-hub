
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays } from "date-fns";
import { CalendarIcon, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const leaveTypesOptions = [
  "Annual Leave",
  "Sick Leave",
  "Personal Leave",
  "Bereavement Leave",
  "Maternity/Paternity Leave",
  "Study Leave",
  "Other",
];

const formSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  leaveType: z.string({
    required_error: "Please select a leave type",
  }),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  attachment: z.any().optional(),
});

type LeaveFormValues = z.infer<typeof formSchema>;

export function LeaveRequest() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      leaveType: "",
      reason: "",
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const onSubmit = async (data: LeaveFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a leave request",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      let attachmentPath = null;
      
      // Upload attachment if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `leaveRequests/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        attachmentPath = filePath;
      }
      
      // Insert leave request record
      const { error } = await supabase
        .from('leave_requests')
        .insert({
          user_id: user.id,
          start_date: data.startDate.toISOString(),
          end_date: data.endDate.toISOString(),
          leave_type: data.leaveType,
          reason: data.reason,
          attachment_path: attachmentPath,
          status: 'pending',
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your leave request has been submitted successfully",
      });
      
      // Reset form
      form.reset();
      setFile(null);
      
    } catch (error: any) {
      console.error("Error submitting leave request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave request",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit Leave Request</CardTitle>
        <CardDescription>
          Complete the form below to submit your leave request for approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Controller
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.startDate && (
                <p className="text-sm text-red-500">{String(form.formState.errors.startDate.message)}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Controller
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < form.getValues("startDate")}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.endDate && (
                <p className="text-sm text-red-500">{String(form.formState.errors.endDate.message)}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Controller
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypesOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.leaveType && (
              <p className="text-sm text-red-500">{String(form.formState.errors.leaveType.message)}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave</Label>
            <Textarea 
              id="reason"
              placeholder="Please provide details about your leave request"
              {...form.register("reason")}
              className="min-h-[100px]"
            />
            {form.formState.errors.reason && (
              <p className="text-sm text-red-500">{String(form.formState.errors.reason.message)}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attachment">Supporting Document (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                className="flex-1"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {file && (
                <div className="flex items-center gap-2 border rounded px-3 py-1 text-sm">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Accepted file formats: PDF, Word Documents, Images (JPG, PNG)
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Leave Request"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500 border-t pt-4">
        <p>All leave requests require approval</p>
        <p>Processing time: 1-3 business days</p>
      </CardFooter>
    </Card>
  );
}
