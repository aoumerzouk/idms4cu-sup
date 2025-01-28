import React, { useState } from 'react';
import type { Member } from '../../types/member';
import { validateAccountParts } from '../../utils/accountUtils';
import type { Customer } from '../../types/customer';
import CustomerForm from '../customer/CustomerForm';

interface MemberFormProps {
  onSubmit: (member: Omit<Member, 'id' | 'dateJoined'>, accounts: any[]) => void;
}

export default function MemberForm({ onSubmit }: MemberFormProps) {
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (customerData: Omit<Customer, 'CustomerID' | 'CreatedDate' | 'UpdatedDate'>) => {
    setError(null);

    try {
      // Validate member ID (account base number)
      if (!customerData.CustomerNumber) {
        throw new Error('Member ID is required');
      }

      // Validate that member ID follows account base number rules
      validateAccountParts(customerData.CustomerNumber, '000', '000');

      onSubmit({
        firstName: customerData.FirstName || '',
        lastName: customerData.LastName || '',
        memberNumber: customerData.CustomerNumber,
        email: [customerData.Email || ''],
        SSN: customerData.SSN,
        middleName: customerData.MiddleName,
        address: {
          street: customerData.AddressID || '',
          city: '',
          state: '',
          zipCode: ''
        },
        phone: {
          primary: '',
          secondary: ''
        },
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
