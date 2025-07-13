import React from 'react';
import { MemberProvider } from './MemberContext';
import { TaskProvider } from './TaskContext';
import { MessageProvider } from './MessageContext';
import { ProjectProvider } from './ProjectContext';

interface GlobalProjectProviderProps {
  children: React.ReactNode;
}

/**
 * Provider global qui englobe tous les contexts liés aux projets
 * dans l'ordre correct pour éviter les dépendances circulaires
 */
export const GlobalProjectProvider: React.FC<GlobalProjectProviderProps> = ({ children }) => {
  return (
    <MemberProvider>
      <TaskProvider>
        <MessageProvider>
          <ProjectProvider>
            {children}
          </ProjectProvider>
        </MessageProvider>
      </TaskProvider>
    </MemberProvider>
  );
};

export default GlobalProjectProvider;
