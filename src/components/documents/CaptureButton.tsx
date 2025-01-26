import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import CaptureModal from './CaptureModal';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';
import { usePermissions } from '../../contexts/PermissionContext';

interface CaptureButtonProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
  onCapture: (imageData: Blob, metadata: {
    title: string;
    tags: string[];
    retentionPolicyId?: string;
  }) => Promise<void>;
}

export default function CaptureButton({ selectedEntity, onCapture }: CaptureButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasPermission } = usePermissions();

  if (!hasPermission('SCAN_DOCUMENTS')) {
    return null;
  }

  if (!selectedEntity) {
    return (
      <button 
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
        title="Select a member or account to capture documents"
      >
        <Camera className="w-4 h-4" />
        <span>Capture</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
      >
        <Camera className="w-4 h-4" />
        <span>Capture</span>
      </button>

      <CaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedEntity={selectedEntity}
        onCapture={onCapture}
      />
    </>
  );
}
