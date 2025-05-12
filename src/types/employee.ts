
export type EmploymentType = "fulltime" | "contractor";
export type PaymentType = "hourly" | "daily" | "fixed";
export type CurrencyCode = "USD" | "GBP" | "EUR" | "INR" | "SAR" | "QAR" | "AED";

export interface Organization {
  id: string;
  name: string;
  country: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  sortCode?: string; // For UK
  ifscCode?: string; // For India
  ibanCode?: string; // For Europe
  swiftCode?: string; // For International
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobRole: string;
  organizationId: string;
  employmentType: EmploymentType;
  paymentType: PaymentType;
  paymentRate: number;
  currency: CurrencyCode;
  clientName?: string;
  clientManager?: string;
  employeeNumber: string;
  workLocation: string;
  startDate: string;
  endDate?: string;
  address: string;
  mobile: string;
  homePhone?: string;
  dateOfBirth: string;
  agencyName?: string;
  taxReferenceNumber?: string;
  agencyAddress?: string;
  companyNumber?: string;
  insuranceDetails?: string;
  vatNumber?: string;
  bankDetails: BankDetails;
  agencyBankDetails?: BankDetails;
  nationality: string;
  workAuthorizationDetails?: string;
  passportNumber: string;
  passportExpiry: string;
  pcStatus: string;
  emergencyContact: {
    name: string;
    contact: string;
    relationship: string;
  };
  niNumber?: string; // UK
  aadharNumber?: string; // India
  panNumber?: string; // India
  references: {
    name: string;
    email: string;
    phone: string;
  }[];
  documents: EmployeeDocument[];
  createdAt: string;
  updatedAt: string;
}
