// Interfaces liées aux messages

export interface Message {
  id: number;
  contenu: string;
  date_: string;
  id_projet: number;
  id_utilisateur: number;
}

export interface MessageComplet extends Message {
  auteur: {
    id: number;
    prenom: string;
    nom: string;
  };
  reponses?: MessageComplet[];
}
