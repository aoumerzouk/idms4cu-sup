import React, { useState, useEffect } from 'react';
import { PlusCircle, Folder, Edit2, Save, Trash2, FolderPlus } from 'lucide-react';
import type { EntityType } from '../../../types/entity';
import type { FolderTemplate } from '../../../types/folder';
import { saveFolderTemplates, getFolderTemplates } from '../../../services/db/folderTemplateService';

interface TreeViewEditorProps {
  entityType: EntityType;
  onChangesPending?: (hasPendingChanges: boolean) => void;
}

export default function TreeViewEditor({ entityType, onChangesPending }: TreeViewEditorProps) {
  const [folders, setFolders] = useState<FolderTemplate[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    getFolderTemplates(entityType).then(loadedFolders => {
      setFolders(loadedFolders);
      setHasUnsavedChanges(false);
      onChangesPending?.(false);
    });
  }, [entityType]);

  const handleAddFolder = (parentId: string | null = null) => {
    const newFolder: FolderTemplate = {
      id: `folder-${Date.now()}`,
      name: 'New Folder',
      isOptional: false,
      entityType,
      parentId,
      subfolders: []
    };

    setFolders(prev => {
      if (parentId) {
        return prev.map(folder => 
          folder.id === parentId 
            ? { ...folder, subfolders: [...folder.subfolders, newFolder] }
            : folder
        );
      }
      return [...prev, newFolder];
    });

    if (parentId) {
      setExpandedFolders(prev => new Set([...prev, parentId]));
    }
    
    setEditingId(newFolder.id);
    setEditingName(newFolder.name);
    setHasUnsavedChanges(true);
    onChangesPending?.(true);
  };

  const handleSave = async () => {
    try {
      if (folders.some(f => !f.name.trim())) {
        alert('Please name all folders before saving');
        return;
      }
      
      await saveFolderTemplates(entityType, folders);
      setHasUnsavedChanges(false);
      onChangesPending?.(false);
      alert('Folder structure saved successfully');
    } catch (error) {
      console.error('Error saving folder structure:', error);
      alert('Failed to save folder structure');
    }
  };

  const handleNameSave = (folderId: string, parentId: string | null = null) => {
    if (!editingName.trim()) return;
    
    setFolders(prev => {
      if (parentId) {
        return prev.map(folder => 
          folder.id === parentId
            ? {
                ...folder,
                subfolders: folder.subfolders.map(sub =>
                  sub.id === folderId
                    ? { ...sub, name: editingName.trim() }
                    : sub
                )
              }
            : folder
        );
      }
      return prev.map(folder =>
        folder.id === folderId
          ? { ...folder, name: editingName.trim() }
          : folder
      );
    });
    
    setEditingId(null);
    setEditingName('');
    setHasUnsavedChanges(true);
    onChangesPending?.(true);
  };

  const handleDelete = (folderId: string, parentId: string | null = null) => {
    setFolders(prev => {
      if (parentId) {
        return prev.map(folder =>
          folder.id === parentId
            ? {
                ...folder,
                subfolders: folder.subfolders.filter(sub => sub.id !== folderId)
              }
            : folder
        );
      }
      return prev.filter(f => f.id !== folderId);
    });
    setHasUnsavedChanges(true);
    onChangesPending?.(true);
  };

  const renderFolder = (folder: FolderTemplate, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);

    return (
      <div key={folder.id} style={{ marginLeft: level * 24 }}>
        <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
          <Folder className="w-4 h-4 text-gray-400" />
          {editingId === folder.id ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleNameSave(folder.id, folder.parentId);
              }}
              className="flex-1 flex items-center gap-2"
            >
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleNameSave(folder.id, folder.parentId)}
                className="flex-1 px-2 py-1 border rounded-md"
                autoFocus
              />
            </form>
          ) : (
            <>
              <span className="flex-1">{folder.name}</span>
              <button
                onClick={() => handleAddFolder(folder.id)}
                className="p-1 text-blue-400 hover:text-blue-600"
                title="Add subfolder"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditingId(folder.id);
                  setEditingName(folder.name);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Edit folder name"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(folder.id, folder.parentId)}
                className="p-1 text-red-400 hover:text-red-600"
                title="Delete folder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        {folder.subfolders?.length > 0 && (
          <div className="mt-1">
            {folder.subfolders.map(subfolder => renderFolder(subfolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">
          {entityType === 'member' ? 'Member' : 'Account'} Folders
        </h4>
        <div className="space-x-2">
          <button
            onClick={() => handleAddFolder()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Root Folder
          </button>
          {hasUnsavedChanges && (
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          )}
        </div>
      </div>
      <div className="border rounded-md p-4">
        {folders.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No folders defined. Click "Add Root Folder" to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map(folder => renderFolder(folder))}
          </div>
        )}
      </div>
    </div>
  );
}
