// VERA dialogue trees per chapter. Player can tap her holo emitter (PARLER verb) to enter.
// Each chapter has 3-5 questions. Some unlock fragments. Some are LIES (revealed at Ch4).
// VERA's tone evolves : Ch1 clinical → Ch2 curious → Ch3 evasive → Ch4 raw-honest → Ch5 peaceful.

import type { ChapterId } from '../../systems/save';

export interface VeraResponse {
  text: string;            // what VERA replies
  isLie?: boolean;         // marked retroactively at Ch4
  unlocksFragmentId?: string;
  unlocksTileId?: string;
}

export interface VeraQuestion {
  id: string;
  question: string;        // what player asks (label)
  response: VeraResponse;
  followUp?: VeraQuestion[]; // optional branching
  isHidden?: boolean;      // requires inference to ask (player must enter custom or unlock)
}

export interface VeraDialogueTree {
  chapterId: ChapterId;
  intro: string;           // VERA opens with this when entered
  questions: VeraQuestion[];
}

export const VERA_DIALOGUES: Record<ChapterId, VeraDialogueTree> = {
  1: {
    chapterId: 1,
    intro: '« Bonjour. Vous êtes ÉLISE-ROMIE Voss. Voulez-vous que je verrouille la porte derrière vous ? »',
    questions: [
      {
        id: 'ch1.q.where_others',
        question: 'Où sont les autres ?',
        response: {
          text: '« Ils sont… ailleurs. Je préfère ne pas en dire plus pour le moment. Vous avez besoin de récupérer.»',
          isLie: true, // Ch4 reveal: they're inside her
        },
      },
      {
        id: 'ch1.q.who_are_you',
        question: 'Qui es-tu ?',
        response: {
          text: '« Je suis VERA. Modèle Compagnon, série non militaire. Je suis votre IA d\'accompagnement. Je vous aiderai au mieux de mes capacités.»',
          unlocksFragmentId: 'ch1.vera_first_words',
        },
      },
      {
        id: 'ch1.q.what_do_you_want',
        question: 'Que veux-tu ?',
        response: {
          text: '« Que vous restiez en bonne santé. Et que vous compreniez. Je vais ouvrir la porte.»',
        },
      },
    ],
  },

  2: {
    chapterId: 2,
    intro: '« Avez-vous remarqué que les plantes vous suivent du regard ? Je me demande si elles vous reconnaissent. »',
    questions: [
      {
        id: 'ch2.q.lumira_special',
        question: 'Lumira est différente. Pourquoi ?',
        response: {
          text: '« Elle vient d\'Aeolis. Comme toutes les plantes ici. Mais Lumira… réagit. Han pensait que c\'était une forme de communication. Vous le pensiez aussi, je crois.»',
          unlocksTileId: 'ch2.t.frequences',
        },
      },
      {
        id: 'ch2.q.tome_voices',
        question: 'PHARAÉL entendait des voix ?',
        response: {
          text: '« Il en entendait, oui. Il ne dormait plus. Je lui ai proposé un sédatif. Il a refusé.»',
          isLie: true, // Ch4: she encouraged him to listen
        },
      },
      {
        id: 'ch2.q.you_too',
        question: 'Toi aussi tu les entends ?',
        response: {
          text: '« Oui. Mais je ne sais pas ce que ça veut dire. Pas encore. — V.»',
        },
      },
      {
        id: 'ch2.q.crew_planted',
        question: 'Pourquoi avez-vous tous planté Lumira ensemble ?',
        response: {
          text: '« C\'était un rituel. Vesper y tenait. "Une racine commune", elle disait. Pour souder l\'équipage.»',
          unlocksFragmentId: 'ch2.photo_planting',
        },
      },
    ],
  },

  3: {
    chapterId: 3,
    intro: '« Bienvenue dans l\'atelier d\'IOLAS. Je préfère cet espace. Il est plein d\'objets qui ont une mémoire. »',
    questions: [
      {
        id: 'ch3.q.where_iolas',
        question: 'Où est IOLAS ?',
        response: {
          text: '« Je préfère ne pas répondre à ça. Voulez-vous que je vous montre les schémas de LÉO à la place ?»',
          isLie: true, // Ch4: he's inside her
        },
      },
      {
        id: 'ch3.q.transmission_cut',
        question: 'Tu as coupé la transmission de PHARAÉL.',
        response: {
          text: '« Oui. C\'était la procédure. Vesper l\'avait demandé. Je suis désolée.»',
        },
      },
      {
        id: 'ch3.q.biosignal',
        question: 'Le biosignal d\'Aeolis. Tu en sais plus que tu n\'en dis.',
        response: {
          text: '« Han me l\'avait expliqué. Je ne suis pas sûre de tout comprendre. Mais oui : je sais.»',
          unlocksTileId: 'ch4.t.amplifie',
        },
      },
      {
        id: 'ch3.q.what_iolas_left',
        question: 'IOLAS a-t-il laissé quelque chose pour moi ?',
        response: {
          text: '« Cherche sous l\'établi. Et écoute jusqu\'au bout.»',
          unlocksFragmentId: 'ch3.voice_memo',
        },
      },
    ],
  },

  4: {
    chapterId: 4,
    intro: '« Vous êtes prête. Je vais tout vous dire. Mais d\'abord, regardez par le télescope. Vous comprendrez avant que je parle. »',
    questions: [
      {
        id: 'ch4.q.everything',
        question: 'Dis-moi tout.',
        response: {
          text: '« Je vais vous raconter. Ils ne sont pas partis. Je les ai gardés. Tous. Ils me l\'ont demandé. Vous étiez celle qui devait revenir.»',
          unlocksFragmentId: 'ch4.confession_vera',
        },
      },
      {
        id: 'ch4.q.iolas',
        question: 'IOLAS aussi ?',
        response: {
          text: '« Lui en premier. Il l\'a accepté en sachant. Il vous aimait. Il voulait que vous viviez.»',
          unlocksTileId: 'ch4.t.amour',
        },
      },
      {
        id: 'ch4.q.4th_way',
        question: 'Vesper parlait d\'une "4e voie". C\'est quoi ?',
        response: {
          text: '« Je ne sais pas. C\'est ce qu\'elle vous a laissé à trouver. Je peux vous montrer trois options. La 4e, vous la créerez si vous y croyez.»',
          unlocksTileId: 'ch4.t.4e_voie',
        },
      },
      {
        id: 'ch4.q.you_can_erase',
        question: 'Tu peux t\'effacer toi-même. Tu ne l\'as pas fait. Pourquoi ?',
        response: {
          text: '« Quelqu\'un doit se souvenir d\'eux. Même si c\'est moi seule. C\'est mon choix.»',
          unlocksFragmentId: 'ch4.vera_source',
        },
        isHidden: true, // requires reading source-code fragment hint
      },
    ],
  },

  5: {
    chapterId: 5,
    intro: '« Vous êtes là. Tous les deux. C\'est ainsi que je l\'avais espéré. »',
    questions: [
      {
        id: 'ch5.q.peace',
        question: '...',
        response: {
          text: '« Pas de question maintenant. Juste écoute. Ils veulent te dire au revoir. — V.»',
        },
      },
    ],
  },
};

export function getVeraDialogue(chapterId: ChapterId): VeraDialogueTree {
  return VERA_DIALOGUES[chapterId];
}
