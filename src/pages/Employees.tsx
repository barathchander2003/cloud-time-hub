
import React from "react";
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

// Mock employee data
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
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage employee profiles and documentation
          </p>
        </div>
        <div className="flex items-center gap-2">
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
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Last Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role</Label>
                  <Input id="jobRole" placeholder="Job Role" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Select>
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
                  <Select>
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
                  <Select>
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
                  <Input id="rate" placeholder="Payment Rate" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select>
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
                  <Input id="client" placeholder="Client Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientManager">Client Manager</Label>
                  <Input id="clientManager" placeholder="Client Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeNumber">Employee Number</Label>
                  <Input id="employeeNumber" placeholder="Employee Number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workLocation">Work Location</Label>
                  <Input id="workLocation" placeholder="Work Location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Role Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Role End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
                
                {/* Would continue with more fields based on the provided checklist */}
                
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="documents">Documents</Label>
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Upload Files</p>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop files here or click to browse
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddDialog(false)}>
                  Add Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
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
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Employment Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEmployees.map((employee) => (
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
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.organization}</TableCell>
                <TableCell className="capitalize">{employee.employmentType}</TableCell>
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>5</strong> of <strong>5</strong> employees
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
