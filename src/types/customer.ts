export interface Customer {
  CustomerID: string;
  CustomerNumber: string;
  CompanyName?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  SSN?: string;
  OtherID?: string;
  OtherIDType?: string;
  BirthDate?: Date;
  Email?: string;
  ExternalID?: string;
  Photo?: string; // Assuming photo is stored as a URL or base64 string
  AddressID?: string;
  PhotoType?: string;
  CreatedDate: Date;
  UpdatedDate?: Date;
  ExtraField1?: string;
  ExtraField2?: string;
  ExtraField3?: string;
  ExtraField4?: string;
  ExtraField5?: string;
}
