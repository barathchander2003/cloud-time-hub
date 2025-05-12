
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const LeaveRequest = ({ onRequestSubmitted }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedDate) {
      toast({
        title: "Date required",
        description: "Please select a date for your leave request",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert timesheet entry with leave type
      const { error: timesheetError } = await supabase.from("timesheets")
        .insert({
          user_id: user?.id,
          date: format(selectedDate, "yyyy-MM-dd"),
          hours_worked: 0, // 0 hours for leave day
          description: data.reason,
          status: "Pending"
        });
      
      if (timesheetError) throw timesheetError;

      // Upload supporting document if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        // Save document reference
        const { error: docError } = await supabase.from("documents")
          .insert({
            user_id: user?.id,
            file_name: file.name,
            file_url: fileName
          });
          
        if (docError) throw docError;
      }
      
      toast({
        title: "Leave request submitted",
        description: "Your leave request has been submitted for approval"
      });
      
      reset();
      setFile(null);
      setIsOpen(false);
      if (onRequestSubmitted) onRequestSubmitted();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Request Leave</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>
            Submit your leave request for approval. Please provide all required information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Leave Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave</Label>
            <Textarea
              id="reason"
              placeholder="Please provide details about your leave request"
              {...register("reason", { required: "Reason is required" })}
              className="min-h-[100px]"
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document">Supporting Document (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="document"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Button type="button" size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload documents like medical certificates or approval forms (Max 5MB)
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequest;
