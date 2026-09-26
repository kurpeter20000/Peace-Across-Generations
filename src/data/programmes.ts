// The four core programmes, their colour tags (brief §4.4) and home-page lines.
export const programmes = [
  {
    key: 'creative',
    title: 'Youth Creative Peace',
    href: '/programmes/youth-creative-peace/',
    icon: 'pen',
    line: 'Turn your poem, song, drawing, photo or letter into a public message for peace.',
  },
  {
    key: 'clubs',
    title: 'Peace Clubs & Community Circles',
    href: '/programmes/peace-clubs-and-circles/',
    icon: 'circle',
    line: 'A regular, supervised place for young people to practise peace face to face.',
  },
  {
    key: 'talks',
    title: 'Peace Talks',
    href: '/programmes/peace-talks/',
    icon: 'mic',
    line: 'One expert, one live conversation, every month — free, and small enough to share on WhatsApp.',
  },
  {
    key: 'conversations',
    title: 'Generations in Conversation',
    href: '/programmes/generations-in-conversation/',
    icon: 'generations',
    line: 'Young people ask. Elders answer. Together they decide what to pass on and what ends with them.',
  },
] as const;

export type ProgrammeKey = (typeof programmes)[number]['key'] | 'threads';

export const programmeNames: Record<ProgrammeKey, string> = {
  creative: 'Youth Creative Peace',
  clubs: 'Peace Clubs & Circles',
  talks: 'Peace Talks',
  conversations: 'Generations in Conversation',
  threads: 'Running threads',
};
