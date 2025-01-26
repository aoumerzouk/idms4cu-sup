import React, { useState } from 'react';
import type { Member } from '../../types/member';
import { validateAccountParts } from '../../utils/accountUtils';
import type { Customer } from '../../types/customer';
import CustomerForm from '../customer/CustomerForm';

interface MemberFormProps {
  onSubmit: (member: Omit<Member, 'id' | 'dateJoined'>, accounts: any[]) => void;
}

export default function MemberForm({ onSubmit }: MemberFormProps) {
  const [formData, setFormData] = React.useState<Omit<Customer, 'CustomerID' | 'CreatedDate' | 'UpdatedDate'>>({
    CustomerNumber: '',
    CompanyName: '',
    FirstName: '',
    MiddleName: '',
    LastName: '',
    SSN: '',
    OtherID: '',
    OtherIDType: '',
    BirthDate: undefined,
    Email: '',
    ExternalID: '',
    Photo: '',
    AddressID: '',
    PhotoType: '',
    ExtraField1: '',
    ExtraField2: '',
    ExtraField3: '',
    ExtraField4: '',
    ExtraField5: ''
  });
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate member ID (account base number)
      if (!formData.CustomerNumber) {
        throw new Error('Member ID is required');
      }

      // Validate that member ID follows account base number rules
      validateAccountParts(formData.CustomerNumber, '000', '000');

      onSubmit({
        ...formData,
        memberNumber: formData.CustomerNumber, // Use member ID as member number
        status: 'active'
      }, []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid form data');
    }
  };

  return (
    <CustomerForm
      onSubmit={handleSubmit}
      onCancel={() => {}}
    />
  );
}
