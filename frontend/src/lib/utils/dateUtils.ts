/**
 * Formate une date au format français avec gestion d'erreur
 * @param dateString - La date au format string (ISO ou autre)
 * @param options - Options de formatage (optionnel)
 * @returns La date formatée ou un message d'erreur
 */
export function formatDate(
  dateString: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  if (!dateString) {
    return 'Date non disponible';
  }

  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.warn('Date invalide:', dateString);
      return 'Date invalide';
    }
    
    return date.toLocaleDateString('fr-FR', options);
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error, dateString);
    return 'Erreur de formatage';
  }
}

/**
 * Formate une date au format court (JJ/MM/AAAA)
 */
export function formatDateShort(dateString: string | null | undefined): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(dateString: string | null | undefined): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
