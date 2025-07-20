import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { LoaderDots } from '@/components/ui';
import type { MessageComplet } from '@/interfaces';

interface ChatInterfaceProps {
  projectId: number;
  messages: MessageComplet[];
  currentUserId: number;
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  projectId,
  messages,
  currentUserId,
  onSendMessage,
  isLoading = false
}) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gestion de l'envoi de message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(messageText.trim());
      setMessageText('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Gestion de l'appui sur Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Formater la date du message
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      // Aujourd'hui : afficher l'heure
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      // Autre jour : afficher la date
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header du chat */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="tf-text-h4 font-semibold text-tf-night">
          Messages du projet
        </h3>
        <p className="tf-text-small text-gray-500">
          {messages.length} message{messages.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center py-8">
            <LoaderDots size="md" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              💬
            </div>
            <p className="tf-text-base font-medium">Aucun message</p>
            <p className="tf-text-small">Soyez le premier à envoyer un message !</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.id_utilisateur === currentUserId;
            const showAvatar = index === 0 || messages[index - 1].id_utilisateur !== message.id_utilisateur;
            
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar (affiché seulement si c'est un nouveau utilisateur) */}
                <div className="flex-shrink-0">
                  {showAvatar ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white
                      ${isCurrentUser ? 'bg-tf-dodger' : 'bg-tf-fuschia'}`}>
                      {message.auteur?.prenom.charAt(0).toUpperCase() || '?'}
                    </div>
                  ) : (
                    <div className="w-8 h-8" /> // Espace vide pour l'alignement
                  )}
                </div>

                {/* Contenu du message */}
                <div className={`max-w-[70%] ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                  {/* Nom de l'utilisateur et heure (si nouveau message) */}
                  {showAvatar && (
                    <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="tf-text-small font-medium text-gray-600">
                        {isCurrentUser ? 'Vous' : `${message.auteur.prenom} ${message.auteur.nom}`}
                      </span>
                      <span className="tf-text-small text-gray-400">
                        {formatMessageDate(message.date_)}
                      </span>
                    </div>
                  )}

                  {/* Bulle du message */}
                  <div
                    className={`px-3 py-2 rounded-lg max-w-full break-words
                      ${isCurrentUser 
                        ? 'bg-tf-dodger text-white rounded-tr-sm' 
                        : 'bg-gray-100 text-tf-night rounded-tl-sm'
                      }`}
                  >
                    <p className="tf-text-base whitespace-pre-wrap">
                      {message.contenu}
                    </p>
                  </div>

                  {/* Heure pour les messages suivants du même utilisateur */}
                  {!showAvatar && (
                    <p className={`tf-text-small text-gray-400 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {formatMessageDate(message.date_)}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Référence pour l'auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          {/* Champ de saisie */}
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-tf-dodger"
              rows={1}
              style={{ 
                minHeight: '40px',
                maxHeight: '120px',
                resize: 'none'
              }}
              disabled={isSending || isLoading}
            />
            
            {/* Actions dans le champ de saisie */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Ajouter un emoji"
              >
                <Smile size={16} />
              </button>
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Joindre un fichier"
              >
                <Paperclip size={16} />
              </button>
            </div>
          </div>

          {/* Bouton d'envoi */}
          <button
            type="submit"
            disabled={!messageText.trim() || isSending || isLoading}
            className="px-4 py-2 bg-tf-dodger text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSending ? (
              <LoaderDots size="sm" />
            ) : (
              <Send size={16} />
            )}
            {!isSending && (
              <span className="hidden sm:inline">Envoyer</span>
            )}
          </button>
        </form>

        {/* Indication de frappe (optionnel, pour plus tard) */}
        {/* <div className="mt-2 tf-text-small text-gray-500">
          <span>Alice est en train d'écrire...</span>
        </div> */}
      </div>
    </div>
  );
};
