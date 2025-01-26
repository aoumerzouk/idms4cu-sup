import React from 'react';
    import type { Account, AccountType } from '../../types/account';
    import { ACCOUNT_TYPE_CODES, generateAccountNumber } from '../../utils/accountUtils';

    interface AccountFormProps {
      memberId: string;
      onSubmit: (account: Omit<Account, 'id' | 'dateOpened'>) => void;
    }

    export default function AccountForm({ memberId, onSubmit }: AccountFormProps) {
      const [formData, setFormData] = React.useState({
        base: '',
        typeCode: ACCOUNT_TYPE_CODES.share,
        suffix: '000',
        type: 'share' as AccountType,
        balance: '0.00'
      });
      const [error, setError] = React.useState<string | null>(null);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
          const newAccount = {
            accountNumber: {
              base: formData.base,
              typeCode: formData.typeCode,
              suffix: formData.suffix
            },
            type: formData.type,
            status: 'active',
            memberIds: [memberId],
            balance: parseFloat(formData.balance) || 0
          };
          console.log('Submitting account data:', newAccount);
          onSubmit(newAccount);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Invalid form data');
        }
      };

      const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
          setFormData(prev => ({ ...prev, balance: value }));
        }
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Base Number</label>
              <input
                type="text"
                required
                maxLength={7}
                pattern="[0-9]{1,7}"
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                value={formData.base}
                onChange={e => setFormData(prev => ({ ...prev, base: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Account Type</label>
              <select
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                value={formData.type}
                onChange={e => {
                  const type = e.target.value as AccountType;
                  setFormData(prev => ({
                    ...prev,
                    type,
                    typeCode: ACCOUNT_TYPE_CODES[type]
                  }));
                }}
              >
                <option value="share">Share (Savings)</option>
                <option value="draft">Draft (Checking)</option>
                <option value="certificate">Certificate</option>
                <option value="moneyMarket">Money Market</option>
                <option value="loan">Loan</option>
                <option value="lineOfCredit">Line of Credit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Suffix</label>
              <input
                type="text"
                required
                maxLength={3}
                pattern="[0-9]{1,3}"
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                value={formData.suffix}
                onChange={e => setFormData(prev => ({ ...prev, suffix: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Initial Balance</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              value={formData.balance}
              onChange={handleBalanceChange}
              placeholder="0.00"
            />
          </div>

          <div className="text-sm text-gray-400">
            Full Account Number: {generateAccountNumber(formData.base, formData.typeCode, formData.suffix)}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Create Account
          </button>
        </form>
      );
    }
