
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Check, Globe, Moon, PaintBucket, Sun, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  
  // User preferences state
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    notifications: true,
  });
  
  // Organization settings state
  const [orgSettings, setOrgSettings] = useState({
    name: "Market Cloud Ltd",
    address: "123 Main Street, London, UK",
    phone: "+44 123 456 7890",
    email: "info@marketcloud.com",
    website: "https://marketcloud.com",
    taxId: "GB123456789",
  });
  
  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    jobTitle: "Software Developer",
    department: "Engineering",
  });
  
  // Handle preference changes
  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };
  
  // Handle organization setting changes
  const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrgSettings({
      ...orgSettings,
      [e.target.name]: e.target.value,
    });
  };
  
  // Handle account setting changes
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSettings({
      ...accountSettings,
      [e.target.name]: e.target.value,
    });
  };
  
  // Save preferences
  const savePreferences = () => {
    // Apply theme
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(preferences.theme);
    
    // In a real app, save to user profile in database
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been updated successfully.",
      duration: 3000,
    });
    
    // Handle theme change
    if (preferences.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  // Save organization settings
  const saveOrgSettings = () => {
    // In a real app, save to database
    localStorage.setItem("orgSettings", JSON.stringify(orgSettings));
    
    toast({
      title: "Organization Settings Saved",
      description: "Organization settings have been updated successfully.",
      duration: 3000,
    });
  };
  
  // Save account settings
  const saveAccountSettings = () => {
    // In a real app, save to user profile in database
    localStorage.setItem("accountSettings", JSON.stringify(accountSettings));
    
    toast({
      title: "Account Settings Saved",
      description: "Your account settings have been updated successfully.",
      duration: 3000,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="mb-6 flex overflow-auto">
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <PaintBucket className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Organization</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your application experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => handlePreferenceChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={preferences.language}
                    onValueChange={(value) => handlePreferenceChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) => handlePreferenceChange("dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD-MMM-YYYY">DD-MMM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={preferences.timeFormat}
                    onValueChange={(value) => handlePreferenceChange("timeFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button onClick={savePreferences} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={accountSettings.firstName}
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={accountSettings.lastName}
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={accountSettings.email}
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={accountSettings.jobTitle}
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={accountSettings.department}
                    onChange={handleAccountChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button onClick={saveAccountSettings} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Save Account Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization information and branding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    name="name"
                    value={orgSettings.name}
                    onChange={handleOrgChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-address">Address</Label>
                  <Input
                    id="org-address"
                    name="address"
                    value={orgSettings.address}
                    onChange={handleOrgChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-phone">Phone</Label>
                  <Input
                    id="org-phone"
                    name="phone"
                    value={orgSettings.phone}
                    onChange={handleOrgChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Email</Label>
                  <Input
                    id="org-email"
                    name="email"
                    type="email"
                    value={orgSettings.email}
                    onChange={handleOrgChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-website">Website</Label>
                  <Input
                    id="org-website"
                    name="website"
                    value={orgSettings.website}
                    onChange={handleOrgChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-taxId">Tax ID / VAT Number</Label>
                  <Input
                    id="org-taxId"
                    name="taxId"
                    value={orgSettings.taxId}
                    onChange={handleOrgChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Select>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Switch Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market-cloud-uk">Market Cloud Ltd, UK</SelectItem>
                  <SelectItem value="market-cloud-india">Market Cloud Software, India</SelectItem>
                  <SelectItem value="market-cloud-germany">Market Cloud GmbH, Germany</SelectItem>
                  <SelectItem value="market-cloud-hungary">Market Cloud KFT, Hungary</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={saveOrgSettings} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Save Organization
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
