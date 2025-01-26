import React, { useState, useEffect, useRef } from 'react';
import { Folder, Save } from 'lucide-react';
import { getScanFolder, setScanFolder } from '../../services/db/scanFolderService';

export default function ScanFolderConfig() {
  const [folderPath, setFolderPath] = useState('');
  const [saving, setSaving] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getScanFolder().then(folder => {
      if (folder) setFolderPath(folder);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setScanFolder(folderPath);
      alert('Scan folder updated successfully');
    } catch (error) {
      alert('Failed to update scan folder');
    } finally {
      setSaving(false);
    }
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFolderPath(files[0].webkitRelativePath.split('/')[0]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scan Import Folder
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => folderInputRef.current?.click()}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <Folder className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            placeholder="Select or enter folder path"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            ref={folderInputRef}
            type="file"
            className="hidden"
            webkitdirectory=""
            directory=""
            onChange={handleFolderSelect}
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving || !folderPath}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
