import React, { useState, useEffect } from 'react';
import { X, Search, Crown, Shield, User } from 'lucide-react';
import { LoaderDots } from '@/components/ui';
import type { MembreProjet } from '@/interfaces';

// Type pour les utilisateurs disponibles à ajouter
interface AvailableUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
}

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  currentMembers: MembreProjet[];
  onAddMember: (userId: number, roleId: number) => Promise<void>;
  onUpdateMemberRole: (userId: number, roleId: number) => Promise<void>;
  onRemoveMember: (userId: number) => Promise<void>;
  isLoading?: boolean;
}

// Rôles disponibles
const ROLES = [
  { id: 1, nom: 'Chef de Projet', icon: Crown, color: 'text-yellow-600 bg-yellow-100' },
  { id: 2, nom: 'Assistant', icon: Shield, color: 'text-blue-600 bg-blue-100' },
  { id: 3, nom: 'Membre', icon: User, color: 'text-gray-600 bg-gray-100' }
];

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
  isOpen,
  onClose,
  projectId,
  currentMembers,
  onAddMember,
  onUpdateMemberRole,
  onRemoveMember,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'add'>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [searchResults, setSearchResults] = useState<AvailableUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simuler la recherche d'utilisateurs disponibles
  // Dans un vrai projet, cela ferait appel à une API
  const mockUsers: AvailableUser[] = [
    { id: 4, nom: 'Durand', prenom: 'Emma', email: 'emma@test.com', actif: true },
    { id: 5, nom: 'Leroy', prenom: 'Lucas', email: 'lucas@test.com', actif: true },
    { id: 6, nom: 'Bernard', prenom: 'Sophie', email: 'sophie@test.com', actif: true },
    { id: 7, nom: 'Petit', prenom: 'Thomas', email: 'thomas@test.com', actif: true },
    { id: 8, nom: 'Robert', prenom: 'Marie', email: 'marie@test.com', actif: true }
  ];

  // Filtrer les utilisateurs qui ne sont pas déjà membres du projet
  useEffect(() => {
    const memberIds = currentMembers.map(m => m.id);
    const available = mockUsers.filter(user => !memberIds.includes(user.id));
    setAvailableUsers(available);
  }, [currentMembers]);

  // Filtrer les résultats de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(availableUsers);
    } else {
      const filtered = availableUsers.filter(user =>
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, availableUsers]);

  // Ajouter un membre avec un rôle
  const handleAddMember = async (userId: number, roleId: number) => {
    setIsSearching(true);
    try {
      await onAddMember(userId, roleId);
      setSearchTerm('');
      setActiveTab('members');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Changer le rôle d'un membre
  const handleRoleChange = async (userId: number, newRoleId: number) => {
    try {
      await onUpdateMemberRole(userId, newRoleId);
    } catch (error) {
      console.error('Erreur lors de la modification du rôle:', error);
    }
  };

  // Supprimer un membre
  const handleRemoveMember = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer ce membre du projet ?')) {
      try {
        await onRemoveMember(userId);
      } catch (error) {
        console.error('Erreur lors de la suppression du membre:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="tf-text-h2 text-tf-night font-bold">
            Gestion des membres
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 font-medium text-sm transition-colors
              ${activeTab === 'members' 
                ? 'border-b-2 border-tf-dodger text-tf-dodger' 
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            Membres actuels ({currentMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 font-medium text-sm transition-colors
              ${activeTab === 'add' 
                ? 'border-b-2 border-tf-dodger text-tf-dodger' 
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            Ajouter des membres
          </button>
        </div>

        {/* Contenu selon l'onglet actif */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'members' ? (
            /* Liste des membres actuels */
            <div className="space-y-3">
              {currentMembers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucun membre dans ce projet
                </p>
              ) : (
                currentMembers.map((member) => {
                  const role = ROLES.find(r => r.nom === member.role);
                  const RoleIcon = role?.icon || User;
                  
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-tf-fuschia text-white rounded-full flex items-center justify-center font-medium">
                          {member.prenom.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="tf-text-base font-medium text-tf-night">
                            {member.prenom} {member.nom}
                          </p>
                          <p className="tf-text-small text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Sélecteur de rôle */}
                        <select
                          value={role?.id || 3}
                          onChange={(e) => handleRoleChange(member.id, parseInt(e.target.value))}
                          disabled={isLoading}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-tf-dodger"
                        >
                          {ROLES.map(r => (
                            <option key={r.id} value={r.id}>{r.nom}</option>
                          ))}
                        </select>
                        
                        {/* Badge du rôle */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${role?.color}`}>
                          <RoleIcon size={12} />
                          {member.role}
                        </span>
                        
                        {/* Bouton supprimer */}
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={isLoading}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Ajouter des membres */
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tf-dodger"
                />
              </div>

              {/* Résultats de recherche */}
              <div className="space-y-2">
                {searchResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {searchTerm.trim() === '' ? 'Saisissez un terme de recherche' : 'Aucun utilisateur trouvé'}
                  </p>
                ) : (
                  searchResults.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-tf-fuschia text-white rounded-full flex items-center justify-center font-medium">
                          {user.prenom.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="tf-text-base font-medium text-tf-night">
                            {user.prenom} {user.nom}
                          </p>
                          <p className="tf-text-small text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      {/* Boutons pour ajouter avec différents rôles */}
                      <div className="flex gap-2">
                        {ROLES.map(role => {
                          const RoleIcon = role.icon;
                          return (
                            <button
                              key={role.id}
                              onClick={() => handleAddMember(user.id, role.id)}
                              disabled={isSearching || isLoading}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors
                                hover:opacity-80 disabled:opacity-50 ${role.color} hover:scale-105`}
                              title={`Ajouter comme ${role.nom}`}
                            >
                              <RoleIcon size={12} />
                              {role.nom}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
          >
            Fermer
          </button>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <LoaderDots size="lg" />
          </div>
        )}
      </div>
    </div>
  );
};
