export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  memberNumber: string;
  email: string[];
  SSN?: string;
  middleName?: string;
  dateJoined: Date;
}
