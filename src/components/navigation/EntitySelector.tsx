import React from 'react';
import { Users, Landmark } from 'lucide-react';
import type { EntityType } from '../../types/entity';

interface EntitySelectorProps {
  selectedEntity: EntityType;
  onEntityChange: (entity: EntityType) => void;
}

export default function EntitySelector({ selectedEntity, onEntityChange }: EntitySelectorProps) {
  return (
    <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => onEntityChange('member')}
        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors
          ${selectedEntity === 'member' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
      >
        <Users className="w-4 h-4" />
        <span>Members</span>
      </button>
      <button
        onClick={() => onEntityChange('account')}
        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors
          ${selectedEntity === 'account' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
      >
        <Landmark className="w-4 h-4" />
        <span>Accounts</span>
      </button>
    </div>
  );
}
