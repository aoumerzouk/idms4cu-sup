import React from 'react';
    import { FolderTree } from 'lucide-react';
    import SignOutButton from './auth/SignOutButton';
    import { creditUnionConfig } from '../config/creditUnion';
    import EntitySelector from './navigation/EntitySelector';
    import EntitySearch from './navigation/EntitySearch';
    import EntityActions from './navigation/EntityActions';
    import FolderTreeView from './folders/FolderTree';
    import MemberFormModal from './modals/MemberFormModal';
    import AccountFormModal from './modals/AccountFormModal';
    import { useMembers } from '../hooks/useMembers';
    import { useAccounts } from '../hooks/useAccounts';
    import { useFolderTemplates } from '../hooks/useFolderTemplates';
    import { usePermissions } from '../contexts/PermissionContext';
    import type { EntityType } from '../types/entity';
    import type { MemberIdentifier, AccountIdentifier } from '../types/creditUnion';

    interface SidebarProps {
      onEntitySelect: (entity: MemberIdentifier | AccountIdentifier | null) => void;
      selectedEntity: MemberIdentifier | AccountIdentifier | null;
      showAdmin: boolean;
      onToggleAdmin: (show: boolean) => void;
    }

    export default function Sidebar({ 
      onEntitySelect, 
      selectedEntity,
      showAdmin,
      onToggleAdmin
    }: SidebarProps) {
      const [selectedEntityType, setSelectedEntityType] = React.useState<EntityType>('member');
      const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null);
      const [isMemberModalOpen, setIsMemberModalOpen] = React.useState(false);
      const [isAccountModalOpen, setIsAccountModalOpen] = React.useState(false);
      
      const { members, loading: membersLoading, error: membersError, addMember, getMemberIdentifier } = useMembers();
      const { accounts, loading: accountsLoading, error: accountsError, addAccount, getAccountIdentifier } = useAccounts();
      const { hasPermission } = usePermissions();
      
      const folders = useFolderTemplates(
        selectedEntity ? ('memberNumber' in selectedEntity ? 'member' : 'account') : selectedEntityType,
        selectedEntity?.id || null
      );

      const handleCreateMember = async (memberData: any, accountsData: any[]) => {
        try {
          const newMember = await addMember(memberData);
          for (const accountData of accountsData) {
            await addAccount(accountData, newMember.id);
          }
          setIsMemberModalOpen(false);
          onEntitySelect(getMemberIdentifier(newMember));
        } catch (error) {
          console.error('Error creating member:', error);
        }
      };

      const handleCreateAccount = async (accountData: any) => {
        if (!selectedEntity || !('memberNumber' in selectedEntity)) return;
        
        try {
          const newAccount = await addAccount(accountData, selectedEntity.id);
          setIsAccountModalOpen(false);
          onEntitySelect(getAccountIdentifier(newAccount));
        } catch (error) {
          console.error('Error creating account:', error);
        }
      };

      return (
        <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <FolderTree className="w-8 h-8 text-emerald-500" />
              <h1 className="text-xl font-bold">{creditUnionConfig.name}</h1>
            </div>
            <SignOutButton />
          </div>

          {hasPermission('ADMIN') && (
            <button
              onClick={() => onToggleAdmin(!showAdmin)}
              className="mb-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {showAdmin ? 'Back to Main' : 'Admin Settings'}
            </button>
          )}

          {!showAdmin && (
            <>
              <EntitySelector
                selectedEntity={selectedEntityType}
                onEntityChange={setSelectedEntityType}
              />

              <EntityActions
                entityType={selectedEntityType}
                onCreateMember={() => setIsMemberModalOpen(true)}
                onCreateAccount={() => setIsAccountModalOpen(true)}
              />

              <div className="mb-4">
                <EntitySearch
                  members={members}
                  accounts={accounts}
                  loading={membersLoading || accountsLoading}
                  onSelect={onEntitySelect}
                  getMemberIdentifier={getMemberIdentifier}
                  getAccountIdentifier={getAccountIdentifier}
                  selectedEntity={selectedEntity}
                />
              </div>

              {selectedEntity && (
                <>
                  <div className="mb-4 p-3 bg-gray-800 rounded-md">
                    <div className="text-sm text-gray-400">
                      Selected {'memberNumber' in selectedEntity ? 'Member' : 'Account'}:
                    </div>
                    <div className="font-medium text-white">{selectedEntity.displayName}</div>
                    <div className="text-sm text-gray-400">
                      {'memberNumber' in selectedEntity ? 
                        `Member #${selectedEntity.memberNumber}` : 
                        `Account #${selectedEntity.accountNumber}`}
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto">
                    <div className="text-sm font-medium text-gray-400 mb-2">Folders</div>
                    <FolderTreeView
                      folders={folders}
                      onSelectFolder={setSelectedFolderId}
                      selectedFolderId={selectedFolderId}
                    />
                  </div>
                </>
              )}

              <MemberFormModal
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
                onSubmit={handleCreateMember}
              />

              <AccountFormModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
                onSubmit={handleCreateAccount}
                members={members}
              />
            </>
          )}
        </div>
      );
    }
