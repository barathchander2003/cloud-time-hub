
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { CurrencyCode, EmploymentType, PaymentType } from "@/types/employee";

interface EmployeeFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

const organizations = [
  { value: "market-cloud-uk", label: "Market Cloud Ltd, London, UK" },
  { value: "market-cloud-india", label: "Saas Market Cloud Software Pvt. Ltd, India" },
  { value: "market-cloud-germany", label: "Market Cloud ScientiFix GmbH, Germany" },
  { value: "market-cloud-hungary", label: "Market Cloud KFT, Hungary" },
  { value: "market-cloud-uae", label: "Market Cloud, UAE" },
  { value: "market-cloud-saudi", label: "Market Cloud, Saudi Arabia" },
  { value: "market-cloud-qatar", label: "Market Cloud, Qatar" },
];

const currencies: Array<{ value: CurrencyCode; label: string }> = [
  { value: "GBP", label: "GBP - British Pound" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "SAR", label: "SAR - Saudi Riyal" },
  { value: "QAR", label: "QAR - Qatari Riyal" },
  { value: "AED", label: "AED - UAE Dirham" },
];

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = React.useState(initialData || {});
  const [activeTab, setActiveTab] = React.useState("personal");
  const [employmentType, setEmploymentType] = React.useState<EmploymentType>(initialData?.employmentType || "fulltime");
  const [paymentType, setPaymentType] = React.useState<PaymentType>(initialData?.paymentType || "fixed");
  
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };
  
  const handleEmploymentTypeChange = (value: EmploymentType) => {
    setEmploymentType(value);
    handleChange('employmentType', value);
  };
  
  const handlePaymentTypeChange = (value: PaymentType) => {
    setPaymentType(value);
    handleChange('paymentType', value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName || ''} 
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName || ''} 
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email || ''} 
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input 
                  id="mobile" 
                  value={formData.mobile || ''} 
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="homePhone">Home Number</Label>
                <Input 
                  id="homePhone" 
                  value={formData.homePhone || ''} 
                  onChange={(e) => handleChange('homePhone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="dateOfBirth" 
                    type="date" 
                    value={formData.dateOfBirth || ''} 
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Postal Address</Label>
                <Textarea 
                  id="address" 
                  value={formData.address || ''} 
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Name</Label>
                      <Input 
                        id="emergencyName" 
                        value={formData.emergencyContact?.name || ''} 
                        onChange={(e) => handleChange('emergencyContact', { 
                          ...formData.emergencyContact, 
                          name: e.target.value 
                        })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Contact Number</Label>
                      <Input 
                        id="emergencyContact" 
                        value={formData.emergencyContact?.contact || ''} 
                        onChange={(e) => handleChange('emergencyContact', { 
                          ...formData.emergencyContact, 
                          contact: e.target.value 
                        })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Input 
                        id="emergencyRelationship" 
                        value={formData.emergencyContact?.relationship || ''} 
                        onChange={(e) => handleChange('emergencyContact', { 
                          ...formData.emergencyContact, 
                          relationship: e.target.value 
                        })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Employment Details */}
          <TabsContent value="employment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobRole">Job Role</Label>
                <Input 
                  id="jobRole" 
                  value={formData.jobRole || ''} 
                  onChange={(e) => handleChange('jobRole', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Select 
                  value={formData.organizationId || ''} 
                  onValueChange={(value) => handleChange('organizationId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.value} value={org.value}>{org.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">Employee Number</Label>
                <Input 
                  id="employeeNumber" 
                  value={formData.employeeNumber || ''} 
                  onChange={(e) => handleChange('employeeNumber', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workLocation">Work Location</Label>
                <Input 
                  id="workLocation" 
                  value={formData.workLocation || ''} 
                  onChange={(e) => handleChange('workLocation', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Role Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={formData.startDate || ''} 
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Role End Date (for contractors)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="endDate" 
                    type="date" 
                    value={formData.endDate || ''} 
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="pl-10"
                    disabled={employmentType !== 'contractor'}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select value={employmentType} onValueChange={handleEmploymentTypeChange}>
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
                <Label htmlFor="pcStatus">PC Status</Label>
                <Select 
                  value={formData.pcStatus || ''} 
                  onValueChange={(value) => handleChange('pcStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select PC status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="market-cloud">Market Cloud</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientName">Client</Label>
                <Input 
                  id="clientName" 
                  value={formData.clientName || ''} 
                  onChange={(e) => handleChange('clientName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientManager">Client Manager</Label>
                <Input 
                  id="clientManager" 
                  value={formData.clientManager || ''} 
                  onChange={(e) => handleChange('clientManager', e.target.value)}
                />
              </div>
            </div>
            
            {employmentType === 'contractor' && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contractor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agencyName">Agency or Ltd Company Name</Label>
                        <Input 
                          id="agencyName" 
                          value={formData.agencyName || ''} 
                          onChange={(e) => handleChange('agencyName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxReferenceNumber">Unique Tax Reference Number</Label>
                        <Input 
                          id="taxReferenceNumber" 
                          value={formData.taxReferenceNumber || ''} 
                          onChange={(e) => handleChange('taxReferenceNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="agencyAddress">Agency/Ltd Company Registered Address</Label>
                        <Textarea 
                          id="agencyAddress" 
                          value={formData.agencyAddress || ''} 
                          onChange={(e) => handleChange('agencyAddress', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyNumber">Company Number</Label>
                        <Input 
                          id="companyNumber" 
                          value={formData.companyNumber || ''} 
                          onChange={(e) => handleChange('companyNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vatNumber">VAT Registration Number</Label>
                        <Input 
                          id="vatNumber" 
                          value={formData.vatNumber || ''} 
                          onChange={(e) => handleChange('vatNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="insuranceDetails">Professional Indemnity Insurance</Label>
                        <Input 
                          id="insuranceDetails" 
                          value={formData.insuranceDetails || ''} 
                          onChange={(e) => handleChange('insuranceDetails', e.target.value)}
                          placeholder="Minimum £1m claim"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Financial Details */}
          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select value={paymentType} onValueChange={handlePaymentTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed" disabled={employmentType === 'contractor'}>Fixed Salary</SelectItem>
                    <SelectItem value="hourly" disabled={employmentType === 'fulltime'}>Hourly Rate</SelectItem>
                    <SelectItem value="daily" disabled={employmentType === 'fulltime'}>Daily Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentRate">
                  {paymentType === 'fixed' ? 'Fixed Gross Salary Per Month' : 
                   paymentType === 'hourly' ? 'Hourly Rate' : 'Daily Rate'}
                </Label>
                <Input 
                  id="paymentRate" 
                  type="number"
                  value={formData.paymentRate || ''} 
                  onChange={(e) => handleChange('paymentRate', parseFloat(e.target.value))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency || ''} 
                  onValueChange={(value) => handleChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Banking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountName">Account Holder Name</Label>
                      <Input 
                        id="bankAccountName" 
                        value={formData.bankDetails?.accountHolderName || ''} 
                        onChange={(e) => handleChange('bankDetails', { 
                          ...formData.bankDetails, 
                          accountHolderName: e.target.value 
                        })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input 
                        id="bankName" 
                        value={formData.bankDetails?.bankName || ''} 
                        onChange={(e) => handleChange('bankDetails', { 
                          ...formData.bankDetails, 
                          bankName: e.target.value 
                        })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountNumber">Account Number</Label>
                      <Input 
                        id="bankAccountNumber" 
                        value={formData.bankDetails?.accountNumber || ''} 
                        onChange={(e) => handleChange('bankDetails', { 
                          ...formData.bankDetails, 
                          accountNumber: e.target.value 
                        })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankSortCode">Sort Code (For UK)</Label>
                      <Input 
                        id="bankSortCode" 
                        value={formData.bankDetails?.sortCode || ''} 
                        onChange={(e) => handleChange('bankDetails', { 
                          ...formData.bankDetails, 
                          sortCode: e.target.value 
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankIfscCode">IFSC Code (For India)</Label>
                      <Input 
                        id="bankIfscCode" 
                        value={formData.bankDetails?.ifscCode || ''} 
                        onChange={(e) => handleChange('bankDetails', { 
                          ...formData.bankDetails, 
                          ifscCode: e.target.value 
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankIbanCode">IBAN Code (For Europe)</Label>
                      <Input 
                        id="bankIbanCode" 
                        value={formData.bankDetails?.ibanCode || ''} 
                        onChange={(e) => handleChange('bankDetails', { 
                          ...formData.bankDetails, 
                          ibanCode: e.target.value 
                        })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bankSwiftCode">SWIFT Code (For International)</Label>
                      <Input 
                        id="bankSwiftCode" 
                        value={formData.bankDetails?.swiftCode || ''} 
                        onChange={(e) => handleChange('bankDetails', { 
                          ...formData.bankDetails, 
                          swiftCode: e.target.value 
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {employmentType === 'contractor' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Agency Company Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agencyBankAccountName">Account Holder Name</Label>
                        <Input 
                          id="agencyBankAccountName" 
                          value={formData.agencyBankDetails?.accountHolderName || ''} 
                          onChange={(e) => handleChange('agencyBankDetails', { 
                            ...formData.agencyBankDetails, 
                            accountHolderName: e.target.value 
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agencyBankName">Bank Name</Label>
                        <Input 
                          id="agencyBankName" 
                          value={formData.agencyBankDetails?.bankName || ''} 
                          onChange={(e) => handleChange('agencyBankDetails', { 
                            ...formData.agencyBankDetails, 
                            bankName: e.target.value 
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agencyBankAccountNumber">Account Number</Label>
                        <Input 
                          id="agencyBankAccountNumber" 
                          value={formData.agencyBankDetails?.accountNumber || ''} 
                          onChange={(e) => handleChange('agencyBankDetails', { 
                            ...formData.agencyBankDetails, 
                            accountNumber: e.target.value 
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agencyBankSortCode">Sort Code (For UK)</Label>
                        <Input 
                          id="agencyBankSortCode" 
                          value={formData.agencyBankDetails?.sortCode || ''} 
                          onChange={(e) => handleChange('agencyBankDetails', { 
                            ...formData.agencyBankDetails, 
                            sortCode: e.target.value 
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agencyBankIfscCode">IFSC Code (For India)</Label>
                        <Input 
                          id="agencyBankIfscCode" 
                          value={formData.agencyBankDetails?.ifscCode || ''} 
                          onChange={(e) => handleChange('agencyBankDetails', { 
                            ...formData.agencyBankDetails, 
                            ifscCode: e.target.value 
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agencyBankIbanCode">IBAN Code (For Europe)</Label>
                        <Input 
                          id="agencyBankIbanCode" 
                          value={formData.agencyBankDetails?.ibanCode || ''} 
                          onChange={(e) => handleChange('agencyBankDetails', { 
                            ...formData.agencyBankDetails, 
                            ibanCode: e.target.value 
                          })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="agencyBankSwiftCode">SWIFT Code (For International)</Label>
                        <Input 
                          id="agencyBankSwiftCode" 
                          value={formData.agencyBankDetails?.swiftCode || ''} 
                          onChange={(e) => handleChange('agencyBankDetails', { 
                            ...formData.agencyBankDetails, 
                            swiftCode: e.target.value 
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Documents */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Identification Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input 
                        id="nationality" 
                        value={formData.nationality || ''} 
                        onChange={(e) => handleChange('nationality', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workAuthorizationDetails">Work Authorization Details</Label>
                      <Input 
                        id="workAuthorizationDetails" 
                        value={formData.workAuthorizationDetails || ''} 
                        onChange={(e) => handleChange('workAuthorizationDetails', e.target.value)}
                        placeholder="If not citizen of work country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <Input 
                        id="passportNumber" 
                        value={formData.passportNumber || ''} 
                        onChange={(e) => handleChange('passportNumber', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportExpiry">Passport Expiry Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="passportExpiry" 
                          type="date" 
                          value={formData.passportExpiry || ''} 
                          onChange={(e) => handleChange('passportExpiry', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niNumber">NI Number (For UK only)</Label>
                      <Input 
                        id="niNumber" 
                        value={formData.niNumber || ''} 
                        onChange={(e) => handleChange('niNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadharNumber">Aadhar Card Number (For India only)</Label>
                      <Input 
                        id="aadharNumber" 
                        value={formData.aadharNumber || ''} 
                        onChange={(e) => handleChange('aadharNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Card Number (For India only)</Label>
                      <Input 
                        id="panNumber" 
                        value={formData.panNumber || ''} 
                        onChange={(e) => handleChange('panNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Document Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload required documents in PDF or image format
                  </p>
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <input type="file" className="hidden" id="file-upload" multiple />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs text-muted-foreground">
                            or drag and drop files
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Required documents: Passport, Identity documents, Degree certificate, Previous contract/offer letter, Bank details proof
                  </p>
                  
                  {/* Document list would be dynamically rendered here in a real app */}
                  <div className="border rounded-md divide-y">
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span className="text-sm">passport.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 h-8 w-8 p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* References */}
          <TabsContent value="references" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Previous Employer Reference 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ref1Name">Name</Label>
                      <Input 
                        id="ref1Name" 
                        value={formData.references?.[0]?.name || ''} 
                        onChange={(e) => {
                          const updatedRefs = [...(formData.references || [])];
                          updatedRefs[0] = { ...updatedRefs[0], name: e.target.value };
                          handleChange('references', updatedRefs);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ref1Email">Email</Label>
                      <Input 
                        id="ref1Email" 
                        type="email"
                        value={formData.references?.[0]?.email || ''} 
                        onChange={(e) => {
                          const updatedRefs = [...(formData.references || [])];
                          updatedRefs[0] = { ...updatedRefs[0], email: e.target.value };
                          handleChange('references', updatedRefs);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ref1Phone">Phone</Label>
                      <Input 
                        id="ref1Phone" 
                        value={formData.references?.[0]?.phone || ''} 
                        onChange={(e) => {
                          const updatedRefs = [...(formData.references || [])];
                          updatedRefs[0] = { ...updatedRefs[0], phone: e.target.value };
                          handleChange('references', updatedRefs);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Previous Employer Reference 2</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ref2Name">Name</Label>
                      <Input 
                        id="ref2Name" 
                        value={formData.references?.[1]?.name || ''} 
                        onChange={(e) => {
                          const updatedRefs = [...(formData.references || [])];
                          updatedRefs[1] = { ...updatedRefs[1], name: e.target.value };
                          handleChange('references', updatedRefs);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ref2Email">Email</Label>
                      <Input 
                        id="ref2Email" 
                        type="email"
                        value={formData.references?.[1]?.email || ''} 
                        onChange={(e) => {
                          const updatedRefs = [...(formData.references || [])];
                          updatedRefs[1] = { ...updatedRefs[1], email: e.target.value };
                          handleChange('references', updatedRefs);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ref2Phone">Phone</Label>
                      <Input 
                        id="ref2Phone" 
                        value={formData.references?.[1]?.phone || ''} 
                        onChange={(e) => {
                          const updatedRefs = [...(formData.references || [])];
                          updatedRefs[1] = { ...updatedRefs[1], phone: e.target.value };
                          handleChange('references', updatedRefs);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          Save Employee
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
