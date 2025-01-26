import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import SearchResults from '../search/SearchResults';
import type { Member } from '../../types/member';
import type { Account } from '../../types/account';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';

interface EntitySearchProps {
  members: Member[];
  accounts: Account[];
  loading: boolean;
  onSelect: (identifier: MemberIdentifier | AccountIdentifier) => void;
  getMemberIdentifier: (member: Member) => MemberIdentifier;
  getAccountIdentifier: (account: Account) => AccountIdentifier;
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
}

export default function EntitySearch({
  members,
  accounts,
  loading,
  onSelect,
  getMemberIdentifier,
  getAccountIdentifier,
  selectedEntity
}: EntitySearchProps) {
  const { searchTerm, setSearchTerm, searchResults } = useSearch(members, accounts);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Handle focus/blur with a slight delay to allow for selection
  const handleFocus = () => {
    setIsFocused(true);
    setShowResults(true);
  };

  const handleBlur = () => {
    // Delay hiding results to allow for click handling
    setTimeout(() => {
      setIsFocused(false);
      setShowResults(false);
    }, 200);
  };

  const handleSelectMember = (member: Member) => {
    onSelect(getMemberIdentifier(member));
    setSearchTerm('');
    setShowResults(false);
  };

  const handleSelectAccount = (account: Account) => {
    onSelect(getAccountIdentifier(account));
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder={loading ? "Loading..." : "Search members or accounts..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full bg-gray-800 text-white rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {showResults && searchTerm && !loading && (
        <SearchResults
          results={searchResults}
          onSelectMember={handleSelectMember}
          onSelectAccount={handleSelectAccount}
          selectedId={selectedEntity?.id}
        />
      )}
    </div>
  );
}
