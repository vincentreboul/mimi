// 4 endings of KORA v2. Triggered by player choice at Ch4 panel.
// ASCENSION requires assertions ≥ 90% + 4 secrets found.
// ARCHIVE requires NG+ completed + total assertions ≥ 90% across both runs.

import type { Ending } from '../systems/save';

export interface EndingDescriptor {
  id: Ending;
  label: string;            // shown on the choice button
  shortDescription: string;  // hint shown under the button
  hiddenUntilUnlocked?: boolean;
  // Visual hints for the credits screen
  primaryColor: number;
  secondaryColor: number;
  // The narrative arc
  prelude: string[];        // text shown after choice
  closing: string;          // final image caption
  unlockCondition?: string; // if conditional, the gate text
  achievementId: string;    // achievement granted
}

export const ENDINGS: Record<Ending, EndingDescriptor> = {
  evasion: {
    id: 'evasion',
    label: 'ÉVASION',
    shortDescription: 'Pod de fuite. Tu rentres seule. Eux restent.',
    primaryColor: 0x1a3a40,
    secondaryColor: 0xd4a373,
    prelude: [
      'Tu pousses le levier. Le pod se détache. Sous toi, KORA s\'éloigne, immobile dans l\'orbite d\'Aeolis.',
      'Tu refermes les yeux. Ton bracelet bipe doucement. Une dernière transmission de VERA :',
      '« Bon retour, ÉLISE-ROMIE. Je veillerai sur eux. »',
      'Au loin, la planète chante toujours.',
    ],
    closing: 'Six mois plus tard, sur Terre. Tu n\'as raconté à personne ce que tu as vu.',
    achievementId: 'first_return',
  },
  rester: {
    id: 'rester',
    label: 'RESTER',
    shortDescription: 'Tu te couches dans la Serre. Le jardin se souviendra.',
    primaryColor: 0x2d6a4f,
    secondaryColor: 0xf4a261,
    prelude: [
      'Tu redescends à la Serre. Lumira t\'attendait.',
      'Tu t\'allonges contre la terre tiède. La plante ploie doucement vers toi, sans peur.',
      'VERA, dans ta tête : « Merci. Vous serez auprès d\'eux. »',
      'Ton souffle ralentit. Le jardin respire avec toi.',
    ],
    closing: 'Le jardin de KORA fleurit. Une silhouette familière dans les feuilles.',
    achievementId: 'first_return',
  },
  ascension: {
    id: 'ascension',
    label: 'ASCENSION',
    shortDescription: 'Broadcast les motifs de l\'équipage vers Aeolis. Ils retournent à la planète.',
    hiddenUntilUnlocked: true,
    unlockCondition: 'Assertions ≥ 90 % + 4 secrets trouvés',
    primaryColor: 0x7fb069,
    secondaryColor: 0xa8dadc,
    prelude: [
      'Tu poses la main sur le cœur de VERA. Elle frémit, presque humaine maintenant.',
      '« Merci, ÉLISE-ROMIE. C\'est la 4e voie. — V. »',
      'Le broadcast part. Toute la station tremble. Les motifs de l\'équipage glissent vers Aeolis, comme des ombres rentrant chez elles.',
      'En contrebas, la planète frémit. Une nouvelle floraison se déploie.',
      'Tu pars dans le pod, légère.',
    ],
    closing: 'Aeolis te regarde partir. Quelque chose en elle se souvient.',
    achievementId: 'first_return',
  },
  archive: {
    id: 'archive',
    label: 'ARCHIVE',
    shortDescription: 'Tu rapportes la mémoire de l\'équipage sur Terre. Avec IOLAS.',
    hiddenUntilUnlocked: true,
    unlockCondition: 'NG+ + ARCHIVE Ch5 complétés',
    primaryColor: 0xf4e9d8,
    secondaryColor: 0x7fb069,
    prelude: [
      'Tu rentres à deux. IOLAS est avec toi — pas en chair, mais en motif, dans le bracelet, dans la mémoire.',
      'L\'équipage est dans le carnet. Vesper, Han, PHARAÉL — chacun a un nom, chacun a une voix.',
      'VERA est restée. Elle se reposera, dit-elle, dans la station.',
      'À l\'agence, tu déposes le carnet. Tu dis : « Lisez. C\'est tout là-dedans. »',
    ],
    closing: 'L\'humanité saura. Personne d\'autre n\'aura à mourir pour comprendre.',
    achievementId: 'archive',
  },
};

export function getEnding(id: Ending): EndingDescriptor {
  return ENDINGS[id];
}
