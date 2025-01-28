import React from 'react';
import { UserPlus, PlusCircle } from 'lucide-react';
import { creditUnionConfig } from '../../config/creditUnion';
import type { EntityType } from '../../types/entity';

interface EntityActionsProps {
  entityType: EntityType;
  onCreateMember: () => void;
  onCreateAccount: () => void;
}

export default function EntityActions({ entityType, onCreateMember, onCreateAccount }: EntityActionsProps) {
  return (
    <div className="mt-2 mb-4 flex gap-2">
      {entityType === 'member' ? (
        <button
          onClick={() => {
            console.log('Create Member button clicked');
            onCreateMember();
          }}
          className={`flex items-center gap-2 w-full bg-${creditUnionConfig.branding.primaryColor}-600 hover:bg-${creditUnionConfig.branding.primaryColor}-700 text-white px-4 py-2 rounded-md`}
        >
          <UserPlus className="w-4 h-4" />
          <span>New Member</span>
        </button>
      ) : (
        <button
          onClick={() => {
            console.log('Create Account button clicked');
            onCreateAccount();
          }}
          className={`flex items-center gap-2 w-full bg-${creditUnionConfig.branding.primaryColor}-600 hover:bg-${creditUnionConfig.branding.primaryColor}-700 text-white px-4 py-2 rounded-md`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Account</span>
        </button>
      )}
    </div>
  );
}
