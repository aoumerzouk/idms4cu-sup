import React from 'react';
import TabView from '../common/TabView';
import EntityDetails from './EntityDetails';
import DocumentList from '../DocumentList';
import MemberAccounts from './MemberAccounts';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';

interface EntityTabbedViewProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
  onEntitySelect: (entity: MemberIdentifier | AccountIdentifier) => void;
}

export default function EntityTabbedView({ selectedEntity, onEntitySelect }: EntityTabbedViewProps) {
  if (!selectedEntity) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-gray-500">
        Select a member or account to view details
      </div>
    );
  }

  const isMember = 'memberNumber' in selectedEntity;
  const tabs = [
    {
      id: 'info',
      label: isMember ? 'Member Info' : 'Account Info',
      content: <EntityDetails selectedEntity={selectedEntity} onEntitySelect={onEntitySelect} />
    },
    {
      id: 'documents',
      label: isMember ? 'Member Documents' : 'Account Documents',
      content: <DocumentList selectedEntity={selectedEntity} />
    }
  ];

  // Add Accounts tab only for members
  if (isMember) {
    tabs.push({
      id: 'accounts',
      label: 'Accounts',
      content: <MemberAccounts memberId={selectedEntity.id} onSelectAccount={onEntitySelect} />
    });
  }

  return <TabView tabs={tabs} />;
}
