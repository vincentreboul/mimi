// 12 silent achievement badges. Tracked in save.achievements (string ids).
// Granted by game systems calling addAchievement(id) when conditions met.

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;          // emoji or sprite key
  hidden?: boolean;      // hidden until unlocked (don't reveal title)
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_wake',
    title: 'Premier réveil',
    description: 'Compléter le chapitre Cryo.',
    icon: '❄️',
  },
  {
    id: 'garden_remembers',
    title: 'Le jardin se souvient',
    description: 'Compléter la Serre avec tous les sous-puzzles résolus.',
    icon: '🌱',
  },
  {
    id: 'mechanic_hands',
    title: 'Mains de mécanicien',
    description: 'Trouver le voice memo d\'IOLAS.',
    icon: '🛠️',
  },
  {
    id: 'starlit_eye',
    title: 'Œil étoilé',
    description: 'Compléter la Coupole.',
    icon: '🔭',
  },
  {
    id: 'first_return',
    title: 'Premier retour',
    description: 'Atteindre une fin — quelle qu\'elle soit.',
    icon: '🚪',
  },
  {
    id: 'partial_truth',
    title: 'Vérité partielle',
    description: 'Compléter NG+ (côté IOLAS).',
    icon: '📖',
    hidden: true,
  },
  {
    id: 'archive',
    title: 'ARCHIVE',
    description: 'Découvrir la zone secrète.',
    icon: '📚',
    hidden: true,
  },
  {
    id: 'botanist',
    title: 'Botaniste',
    description: 'Trouver toutes les plantes cachées de la Serre.',
    icon: '🌿',
  },
  {
    id: 'lumira_song',
    title: 'Lumira',
    description: 'Déclencher le chant de Lumira.',
    icon: '🎵',
  },
  {
    id: 'unaided',
    title: 'Sans aide',
    description: 'Compléter un chapitre en mode ARCHIVISTE.',
    icon: '🕯️',
  },
  {
    id: 'full_carnet',
    title: 'Carnet complet',
    description: '100 % d\'assertions résolues, secrets et révisions inclus.',
    icon: '📔',
  },
  {
    id: 'companions',
    title: 'Compagnons',
    description: 'Compléter ARCHIVE et déclencher chaque mémoire.',
    icon: '🤝',
    hidden: true,
  },
];

export function getAchievement(id: string): Achievement | null {
  return ACHIEVEMENTS.find((a) => a.id === id) ?? null;
}
