import React from 'react';
import { Settings, Scan } from 'lucide-react';

interface AdminNavProps {
  activeTab: 'treeview' | 'scan';
  onTabChange: (tab: 'treeview' | 'scan') => void;
}

export default function AdminNav({ activeTab, onTabChange }: AdminNavProps) {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <button
                onClick={() => onTabChange('treeview')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'treeview'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                TreeView Settings
              </button>
              <button
                onClick={() => onTabChange('scan')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'scan'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Scan className="w-4 h-4 mr-2" />
                Scan Profiles
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
