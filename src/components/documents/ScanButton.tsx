import React, { useRef } from 'react';
import { Scan } from 'lucide-react';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';
import { usePermissions } from '../../contexts/PermissionContext';

interface ScanButtonProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
  onScan: (imageData: Blob, metadata: {
    title: string;
    tags: string[];
    retentionPolicyId?: string;
  }) => Promise<void>;
}

export default function ScanButton({ selectedEntity, onScan }: ScanButtonProps) {
  const { hasPermission } = usePermissions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await onScan(file, {
        title: file.name,
        tags: ['scanned']
      });
    } catch (error) {
      console.error('Error handling scanned file:', error);
      alert('Failed to process scanned file. Please try again.');
    }
  };

  if (!hasPermission('SCAN_DOCUMENTS')) {
    return null;
  }

  if (!selectedEntity) {
    return (
      <button 
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
        title="Select a member or account to scan documents"
      >
        <Scan className="w-4 h-4" />
        <span>Scan</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
      >
        <Scan className="w-4 h-4" />
        <span>Import Scan</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleFileSelect}
      />
    </>
  );
}
