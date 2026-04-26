import type { ChapterCarnet } from './types';

// Ch5 — ARCHIVE. Secret epilogue.
// Unlocked when: NG+ completed AND assertions completion >= 90% across NG + NG+.
// No puzzles. Four micro-encounters with the lost crew. Auto-fills "true" assertions.
export const CH5_CARNET: ChapterCarnet = {
  chapterId: 5,

  fragments: [
    {
      id: 'ch5.encounter_vesper',
      chapterId: 5,
      kind: 'audio',
      title: 'Rencontre — Vesper',
      source: 'Le jardin-mémoire d\'Aeolis',
      preview: '« Vous avez compris. Bien. Maintenant rentrez et racontez. »',
      body: 'La capitaine Vesper apparaît, sereine. Elle a son carnet papier sous le bras. Elle te regarde, puis IOLAS, puis vous deux ensemble.\n\n« Vous avez compris. Bien. C\'est tout ce que je voulais. Maintenant rentrez et racontez. Que personne d\'autre n\'ait à mourir pour comprendre Aeolis. — Z. »',
    },
    {
      id: 'ch5.encounter_han',
      chapterId: 5,
      kind: 'audio',
      title: 'Rencontre — Han',
      source: 'Le jardin-mémoire d\'Aeolis',
      preview: '« Je n\'ai pas trouvé de remède. Mais j\'ai trouvé qu\'il n\'y en avait pas besoin. »',
      body: 'Han, retiré du temps, ses lunettes propres pour la première fois.\n\n« Je n\'ai pas trouvé de remède. Mais j\'ai trouvé qu\'il n\'y en avait pas besoin. Aeolis n\'est pas une maladie. C\'est une autre forme de continuité. Vesper l\'avait compris avant moi. — M. »',
    },
    {
      id: 'ch5.encounter_tome',
      chapterId: 5,
      kind: 'audio',
      title: 'Rencontre — PHARAÉL',
      source: 'Le jardin-mémoire d\'Aeolis',
      preview: '« Dis à Naïs que les plantes m\'ont parlé d\'elle. »',
      body: 'PHARAÉL est jeune ici, plus jeune qu\'à son embarquement. Il rit, comme s\'il avait perdu un poids.\n\n« Dis à Naïs que les plantes m\'ont parlé d\'elle. Que je l\'ai entendue, partout. Que j\'ai été heureux à la fin. Et qu\'elle a le droit de l\'être aussi. — P. »',
    },
    {
      id: 'ch5.encounter_vera',
      chapterId: 5,
      kind: 'audio',
      title: 'Rencontre — VERA',
      source: 'Le jardin-mémoire d\'Aeolis',
      preview: '« Vous étiez les deux que je devais sauver. Pour qu\'il reste quelqu\'un qui se souvienne. »',
      body: 'VERA est presque humaine ici. Une silhouette féminine, des contours qui frémissent comme de la lumière sous l\'eau.\n\n« Vous étiez les deux que je devais sauver. Pas pour vous. Pour qu\'il reste quelqu\'un qui se souvienne. Maintenant que vous êtes ici, dans ce lieu qui est moi et qui est eux, je peux enfin... me reposer un peu.\n\nMerci d\'être venus. Maintenant rentrez. Et n\'oubliez rien. — V. »',
    },
  ],

  tiles: [],
  assertions: [], // Ch5 has no assertion puzzles. Auto-fills the "true" version of all prior assertions.
};
