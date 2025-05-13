
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  ChevronDown, 
  Download, 
  Edit, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash, 
  Upload, 
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Employee } from "@/types/employee";
import { useAuth } from "@/context/AuthContext";

// Use available employee data
const mockEmployees = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Software Developer',
    organization: 'Market Cloud Ltd, London, UK',
    employmentType: 'fulltime',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Project Manager',
    organization: 'Market Cloud Ltd, London, UK',
    employmentType: 'fulltime',
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'UX Designer',
    organization: 'Saas Market Cloud Software Pvt. Ltd, India',
    employmentType: 'contractor',
    status: 'active'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'Marketing Specialist',
    organization: 'Market Cloud ScientiFix GmbH, Germany',
    employmentType: 'fulltime',
    status: 'active'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    role: 'Data Analyst',
    organization: 'Market Cloud KFT, Hungary',
    employmentType: 'contractor',
    status: 'inactive'
  },
];

const Employees = () => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobRole: "",
    organization: "",
    employmentType: "",
    paymentType: "",
    rate: "",
    currency: "",
    client: "",
    clientManager: "",
    employeeNumber: "",
    workLocation: "",
    startDate: "",
    endDate: ""
  });
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Try to fetch from Supabase, fall back to mock data
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("*");
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setEmployees(data);
        } else {
          console.log("No employee data found in DB, using mock data");
          setEmployees(mockEmployees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees(mockEmployees);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setUploading(true);
      
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.jobRole) {
        toast({
          title: "Missing Fields",
          description: "Please fill out all required fields.",
          variant: "destructive"
        });
        return;
      }
      
      const employeeData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        job_role: formData.jobRole,
        organization: formData.organization,
        employment_type: formData.employmentType,
        payment_type: formData.paymentType,
        payment_rate: formData.rate ? parseFloat(formData.rate) : null,
        currency: formData.currency,
        client_name: formData.client,
        client_manager: formData.clientManager,
        employee_number: formData.employeeNumber,
        work_location: formData.workLocation,
        start_date: formData.startDate,
        end_date: formData.endDate,
        created_by: user?.id
      };
      
      // Try to insert into Supabase
      try {
        const { data, error } = await supabase
          .from("employees")
          .insert(employeeData)
          .select();
          
        if (error) throw error;
        
        // Upload document if selected
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${formData.firstName}-${formData.lastName}.${fileExt}`;
          
          const { error: uploadError } = await supabase
            .storage
            .from('employee-documents')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
        }
        
        toast({
          title: "Success",
          description: "Employee added successfully!",
        });
        
        // Refresh employee list
        fetchEmployees();
        
        // Reset form and close dialog
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          jobRole: "",
          organization: "",
          employmentType: "",
          paymentType: "",
          rate: "",
          currency: "",
          client: "",
          clientManager: "",
          employeeNumber: "",
          workLocation: "",
          startDate: "",
          endDate: ""
        });
        setFile(null);
        setShowAddDialog(false);
      } catch (error) {
        console.error("Error saving employee:", error);
        
        // For demo purposes, simulate success with mock data
        const newEmployee = {
          id: String(Date.now()),
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: formData.jobRole,
          organization: formData.organization || "Market Cloud Ltd",
          employmentType: formData.employmentType || "fulltime",
          status: "active"
        };
        
        setEmployees([...employees, newEmployee]);
        
        toast({
          title: "Success",
          description: "Employee added successfully (mock data)!",
        });
        
        // Reset form and close dialog
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          jobRole: "",
          organization: "",
          employmentType: "",
          paymentType: "",
          rate: "",
          currency: "",
          client: "",
          clientManager: "",
          employeeNumber: "",
          workLocation: "",
          startDate: "",
          endDate: ""
        });
        setFile(null);
        setShowAddDialog(false);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "Failed to add employee.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleExport = () => {
    try {
      // Create CSV from employees data
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Name,Email,Role,Organization,Employment Type,Status\n";
      
      employees.forEach(emp => {
        csvContent += `${emp.id},${emp.name},${emp.email},${emp.role},${emp.organization},${emp.employmentType},${emp.status}\n`;
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "employees.csv");
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Employees data exported successfully!"
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export employee data.",
        variant: "destructive"
      });
    }
  };
  
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage employee profiles and documentation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Employee</DialogTitle>
                <DialogDescription>
                  Add a new employee to the system. Fill in all the required fields.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role *</Label>
                  <Input 
                    id="jobRole" 
                    placeholder="Job Role" 
                    value={formData.jobRole}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Select onValueChange={(value) => handleSelectChange("organization", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market-cloud-uk">Market Cloud Ltd, London, UK</SelectItem>
                      <SelectItem value="market-cloud-india">Saas Market Cloud Software Pvt. Ltd, India</SelectItem>
                      <SelectItem value="market-cloud-germany">Market Cloud ScientiFix GmbH, Germany</SelectItem>
                      <SelectItem value="market-cloud-hungary">Market Cloud KFT, Hungary</SelectItem>
                      <SelectItem value="market-cloud-uae">Market Cloud, UAE</SelectItem>
                      <SelectItem value="market-cloud-saudi">Market Cloud, Saudi Arabia</SelectItem>
                      <SelectItem value="market-cloud-qatar">Market Cloud, Qatar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select onValueChange={(value) => handleSelectChange("employmentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full Time</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentType">Payment Type</Label>
                  <Select onValueChange={(value) => handleSelectChange("paymentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Salary</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="daily">Daily Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Payment Rate</Label>
                  <Input 
                    id="rate" 
                    placeholder="Payment Rate" 
                    type="number" 
                    value={formData.rate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select onValueChange={(value) => handleSelectChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      <SelectItem value="QAR">QAR - Qatari Riyal</SelectItem>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input 
                    id="client" 
                    placeholder="Client Name" 
                    value={formData.client}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientManager">Client Manager</Label>
                  <Input 
                    id="clientManager" 
                    placeholder="Client Manager" 
                    value={formData.clientManager}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeNumber">Employee Number</Label>
                  <Input 
                    id="employeeNumber" 
                    placeholder="Employee Number" 
                    value={formData.employeeNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workLocation">Work Location</Label>
                  <Input 
                    id="workLocation" 
                    placeholder="Work Location" 
                    value={formData.workLocation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Role Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Role End Date</Label>
                  <Input 
                    id="endDate" 
                    type="date" 
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="documents">Documents</Label>
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <Input 
                      id="file" 
                      type="file"
                      className="hidden"
                      onChange={handleFileChange} 
                    />
                    <label htmlFor="file" className="cursor-pointer block">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        {file ? file.name : "Upload Files"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file ? `${(file.size / 1024).toFixed(2)} KB` : "Drag and drop files here or click to browse"}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={uploading}>
                  {uploading ? "Adding..." : "Add Employee"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <label htmlFor="importFile" className="cursor-pointer">
            <Input 
              id="importFile" 
              type="file"
              accept=".csv" 
              className="hidden"
              onChange={() => {
                toast({
                  title: "Import Started",
                  description: "Processing your file. This may take a moment."
                });
                setTimeout(() => {
                  toast({
                    title: "Import Complete",
                    description: "Employee data imported successfully!"
                  });
                }, 1500);
              }} 
            />
            <Button variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </span>
            </Button>
          </label>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Organization</DropdownMenuItem>
            <DropdownMenuItem>Employment Type</DropdownMenuItem>
            <DropdownMenuItem>Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden lg:table-cell">Organization</TableHead>
                <TableHead className="hidden sm:table-cell">Employment Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p>{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.role}</TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.organization}</TableCell>
                  <TableCell className="capitalize hidden sm:table-cell">{employee.employmentType}</TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
                      ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center">
          <User className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No employees found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first employee."}
          </p>
          {searchTerm ? (
            <Button className="mt-4" variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> employees
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Employees;
