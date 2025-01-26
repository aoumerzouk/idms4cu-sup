import React from 'react';
import { ChevronRight, ChevronDown, Folder, FolderPlus, FolderOpen } from 'lucide-react';
import type { Folder as FolderType } from '../../types/folder';
import FolderActions from './FolderActions';

interface TreeViewProps {
  folders: FolderType[];
  onAddFolder: (parentId: string | null) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onDeleteFolder: (id: string) => void;
  onToggleOptional: (id: string) => void;
}

export default function TreeView({
  folders,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  onToggleOptional
}: TreeViewProps) {
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

  const handleAddSubfolder = (parentId: string) => {
    onAddFolder(parentId);
    // Automatically expand the parent folder
    setExpandedFolders(prev => new Set([...prev, parentId]));
  };

  const renderFolder = (folder: FolderType) => {
    const isExpanded = expandedFolders.has(folder.id);
    const childFolders = folders.filter(f => f.parentId === folder.id);
    const hasChildren = childFolders.length > 0;

    return (
      <div key={folder.id} className="ml-4">
        <div className="flex items-center space-x-1 py-1 px-2 hover:bg-gray-800 rounded-md group">
          <button
            onClick={() => toggleFolder(folder.id)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : <div className="w-4" />}
          </button>
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-blue-400" />
          ) : (
            <Folder className="w-4 h-4 text-gray-400" />
          )}
          <span className="flex-1">{folder.name}</span>
          <div className="opacity-0 group-hover:opacity-100">
            <FolderActions
              folder={folder}
              onRename={onRenameFolder}
              onDelete={onDeleteFolder}
              onToggleOptional={onToggleOptional}
              onAddSubfolder={handleAddSubfolder}
            />
          </div>
        </div>
        {isExpanded && childFolders.map(renderFolder)}
      </div>
    );
  };

  return (
    <div className="text-sm">
      {folders.filter(f => !f.parentId).map(renderFolder)}
      <button
        onClick={() => onAddFolder(null)}
        className="flex items-center space-x-2 mt-2 py-2 px-4 w-full hover:bg-gray-800 rounded-md"
      >
        <FolderPlus className="w-4 h-4" />
        <span>Add Root Folder</span>
      </button>
    </div>
  );
}
