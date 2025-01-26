import React from 'react';
import { Edit2, Trash2, Star, StarOff, FolderPlus } from 'lucide-react';
import type { Folder } from '../../types/folder';

interface FolderActionsProps {
  folder: Folder;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onToggleOptional: (id: string) => void;
  onAddSubfolder: (parentId: string) => void;
}

export default function FolderActions({
  folder,
  onRename,
  onDelete,
  onToggleOptional,
  onAddSubfolder
}: FolderActionsProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newName, setNewName] = React.useState(folder.name);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onRename(folder.id, newName.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {isEditing ? (
        <form onSubmit={handleRename} className="flex items-center">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-32"
            autoFocus
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <>
          <button
            onClick={() => onAddSubfolder(folder.id)}
            className="p-1 hover:bg-gray-700 rounded text-blue-400 hover:text-blue-300"
            title="Add subfolder"
          >
            <FolderPlus className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-gray-700 rounded"
            title="Rename folder"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(folder.id)}
            className="p-1 hover:bg-gray-700 rounded text-red-400 hover:text-red-300"
            title="Delete folder"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onToggleOptional(folder.id)}
            className={`p-1 hover:bg-gray-700 rounded ${folder.isOptional ? 'text-gray-400' : 'text-yellow-400'}`}
            title={folder.isOptional ? 'Mark as required' : 'Mark as optional'}
          >
            {folder.isOptional ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
          </button>
        </>
      )}
    </div>
  );
}
