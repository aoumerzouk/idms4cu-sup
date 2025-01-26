import React from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import type { Folder as FolderType } from '../../types/folder';

interface FolderTreeProps {
  folders: FolderType[];
  onSelectFolder: (folderId: string) => void;
  selectedFolderId: string | null;
}

export default function FolderTree({ folders, onSelectFolder, selectedFolderId }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const childFolders = folders.filter(f => f.parentId === folder.id);
    const hasChildren = childFolders.length > 0;

    return (
      <div key={folder.id} style={{ marginLeft: `${level * 12}px` }}>
        <div 
          className={`flex items-center gap-2 py-1 px-2 rounded-md transition-colors cursor-pointer
            ${isSelected ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) {
                toggleFolder(folder.id);
              }
            }}
            className="p-1 hover:bg-gray-700 rounded cursor-pointer"
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )
            ) : (
              <div className="w-4" />
            )}
          </div>
          <div 
            onClick={() => onSelectFolder(folder.id)}
            className="flex items-center gap-2 flex-1 cursor-pointer"
          >
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm truncate">
              {folder.name}
              {folder.isOptional && (
                <span className="ml-1 text-xs text-gray-500">(Optional)</span>
              )}
            </span>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="mt-1">
            {childFolders.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {folders.filter(f => !f.parentId).map(folder => renderFolder(folder))}
    </div>
  );
}
