
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, BarChart as ChartIcon, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const monthlyData = [
  { name: 'Jan', hours: 168, invoiced: 10500 },
  { name: 'Feb', hours: 160, invoiced: 10000 },
  { name: 'Mar', hours: 176, invoiced: 11000 },
  { name: 'Apr', hours: 168, invoiced: 10500 },
  { name: 'May', hours: 176, invoiced: 11000 },
  { name: 'Jun', hours: 168, invoiced: 10500 },
];

const employeeData = [
  { name: 'John Smith', hours: 168, invoiced: 10500 },
  { name: 'Sarah Johnson', hours: 160, invoiced: 10000 },
  { name: 'Michael Brown', hours: 150, invoiced: 9375 },
  { name: 'Emily Davis', hours: 176, invoiced: 11000 },
  { name: 'Robert Wilson', hours: 140, invoiced: 8750 },
];

const leaveData = [
  { name: 'Vacation', value: 14 },
  { name: 'Sick', value: 5 },
  { name: 'Personal', value: 3 },
  { name: 'Unpaid', value: 1 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  const [reportType, setReportType] = useState("employee");
  const [dateRange, setDateRange] = useState("last6months");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and analyze timesheet reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Report Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee Hours</SelectItem>
                <SelectItem value="monthly">Monthly Summary</SelectItem>
                <SelectItem value="leave">Leave Analysis</SelectItem>
                <SelectItem value="invoice">Invoice Generation</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last3months">Last 3 Months</SelectItem>
                <SelectItem value="last6months">Last 6 Months</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-x-2">
            <Button variant="outline" size="sm">
              <ChartIcon className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Hours by Employee</CardTitle>
                <CardDescription>Total hours logged per employee</CardDescription>
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
                      <Bar dataKey="hours" name="Hours" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Hours</CardTitle>
                <CardDescription>Hours logged per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" name="Hours" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Leave Distribution</CardTitle>
                <CardDescription>Types of leave taken</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={leaveData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {leaveData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Amount Invoiced</CardTitle>
                <CardDescription>Total amount invoiced per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="invoiced" name="Amount ($)" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Data</CardTitle>
              <CardDescription>View and export report data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium">Employee</th>
                      <th className="p-2 text-left font-medium">Month</th>
                      <th className="p-2 text-left font-medium">Hours</th>
                      <th className="p-2 text-left font-medium">Invoiced</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">John Smith</td>
                      <td className="p-2">Jan 2023</td>
                      <td className="p-2">168</td>
                      <td className="p-2">$10,500</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">John Smith</td>
                      <td className="p-2">Feb 2023</td>
                      <td className="p-2">160</td>
                      <td className="p-2">$10,000</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">Sarah Johnson</td>
                      <td className="p-2">Jan 2023</td>
                      <td className="p-2">176</td>
                      <td className="p-2">$11,000</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">Sarah Johnson</td>
                      <td className="p-2">Feb 2023</td>
                      <td className="p-2">160</td>
                      <td className="p-2">$10,000</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">Michael Brown</td>
                      <td className="p-2">Jan 2023</td>
                      <td className="p-2">150</td>
                      <td className="p-2">$9,375</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Configure report parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeFilter">Filter by Employee</Label>
                    <Select>
                      <SelectTrigger id="employeeFilter">
                        <SelectValue placeholder="All Employees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="michael">Michael Brown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organizationFilter">Filter by Organization</Label>
                    <Select>
                      <SelectTrigger id="organizationFilter">
                        <SelectValue placeholder="All Organizations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Organizations</SelectItem>
                        <SelectItem value="uk">Market Cloud Ltd, London, UK</SelectItem>
                        <SelectItem value="india">Saas Market Cloud Software Pvt. Ltd, India</SelectItem>
                        <SelectItem value="germany">Market Cloud ScientiFix GmbH, Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currencyFilter">Currency</Label>
                    <Select>
                      <SelectTrigger id="currencyFilter">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="gbp">GBP</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="inr">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reportFormat">Report Format</Label>
                    <Select>
                      <SelectTrigger id="reportFormat">
                        <SelectValue placeholder="Select Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Apply Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
