export interface Folder {
  id: string;
  name: string;
  isOptional: boolean;
  parentId: string | null;
  entityType: 'member' | 'account';
}

export interface FolderTemplate {
  id: string;
  name: string;
  isOptional: boolean;
  entityType: 'member' | 'account';
  subfolders: FolderTemplate[];
}
