import React from 'react';
import { Upload } from 'lucide-react';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';

interface UploadButtonProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
  onUpload: () => void;
}

export default function UploadButton({ selectedEntity, onUpload }: UploadButtonProps) {
  if (!selectedEntity) {
    return (
      <button 
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
        title="Select a member or account to upload documents"
      >
        <Upload className="w-4 h-4" />
        <span>Upload New</span>
      </button>
    );
  }

  return (
    <button
      onClick={onUpload}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
    >
      <Upload className="w-4 h-4" />
      <span>Upload New</span>
    </button>
  );
}
