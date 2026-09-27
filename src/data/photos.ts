// Every photo used on the site, with alt text and credit.
// Files are web-ready copies made by `npm run photos` from /images.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });
const img = (name: string) => {
  const f = files[`../assets/photos/${name}.jpg`];
  if (!f) throw new Error(`Photo not found: ${name}. Run npm run photos.`);
  return f.default;
};

export interface Photo { src: ImageMetadata; alt: string; credit?: string }
const p = (name: string, alt: string, credit?: string): Photo => ({ src: img(name), alt, credit });
const unsplash = (who: string) => `Photo: ${who} / Unsplash`;

export const photos = {
  founderPortrait: p('founder-portrait', 'Kur Peter Thon Aduot, founder of Peace Across Generations, in a grey suit'),
  founderSpeaking: p('founder-speaking', 'The founder speaking to a room of young people'),
  founderListening: p('founder-listening', 'The founder listening closely during a discussion'),
  founderAtEvent: p('founder-at-event', 'The founder with a guest at an event'),
  fieldVisit: p('field-visit', 'Team members on a field visit beside a vehicle on a muddy road'),
  groupWithBooklets: p('group-with-booklets', 'Young people and adults holding up booklets outside a building'),
  footballMatch1: p('football-match-1', 'Children playing football on a dusty field'),
  footballMatch2: p('football-match-2', 'Children playing football together in the afternoon light'),
  footballMatch3: p('football-match-3', 'A football game on a wide open field'),
  footballMatch4: p('football-match-4', 'Children running after the ball on a sandy pitch'),
  footballDuel: p('football-duel', 'Two boys challenging for the ball'),
  footballTeam1: p('football-team-1', 'A large group of young footballers posing together with their ball'),
  footballTeam2: p('football-team-2', 'Young footballers gathered for a team photo'),
  footballTeam3: p('football-team-3', 'A team of young players smiling for the camera'),
  footballTeamSmall: p('football-team-small', 'Six young footballers with their ball'),
  footballTeamKneeling1: p('football-team-kneeling-1', 'Six boys in football shirts, three standing and three kneeling around a ball'),
  footballTeamKneeling2: p('football-team-kneeling-2', 'Young footballers posing with a worn football'),
  studentsWriting: p('students-writing', 'Two students writing together at a table'),
  workshop1: p('workshop-room-1', 'Young people at a workshop around long blue tables'),
  workshop2: p('workshop-room-2', 'A full workshop room, with a presentation on the screen'),
  workshopDiscussion: p('workshop-discussion', 'Young participants in discussion at a workshop'),
  workshop3: p('workshop-room-3', 'Participants listening at a workshop'),
  workshopGroup: p('workshop-group', 'Workshop participants in a group photo outside'),
  certificatesGroup1: p('certificates-group-1', 'Young people holding their certificates in a group photo'),
  certificatesStudents: p('certificates-students', 'Students holding certificates in front of a school building'),
  certificatesGroup2: p('certificates-group-2', 'A large group holding certificates after a programme'),
  handsGenerations: p('hands-together-generations', 'Hands of different ages joined together, black and white'),
  handsSunset: p('hands-joined-sunset', 'Silhouettes of people holding hands at sunset'),
  childrenTugOfWar: p('children-tug-of-war', 'Silhouettes of children playing tug of war at sunset'),
  peaceSignSunset: p('peace-sign-sunset', 'A hand making the peace sign against the setting sun'),
  peaceWatercolour: p('peace-watercolour', 'The word PEACE on a blue watercolour splash'),
  peaceInHands: p('peace-in-hands', 'Two hands holding the word PEACE, drawn illustration'),
  doveAndEarth: p('dove-and-earth', 'A white dove flying towards a hand holding the Earth'),
  megaphone: p('young-woman-megaphone', 'A young woman speaking through a megaphone among people holding signs'),
  noWarFence: p('no-war-sign-fence', 'A hand-made “No war” sign held against a wire fence'),
  peaceSignNight: p('peace-sign-night', 'A glowing peace sign in the dark above tall grass', unsplash('Candice Seplow')),
  unityInDiversity: p('unity-in-diversity', '“Unity in diversity” painted in red on a concrete wall', unsplash('Claudio Schwarz')),
  stopWar: p('stop-war-sign', 'A young woman holding a “Stop war, peace now” sign', unsplash('ev')),
  loveCrowd: p('love-crowd-beach', 'People on a beach spelling LOVE with surfboards, seen from above', unsplash('James Lee')),
  noWarPoster: p('no-war-poster', 'A yellow poster reading “No war” with a peace sign', unsplash('Suga Suga')),
  doveStencil: p('dove-stencil-imagine-peace', 'Stencil of a dove over a rifle with the words “Imagine peace”', unsplash('Zaur Ibrahimov')),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
