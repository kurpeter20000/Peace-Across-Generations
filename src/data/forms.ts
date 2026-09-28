// Options shared by the website forms and the server handlers in /functions,
// so what the form offers and what the server accepts never drift apart.

export const ageRanges = [
  { value: 'under-18', label: 'Under 18' },
  { value: '18-24', label: '18–24' },
  { value: '25-35', label: '25–35' },
  { value: '36-59', label: '36–59' },
  { value: '60-plus', label: '60 and over' },
] as const;

export const contributionTypes = [
  { value: 'video', label: 'Video' },
  { value: 'letter', label: 'Letter' },
  { value: 'poetry', label: 'Poetry' },
  { value: 'song', label: 'Song' },
  { value: 'story', label: 'Story' },
  { value: 'artwork', label: 'Artwork or photo' },
  { value: 'drama', label: 'Drama or skit' },
  { value: 'reflection', label: 'Personal reflection' },
  { value: 'elder-interview', label: 'Interview with an elder' },
  { value: 'peace-action', label: 'Report of a peace action' },
] as const;

export const enquiryTypes = ['volunteer', 'ambassador', 'partner', 'contact'] as const;

export const volunteerInterests = [
  'Translation', 'Captions and subtitles', 'Recruiting contributors', 'Documenting approved actions',
  'Audio and video editing', 'Design and illustration', 'Social media', 'Research and fact-checking',
] as const;

export const contributorRoles = [
  'Writer or poet', 'Musician', 'Visual artist or photographer', 'Filmmaker', 'Actor or drama group',
  'Elder or storyteller', 'Interviewer of elders', 'Educator', 'Community leader', 'Peacebuilder', 'Diaspora voice',
] as const;

export const submissionStatuses = ['submitted', 'pending_review', 'approved', 'rejected', 'published'] as const;
export type SubmissionStatus = (typeof submissionStatuses)[number];

/** Upload rules. Larger videos: send a link (YouTube, Google Drive) or use WhatsApp. */
export const upload = {
  maxBytes: 50 * 1024 * 1024,
  extensions: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'gif', 'mp3', 'm4a', 'aac', 'ogg', 'opus', 'wav', 'mp4', 'mov', '3gp', 'webm', 'pdf', 'doc', 'docx', 'txt'],
} as const;
