// Interfaces composées qui utilisent plusieurs domaines
import type { Projet, MembreProjet, ProjectStats } from './project';
import type { TacheComplete } from './task';
import type { MessageComplet } from './message';

export interface ProjetComplet extends Projet {
  membres: MembreProjet[];
  taches: TacheComplete[];
  messages: MessageComplet[];
  stats: ProjectStats;
}
