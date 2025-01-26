import { useState, useEffect } from 'react';
import type { ScanProfile } from '../types/scan';
import * as scanProfileService from '../services/db/scanProfileService';

export function useScanProfiles() {
  const [profiles, setProfiles] = useState<ScanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    try {
      const data = await scanProfileService.getScanProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load scan profiles'));
    } finally {
      setLoading(false);
    }
  }

  const createProfile = async (profileData: Omit<ScanProfile, 'id'>) => {
    try {
      const newProfile = await scanProfileService.createScanProfile(profileData);
      setProfiles(prev => [...prev, newProfile]);
      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create scan profile'));
      throw err;
    }
  };

  const updateProfile = async (id: string, profileData: Partial<ScanProfile>) => {
    try {
      await scanProfileService.updateScanProfile(id, profileData);
      setProfiles(prev => prev.map(profile => 
        profile.id === id ? { ...profile, ...profileData } : profile
      ));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update scan profile'));
      throw err;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      await scanProfileService.deleteScanProfile(id);
      setProfiles(prev => prev.filter(profile => profile.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete scan profile'));
      throw err;
    }
  };

  return {
    profiles,
    loading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    refresh: loadProfiles
  };
}
