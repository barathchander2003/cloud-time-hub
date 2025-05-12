
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, UserPlus, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for charts
const employeeData = [
  { name: 'Jan', fulltime: 42, contractor: 12 },
  { name: 'Feb', fulltime: 45, contractor: 14 },
  { name: 'Mar', fulltime: 48, contractor: 16 },
  { name: 'Apr', fulltime: 50, contractor: 18 },
  { name: 'May', fulltime: 53, contractor: 20 },
  { name: 'Jun', fulltime: 58, contractor: 22 },
];

const timeData = [
  { name: 'Jan', work: 680, leave: 40 },
  { name: 'Feb', work: 720, leave: 32 },
  { name: 'Mar', work: 700, leave: 48 },
  { name: 'Apr', work: 730, leave: 24 },
  { name: 'May', work: 750, leave: 30 },
  { name: 'Jun', work: 760, leave: 20 },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your timesheet management system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold">75</p>
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
                <p className="text-3xl font-bold">12</p>
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
                <p className="text-3xl font-bold">4,328</p>
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
                <p className="text-3xl font-bold">256</p>
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
                    <BarChart data={employeeData}>
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
                    <BarChart data={timeData}>
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
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">Submitted timesheet for June 2023</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Timesheet approved by Manager</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Michael Brown</p>
                      <p className="text-sm text-muted-foreground">Added new document: "Contract Renewal"</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Emily Davis</p>
                      <p className="text-sm text-muted-foreground">Updated employee profile</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
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
              <div className="flex items-center justify-center h-40 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Report generation will be available in the next update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
