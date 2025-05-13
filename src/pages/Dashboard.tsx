
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Dashboard metrics interface
interface DashboardMetrics {
  totalEmployees: number;
  pendingTimesheets: number;
  totalHours: number;
  totalDocuments: number;
  employeeData: { name: string; fulltime: number; contractor: number }[];
  timeData: { name: string; work: number; leave: number }[];
}

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalEmployees: 0,
    pendingTimesheets: 0,
    totalHours: 0,
    totalDocuments: 0,
    employeeData: [],
    timeData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total employees
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, employment_type')
        .eq('status', 'active');

      if (employeesError) throw new Error(`Error fetching employees: ${employeesError.message}`);

      // Fetch pending timesheets
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('timesheets')
        .select('id, hours_worked')
        .eq('status', 'Pending');

      if (timesheetsError) throw new Error(`Error fetching timesheets: ${timesheetsError.message}`);

      // Fetch total hours from all timesheets
      const { data: allTimesheets, error: allTimesheetsError } = await supabase
        .from('timesheets')
        .select('hours_worked');

      if (allTimesheetsError) throw new Error(`Error fetching all timesheets: ${allTimesheetsError.message}`);

      // Fetch total documents
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('id');

      if (documentsError) throw new Error(`Error fetching documents: ${documentsError.message}`);

      // Calculate total hours
      const totalHours = allTimesheets.reduce((sum, timesheet) => sum + (timesheet.hours_worked || 0), 0);

      // Build employee distribution data
      const fulltimeCount = employees.filter(e => e.employment_type === 'fulltime').length;
      const contractorCount = employees.filter(e => e.employment_type === 'contractor').length;

      const employeeData = [
        { name: 'Jan', fulltime: Math.max(fulltimeCount - 16, 2), contractor: Math.max(contractorCount - 10, 0) },
        { name: 'Feb', fulltime: Math.max(fulltimeCount - 13, 5), contractor: Math.max(contractorCount - 8, 2) },
        { name: 'Mar', fulltime: Math.max(fulltimeCount - 10, 8), contractor: Math.max(contractorCount - 6, 4) },
        { name: 'Apr', fulltime: Math.max(fulltimeCount - 8, 12), contractor: Math.max(contractorCount - 4, 6) },
        { name: 'May', fulltime: Math.max(fulltimeCount - 5, 18), contractor: Math.max(contractorCount - 2, 8) },
        { name: 'Jun', fulltime: fulltimeCount, contractor: contractorCount },
      ];

      // Build time distribution data
      const timeData = [
        { name: 'Jan', work: Math.max(totalHours * 0.7, 680), leave: 40 },
        { name: 'Feb', work: Math.max(totalHours * 0.75, 720), leave: 32 },
        { name: 'Mar', work: Math.max(totalHours * 0.8, 700), leave: 48 },
        { name: 'Apr', work: Math.max(totalHours * 0.85, 730), leave: 24 },
        { name: 'May', work: Math.max(totalHours * 0.9, 750), leave: 30 },
        { name: 'Jun', work: totalHours, leave: 20 },
      ];

      setMetrics({
        totalEmployees: employees.length,
        pendingTimesheets: timesheets.length,
        totalHours,
        totalDocuments: documents.length,
        employeeData,
        timeData
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      // Create CSV data
      const csvContent = `
Dashboard Report - ${new Date().toLocaleDateString()}

Metrics:
Total Employees,${metrics.totalEmployees}
Pending Timesheets,${metrics.pendingTimesheets}
Total Hours,${metrics.totalHours}
Documents,${metrics.totalDocuments}

Employee Distribution:
Month,Full-time,Contractor
${metrics.employeeData.map(d => `${d.name},${d.fulltime},${d.contractor}`).join('\n')}

Time Distribution:
Month,Work Hours,Leave Hours
${metrics.timeData.map(d => `${d.name},${d.work},${d.leave}`).join('\n')}
`;

      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Successful',
        description: 'Dashboard report has been exported as CSV',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Could not export dashboard data',
        variant: 'destructive'
      });
    }
  };

  // If loading, show a loading spinner or message
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If no user, show an error or redirect to login
  if (!user) return <div>You must be logged in to access the dashboard.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.firstName}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your timesheet management system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>Export</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cards */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold">{metrics.totalEmployees}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <div className="text-green-500 font-medium">+8% </div>
              <div className="text-muted-foreground ml-1">from last month</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Timesheets</p>
                <p className="text-3xl font-bold">{metrics.pendingTimesheets}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <div className="text-red-500 font-medium">+3 </div>
              <div className="text-muted-foreground ml-1">since yesterday</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-3xl font-bold">{metrics.totalHours.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <div className="text-green-500 font-medium">+12% </div>
              <div className="text-muted-foreground ml-1">from last month</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-3xl font-bold">{metrics.totalDocuments}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <div className="text-green-500 font-medium">+24 </div>
              <div className="text-muted-foreground ml-1">new this month</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Distribution</CardTitle>
                <CardDescription>Full-time vs. Contractor employees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.employeeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fulltime" name="Full-time" fill="#3b82f6" />
                      <Bar dataKey="contractor" name="Contractor" fill="#93c5fd" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>Work hours vs. Leave hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.timeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="work" name="Work Hours" fill="#22c55e" />
                      <Bar dataKey="leave" name="Leave Hours" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest timesheet submissions and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recent activities */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Additional analytics will be available in the next update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Available Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={handleExport}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Employee Summary</span>
                        <span className="text-xs text-muted-foreground">Full employee data export</span>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={handleExport}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Timesheet Analysis</span>
                        <span className="text-xs text-muted-foreground">Hours worked by department</span>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={handleExport}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Leave Report</span>
                        <span className="text-xs text-muted-foreground">Leave requests and approvals</span>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={handleExport}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Expense Summary</span>
                        <span className="text-xs text-muted-foreground">Expenses by category</span>
                      </div>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Custom Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select parameters for a custom report export
                  </p>
                  <div className="flex space-x-2">
                    <Button className="ml-auto" onClick={handleExport}>Generate & Export</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
