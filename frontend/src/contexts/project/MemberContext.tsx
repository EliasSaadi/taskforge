import React, { createContext, useContext, useState, useCallback } from 'react';
import { memberService } from '@/services/project/memberService';
import type { MembreProjet } from '@/interfaces';

interface MemberContextType {
  members: MembreProjet[];
  loading: boolean;
  error: string | null;
  loadMembers: (projectId: number) => Promise<void>;
  addMember: (projectId: number, userId: number, roleId: number) => Promise<void>;
  updateMemberRole: (projectId: number, userId: number, roleId: number) => Promise<void>;
  removeMember: (projectId: number, userId: number) => Promise<void>;
  clearMembers: () => void;
  clearError: () => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

interface MemberProviderProps {
  children: React.ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  const [members, setMembers] = useState<MembreProjet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = useCallback(async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const projectMembers = await memberService.getProjectMembers(projectId);
      setMembers(projectMembers);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du chargement des membres';
      setError(message);
      console.error('Erreur dans MemberContext:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMember = useCallback(async (projectId: number, userId: number, roleId: number) => {
    try {
      setError(null);
      const newMember = await memberService.addMember(projectId, userId, roleId);
      setMembers(prev => [...prev, newMember]);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'ajout du membre';
      setError(message);
      throw err;
    }
  }, []);

  const updateMemberRole = useCallback(async (projectId: number, userId: number, roleId: number) => {
    try {
      setError(null);
      const updatedMember = await memberService.updateMemberRole(projectId, userId, roleId);
      setMembers(prev => prev.map(member => 
        member.id === userId ? updatedMember : member
      ));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la modification du rôle';
      setError(message);
      throw err;
    }
  }, []);

  const removeMember = useCallback(async (projectId: number, userId: number) => {
    try {
      setError(null);
      await memberService.removeMember(projectId, userId);
      setMembers(prev => prev.filter(member => member.id !== userId));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la suppression du membre';
      setError(message);
      throw err;
    }
  }, []);

  const clearMembers = useCallback(() => {
    setMembers([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <MemberContext.Provider value={{
      members,
      loading,
      error,
      loadMembers,
      addMember,
      updateMemberRole,
      removeMember,
      clearMembers,
      clearError
    }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMembers = (): MemberContextType => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
};
