import React, { useRef, useEffect, useState } from 'react';
import { Upload, Scan } from 'lucide-react';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';
import { usePermissions } from '../../contexts/PermissionContext';
import { getScanFolder } from '../../services/db/scanFolderService';

interface DocumentActionsProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
  onUpload: (file: File, metadata: {
    title: string;
    tags: string[];
    retentionPolicyId?: string;
  }) => Promise<void>;
}

export default function DocumentActions({ 
  selectedEntity, 
  onUpload
}: DocumentActionsProps) {
  const { hasPermission } = usePermissions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);
  const [scanFolder, setScanFolder] = useState<string | null>(null);

  useEffect(() => {
    getScanFolder().then(setScanFolder);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await onUpload(file, {
        title: file.name,
        tags: ['uploaded']
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const handleScanSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await onUpload(file, {
        title: file.name,
        tags: ['scanned'],
        scanFolder: scanFolder || undefined
      });
    } catch (error) {
      console.error('Error processing scanned file:', error);
      alert('Failed to process scanned file. Please try again.');
    }
  };

  if (!selectedEntity) {
    return (
      <div className="flex gap-2">
        <button 
          disabled
          className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
          title="Select a member or account to upload documents"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {hasPermission('CREATE_DOCUMENTS') && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
          />

          {hasPermission('SCAN_DOCUMENTS') && (
            <>
              <button
                onClick={() => scanInputRef.current?.click()}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                title={scanFolder ? `Import from ${scanFolder}` : 'Import Scan'}
              >
                <Scan className="w-4 h-4" />
                <span>Import Scan</span>
              </button>
              <input
                ref={scanInputRef}
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleScanSelect}
                {...(scanFolder ? { webkitdirectory: "", directory: "" } : {})}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
