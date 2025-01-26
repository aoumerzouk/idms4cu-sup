import React from 'react';
import { Scan } from 'lucide-react';
import ScanFolderConfig from '../../documents/ScanFolderConfig';

export default function ScanProfiles() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Scan className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Scan Settings
              </h3>
              <p className="text-sm text-gray-500">
                Configure scan import folder
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <ScanFolderConfig />
      </div>
    </div>
  );
}
