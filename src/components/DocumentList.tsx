import React from 'react';
import type { MemberIdentifier, AccountIdentifier } from '../types/creditUnion';
import DocumentActions from './documents/DocumentActions';

interface DocumentListProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
}

export default function DocumentList({ selectedEntity }: DocumentListProps) {
  const handleUpload = () => {
    // Will be implemented when storage is ready
    console.log('Upload clicked');
  };

  const handleScan = () => {
    // Will be implemented when storage is ready
    console.log('Scan clicked');
  };

  const handleScreenCapture = () => {
    // Will be implemented when storage is ready
    console.log('Screen capture clicked');
  };

  if (!selectedEntity) {
    return (
      <div className="text-center text-gray-500 py-8">
        Select a member or account to view documents
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Documents</h2>
        <DocumentActions
          selectedEntity={selectedEntity}
          onUpload={handleUpload}
          onScan={handleScan}
          onScreenCapture={handleScreenCapture}
        />
      </div>

      <div className="text-center text-gray-500 py-8">
        Document storage functionality will be implemented soon
      </div>
    </div>
  );
}
