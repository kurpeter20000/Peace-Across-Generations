// Configuration for the content editor (Sveltia CMS) at /admin/cms/.
// Served as JSON (valid YAML) by functions/admin/cms/config.yml.ts, so the
// sign-in URL always matches the address the team is using.
import photoKeys from './photo-keys.json';

export const CMS_REPO = 'kurpeter20000/Peace-Across-Generations';

type Field = Record<string, unknown>;

const date = (name: string, label: string, extra: Field = {}): Field => ({
  name, label, widget: 'datetime', type: 'date', format: 'YYYY-MM-DD', date_format: 'YYYY-MM-DD', time_format: false, ...extra,
});
const draft: Field = {
  name: 'draft', label: 'Draft (not visible on the website)', widget: 'boolean', default: true,
  hint: 'Turn this off to publish. The website updates a few minutes after you save.',
};
const body = (label = 'Text', required = true): Field => ({ name: 'body', label, widget: 'markdown', required });
const contentWarning: Field = { name: 'contentWarning', label: 'Content warning (grief or loss)', widget: 'boolean', default: false, required: false };
const sources = (required: boolean): Field => ({
  name: 'sources', label: 'Sources', label_singular: 'source', widget: 'list', required, min: required ? 1 : 0,
  hint: required ? 'At least one source is required: it will not publish without one.' : 'Required for explainers and Peace Talks.',
  fields: [
    { name: 'label', label: 'Name of the source (publisher, date)', widget: 'string' },
    { name: 'url', label: 'Link', widget: 'string', pattern: ['^https?://', 'Must start with https://'] },
  ],
});
const imageObj = (name: string, label: string, folder: string, withCredit = false): Field => ({
  name, label, widget: 'object', required: false, collapsed: false,
  fields: [
    { name: 'src', label: 'Photo', widget: 'image', required: false, media_folder: `/src/content/${folder}/images`, public_folder: './images' },
    { name: 'alt', label: 'Describe the photo (for people who cannot see it)', widget: 'string', required: false },
    ...(withCredit ? [{ name: 'credit', label: 'Photo credit', widget: 'string', required: false }] : []),
  ],
});
const opt = (values: [string, string][]) => values.map(([value, label]) => ({ value, label }));

const storyTypes = opt([
  ['letter', 'Letter for Peace'], ['poem', 'Poem'], ['song', 'Song'], ['video', 'Video'], ['story', 'Story'],
  ['reflection', 'Reflection'], ['art', 'Art'], ['photo', 'Photo'], ['drama', 'Drama'], ['solidarity', 'Solidarity message'],
  ['episode', 'Conversation episode'], ['ask-an-elder', 'Ask an Elder'], ['younger-self', 'What I’d Tell My Younger Self'],
  ['talk', 'Peace Talk'], ['explainer', 'Peace in 90 Seconds'], ['action-report', 'Peace action'],
]);
const programmes = opt([
  ['creative', 'Youth Creative Peace'], ['clubs', 'Peace Clubs & Circles'], ['talks', 'Peace Talks'],
  ['conversations', 'Generations in Conversation'], ['threads', 'Running threads'],
]);
const voices = opt([
  ['youth', 'Youth'], ['elders', 'Elders'], ['women', 'Women'], ['artists', 'Artists'], ['educators', 'Educators'],
  ['community-leaders', 'Community Leaders'], ['peacebuilders', 'Peacebuilders'], ['diaspora', 'Diaspora'],
]);
const campaignRelation = (name: string, label: string): Field => ({
  name, label, widget: 'relation', collection: 'campaigns', value_field: '{{slug}}', search_fields: ['title', 'month'],
  display_fields: ['{{month}}: {{title}}'], required: false,
});

export function cmsConfig(origin: string) {
  return {
    backend: {
      name: 'github',
      repo: CMS_REPO,
      branch: 'main',
      base_url: origin,
      auth_endpoint: 'admin/cms-auth',
      auth_methods: ['oauth'],
      commit_messages: {
        create: 'Content editor: add {{collection}} “{{slug}}”',
        update: 'Content editor: update {{collection}} “{{slug}}”',
        delete: 'Content editor: delete {{collection}} “{{slug}}”',
        uploadMedia: 'Content editor: upload “{{path}}”',
        deleteMedia: 'Content editor: delete “{{path}}”',
      },
    },
    app_title: 'Peace Across Generations · Content editor',
    logo: { src: '/icon-192.png' },
    site_url: origin,
    display_url: origin,
    media_folder: 'public/uploads',
    public_folder: '/uploads',
    slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-' },
    collections: [
      {
        name: 'posts', label: 'Blog posts', label_singular: 'blog post', icon: 'article',
        description: 'Sourced reports on progress in peace and development. Every post needs at least one source.',
        folder: 'src/content/posts', create: true, extension: 'md', format: 'frontmatter', slug: '{{slug}}',
        summary: '{{title}} · {{date}}', sortable_fields: ['date', 'title'], preview_path: 'blog/{{slug}}',
        fields: [
          { name: 'title', label: 'Headline', widget: 'string' },
          date('date', 'Date'),
          { name: 'summary', label: 'Summary (one or two sentences)', widget: 'text' },
          { name: 'category', label: 'Topic', widget: 'select', options: opt([['peace', 'Peace'], ['development', 'Development'], ['youth', 'Youth'], ['education', 'Education'], ['community', 'Community'], ['culture', 'Culture']]) },
          { name: 'author', label: 'Author', widget: 'string', default: 'Peace Across Generations' },
          { name: 'location', label: 'Place (state or country only)', widget: 'string', required: false },
          imageObj('image', 'Main photo', 'posts', true),
          sources(true),
          contentWarning,
          draft,
          body('Article'),
        ],
      },
      {
        name: 'newsletters', label: 'Newsletters', label_singular: 'newsletter issue', icon: 'mail',
        description: 'Monthly newsletter issues, published on the website. To email them, export subscribers from the admin dashboard.',
        folder: 'src/content/newsletters', create: true, extension: 'md', format: 'frontmatter', slug: '{{year}}-{{month}}-{{slug}}',
        summary: '{{title}} · {{date}}', sortable_fields: ['date', 'title'], preview_path: 'newsletter/{{slug}}',
        fields: [
          { name: 'title', label: 'Title', widget: 'string' },
          date('date', 'Date'),
          { name: 'summary', label: 'Summary', widget: 'text' },
          imageObj('image', 'Header photo', 'newsletters'),
          draft,
          body('Newsletter'),
        ],
      },
      {
        name: 'campaigns', label: 'Campaigns', label_singular: 'campaign', icon: 'campaign',
        description: 'One campaign per month. The website shows the campaign whose dates include today.',
        folder: 'src/content/themes', create: true, extension: 'md', format: 'frontmatter', slug: '{{slug}}',
        summary: '{{month}} · {{title}}', sortable_fields: ['month', 'title'], preview_path: 'campaigns/{{slug}}',
        fields: [
          { name: 'title', label: 'Campaign title', widget: 'string' },
          { name: 'month', label: 'Month (YYYY-MM)', widget: 'string', pattern: ['^\\d{4}-\\d{2}$', 'Use the format 2026-11'] },
          date('startDate', 'Starts'),
          date('endDate', 'Ends'),
          { name: 'stage', label: 'Stage of our approach', widget: 'select', required: false, options: opt([['understand', '01 Understand'], ['unlearn', '02 Unlearn'], ['choose', '03 Choose'], ['lead', '04 Lead'], ['heal', '05 Heal'], ['build', '06 Build']]) },
          { name: 'intro', label: 'Introduction', widget: 'text' },
          { name: 'message', label: 'Campaign message (the question people answer)', widget: 'text', required: false },
          { name: 'creativePrompt', label: 'Creative prompt', widget: 'text' },
          { name: 'keyQuestions', label: 'Key questions', label_singular: 'question', widget: 'list', required: false },
          { name: 'objectives', label: 'Objectives', label_singular: 'objective', widget: 'list', required: false },
          { name: 'contributionTypes', label: 'Ways to contribute', label_singular: 'way', widget: 'list', required: false, hint: 'e.g. Video, Letter, Poetry' },
          { name: 'participation', label: 'How to take part', widget: 'text', required: false },
          { name: 'peaceTalk', label: 'Peace Talk this month', widget: 'string', required: false },
          { name: 'conversationQuestion', label: 'Generations in Conversation question', widget: 'string', required: false },
          { name: 'clubsAndCircles', label: 'Clubs & circles this month', widget: 'string', required: false },
          { name: 'pauseFocus', label: 'Pause Before You Share focus', widget: 'string', required: false },
          {
            name: 'weeklyActions', label: 'Peace Where We Live — weekend actions', label_singular: 'weekend action', widget: 'list', required: false,
            summary: '{{weekOf}}: {{action}}',
            fields: [date('weekOf', 'Weekend of'), { name: 'action', label: 'Action', widget: 'string' }],
          },
          {
            name: 'videos', label: 'Videos (YouTube or Facebook)', label_singular: 'video', widget: 'list', required: false,
            fields: [
              { name: 'platform', label: 'Platform', widget: 'select', options: ['youtube', 'facebook'] },
              { name: 'url', label: 'Video link', widget: 'string' },
              { name: 'title', label: 'Title', widget: 'string' },
            ],
          },
          {
            name: 'gallery', label: 'Photos from our photo library', widget: 'select', multiple: true, required: false, options: photoKeys,
            hint: 'The first photo appears next to the title.',
          },
          {
            name: 'photos', label: 'New photos', label_singular: 'photo', widget: 'list', required: false,
            fields: [
              { name: 'src', label: 'Photo', widget: 'image', media_folder: '/src/content/themes/images', public_folder: './images' },
              { name: 'alt', label: 'Describe the photo', widget: 'string' },
              { name: 'credit', label: 'Photo credit', widget: 'string', required: false },
            ],
          },
          { name: 'impact', label: 'Impact and results (after the month ends — real numbers only)', widget: 'text', required: false },
          { name: 'coreMessage', label: 'Core message', widget: 'string', required: false },
          contentWarning,
          draft,
          body('Extra notes (optional)', false),
        ],
      },
      {
        name: 'stories', label: 'Stories & Voices', label_singular: 'story', icon: 'auto_stories',
        description: 'Published contributions. Only publish with recorded consent — and guardian consent for anyone under 18.',
        folder: 'src/content/stories', create: true, extension: 'md', format: 'frontmatter', slug: '{{slug}}',
        summary: '{{title}} · {{type}} · {{date}}', sortable_fields: ['date', 'title'], preview_path: 'stories/{{slug}}',
        fields: [
          { name: 'title', label: 'Title', widget: 'string' },
          { name: 'type', label: 'Type', widget: 'select', options: storyTypes },
          { name: 'programme', label: 'Programme', widget: 'select', options: programmes, default: 'creative' },
          campaignRelation('theme', 'Campaign'),
          date('date', 'Date'),
          { name: 'contributorDisplayName', label: 'Name to show (only the name the person asked for)', widget: 'string', default: 'Anonymous' },
          { name: 'anonymous', label: 'Show as anonymous', widget: 'boolean', default: false },
          { name: 'contributorCategories', label: 'Voice', widget: 'select', multiple: true, required: false, options: voices },
          { name: 'ageGroup', label: 'Age group', widget: 'select', required: false, options: opt([['under-18', 'Under 18'], ['18-24', '18–24'], ['25-35', '25–35'], ['36-59', '36–59'], ['60-plus', '60 and over']]) },
          { name: 'location', label: 'Location (state or country only — never a village or camp)', widget: 'string', required: false },
          { name: 'language', label: 'Language of the original', widget: 'string', default: 'English' },
          { name: 'englishSummary', label: 'English summary', widget: 'text', required: false },
          { name: 'quote', label: 'Short quote for “Featured voices”', widget: 'string', required: false },
          { name: 'translatedBy', label: 'Translated by', widget: 'string', required: false },
          imageObj('image', 'Photo or artwork', 'stories'),
          {
            name: 'video', label: 'Video', widget: 'object', required: false, collapsed: true,
            fields: [
              { name: 'platform', label: 'Platform', widget: 'select', options: ['youtube', 'facebook'], required: false },
              { name: 'url', label: 'Video link', widget: 'string', required: false },
            ],
          },
          {
            name: 'audio', label: 'Audio', widget: 'object', required: false, collapsed: true,
            fields: [
              { name: 'src', label: 'Audio file (MP3, 48–64 kbps mono)', widget: 'file', required: false, media_folder: '/public/audio', public_folder: '/audio' },
              { name: 'sizeMB', label: 'File size (MB)', widget: 'number', value_type: 'float', required: false },
              { name: 'durationMin', label: 'Length (minutes)', widget: 'number', value_type: 'int', required: false },
            ],
          },
          sources(false),
          { name: 'reflectionQuestion', label: 'One question to reflect on', widget: 'string' },
          { name: 'action', label: 'One action to take', widget: 'string' },
          { name: 'featured', label: 'Feature on the home page', widget: 'boolean', default: false },
          { name: 'creatorOfTheMonth', label: 'Creator of the Month', widget: 'boolean', default: false },
          { name: 'foundingCreator', label: 'Founding Creator', widget: 'boolean', default: false },
          { name: 'submissionRef', label: 'Submission reference (PAG-XXXX-XXXX)', widget: 'string', required: false },
          contentWarning,
          {
            name: 'consent', label: 'Consent check (not shown on the website)', widget: 'object', collapsed: false,
            fields: [
              { name: 'recorded', label: 'Consent recorded', widget: 'boolean', default: false, hint: 'The story will NOT publish unless this is on.' },
              { name: 'guardianConsent', label: 'Guardian consent (under 18)', widget: 'select', options: opt([['n/a', 'Not needed (18 or over)'], ['true', 'Yes, guardian consent recorded'], ['false', 'No']]), default: 'n/a' },
              { name: 'reviewedBy2', label: 'Reviewed by two people', widget: 'boolean', default: false },
            ],
          },
          draft,
          body('Text of the piece (or its summary)'),
        ],
      },
      {
        name: 'resources', label: 'Resources', label_singular: 'resource', icon: 'library_books',
        folder: 'src/content/resources', create: true, extension: 'md', format: 'frontmatter', slug: '{{slug}}',
        summary: '{{title}} · {{type}}', sortable_fields: ['title'],
        fields: [
          { name: 'title', label: 'Title', widget: 'string' },
          { name: 'type', label: 'Type', widget: 'select', options: ['article', 'research', 'guide', 'book', 'video', 'toolkit', 'podcast'] },
          { name: 'summary', label: 'Summary', widget: 'text' },
          { name: 'url', label: 'Link (or a page on this site, e.g. /pause-before-you-share/)', widget: 'string' },
          { name: 'publisher', label: 'Publisher', widget: 'string', required: false },
          { name: 'year', label: 'Year', widget: 'number', value_type: 'int', required: false },
          { name: 'language', label: 'Language', widget: 'string', default: 'English' },
          { name: 'size', label: 'Download size (e.g. PDF · 2 MB)', widget: 'string', required: false },
          { name: 'featured', label: 'Featured', widget: 'boolean', default: false },
          draft,
          body('Notes (optional)', false),
        ],
      },
      {
        name: 'events', label: 'Events', label_singular: 'event', icon: 'event',
        folder: 'src/content/events', create: true, extension: 'md', format: 'frontmatter', slug: '{{year}}-{{month}}-{{slug}}',
        summary: '{{date}} · {{title}}', sortable_fields: ['date', 'title'],
        fields: [
          { name: 'title', label: 'Event name', widget: 'string' },
          date('date', 'Date'),
          { name: 'time', label: 'Time (Juba time, e.g. 18:00)', widget: 'string', required: false },
          { name: 'online', label: 'Online event', widget: 'boolean', default: true },
          { name: 'location', label: 'City or state (in-person events)', widget: 'string', required: false },
          { name: 'summary', label: 'Summary', widget: 'text' },
          campaignRelation('campaign', 'Related campaign'),
          { name: 'registrationUrl', label: 'Registration link', widget: 'string', required: false },
          draft,
          body('Details (optional)', false),
        ],
      },
      {
        name: 'talks', label: 'Peace Talks', label_singular: 'Peace Talk', icon: 'mic',
        folder: 'src/content/talks', create: true, extension: 'md', format: 'frontmatter', slug: '{{year}}-{{month}}',
        summary: '{{month}} · {{topic}}', sortable_fields: ['month'],
        fields: [
          { name: 'title', label: 'Title', widget: 'string' },
          { name: 'month', label: 'Month (YYYY-MM)', widget: 'string', pattern: ['^\\d{4}-\\d{2}$', 'Use the format 2026-11'] },
          date('date', 'Date', { required: false }),
          { name: 'time', label: 'Time (Juba time)', widget: 'string', required: false },
          { name: 'topic', label: 'Topic', widget: 'string' },
          { name: 'skill', label: 'Skill', widget: 'string', required: false },
          { name: 'speaker', label: 'Speaker', widget: 'string', default: 'TBD' },
          { name: 'coHost', label: 'Young co-host', widget: 'string', default: 'TBD' },
          { name: 'facebookLiveUrl', label: 'Facebook Live link', widget: 'string', required: false },
          { name: 'status', label: 'Status', widget: 'select', options: ['upcoming', 'live', 'recorded'], default: 'upcoming' },
          { name: 'recording', label: 'Recording (e.g. stories/peace-talk-october)', widget: 'string', required: false },
          body('Notes (optional)', false),
        ],
      },
      {
        name: 'team', label: 'Our team', label_singular: 'team member', icon: 'groups',
        folder: 'src/content/team', create: true, extension: 'md', format: 'frontmatter', slug: '{{slug}}',
        summary: '{{order}}. {{role}} — {{name}}', sortable_fields: ['order'],
        fields: [
          { name: 'order', label: 'Order on the page', widget: 'number', value_type: 'int' },
          { name: 'role', label: 'Role', widget: 'string' },
          { name: 'open', label: 'Role is open (show “Volunteer with us”)', widget: 'boolean', default: true },
          { name: 'name', label: 'Name', widget: 'string', required: false },
          { name: 'bio', label: 'Bio (60–80 words)', widget: 'text', required: false },
          { name: 'photo', label: 'Photo', widget: 'image', required: false, media_folder: '/src/content/team/images', public_folder: './images' },
          body('Notes (optional)', false),
        ],
      },
      {
        name: 'contributors', label: 'Contributor profiles', label_singular: 'profile', icon: 'person',
        description: 'Public profiles — only with the person’s written consent.',
        folder: 'src/content/contributors', create: true, extension: 'md', format: 'frontmatter', slug: '{{slug}}',
        fields: [
          { name: 'name', label: 'Name the person chose to show', widget: 'string' },
          { name: 'categories', label: 'Voice', widget: 'select', multiple: true, required: false, options: voices },
          { name: 'location', label: 'State or country', widget: 'string', required: false },
          { name: 'bio', label: 'Bio (in their own words)', widget: 'text' },
          imageObj('photo', 'Photo', 'contributors'),
          { name: 'links', label: 'Links', widget: 'list', required: false, fields: [{ name: 'label', label: 'Label', widget: 'string' }, { name: 'url', label: 'Link', widget: 'string' }] },
          { name: 'profileConsent', label: 'The person gave written consent for this profile', widget: 'boolean', default: false },
          draft,
          body('Notes (optional)', false),
        ],
      },
    ],
    singletons: [
      {
        name: 'site', label: 'Site settings', icon: 'settings', file: 'src/data/site.json', format: 'json',
        fields: [
          { name: 'name', label: 'Name', widget: 'string' },
          { name: 'tagline', label: 'Tagline', widget: 'string' },
          { name: 'slogan', label: 'Second line', widget: 'string' },
          { name: 'positioning', label: 'Positioning', widget: 'text' },
          { name: 'description', label: 'Description for search engines', widget: 'text' },
          { name: 'email', label: 'Public email', widget: 'object', fields: [{ name: 'user', label: 'Before @', widget: 'string' }, { name: 'domain', label: 'After @', widget: 'string' }] },
          { name: 'whatsapp', label: 'WhatsApp number (with country code, e.g. +211…)', widget: 'string', required: false },
          { name: 'introVideo', label: 'Home page video', widget: 'object', required: false, fields: [{ name: 'platform', label: 'Platform', widget: 'select', options: ['youtube', 'facebook'] }, { name: 'url', label: 'Video link', widget: 'string' }] },
          { name: 'youthCreativeForm', label: 'Youth Creative Peace Google Form link', widget: 'string', required: false },
          { name: 'safeguardingEmail', label: 'Safeguarding email', widget: 'object', required: false, fields: [{ name: 'user', label: 'Before @', widget: 'string', required: false }, { name: 'domain', label: 'After @', widget: 'string', required: false }] },
          {
            name: 'socials', label: 'Social media', widget: 'object',
            fields: ['facebook', 'instagram', 'youtube', 'linkedin', 'tiktok', 'x'].map((n) => ({ name: n, label: n === 'x' ? 'X (Twitter)' : n[0].toUpperCase() + n.slice(1), widget: 'string', required: false })),
          },
          { name: 'commitment', label: '3,000 Days (do not change)', widget: 'object', collapsed: true, fields: [{ name: 'start', label: 'Start', widget: 'string' }, { name: 'end', label: 'End', widget: 'string' }, { name: 'totalDays', label: 'Days', widget: 'number', value_type: 'int' }, { name: 'timezone', label: 'Time zone', widget: 'string' }] },
          { name: 'pilot', label: 'Pilot dates (do not change)', widget: 'object', collapsed: true, fields: [{ name: 'start', label: 'Start', widget: 'string' }, { name: 'end', label: 'End', widget: 'string' }] },
        ],
      },
      {
        name: 'progress', label: 'Pilot progress', icon: 'monitoring', file: 'src/data/pilot-progress.json', format: 'json',
        fields: [
          date('lastUpdated', 'Last updated'),
          {
            name: 'indicators', label: 'Indicators', label_singular: 'indicator', widget: 'list', summary: '{{indicator}}: {{current}} / {{target}}',
            fields: [{ name: 'indicator', label: 'Indicator', widget: 'string' }, { name: 'target', label: 'Target', widget: 'string' }, { name: 'current', label: 'So far (real, counted numbers only)', widget: 'string' }],
          },
        ],
      },
      {
        name: 'clubs', label: 'Clubs & circles status', icon: 'school', file: 'src/data/pilot-status.json', format: 'json',
        fields: [{ name: 'clubsAndCircles', label: 'Status text', widget: 'text' }],
      },
      {
        name: 'corrections', label: 'Corrections log', icon: 'fact_check', file: 'src/data/corrections.json', format: 'json',
        fields: [{
          name: 'items', label: 'Corrections', label_singular: 'correction', widget: 'list', root: true, required: false,
          fields: [date('date', 'Date'), { name: 'item', label: 'What was corrected', widget: 'string' }, { name: 'change', label: 'What changed', widget: 'text' }],
        }],
      },
      {
        name: 'founders', label: 'Founding Creators wall', icon: 'military_tech', file: 'src/data/founding-creators.json', format: 'json',
        fields: [{ name: 'names', label: 'Names (opt-in only)', label_singular: 'name', widget: 'list', root: true, required: false }],
      },
    ],
  };
}
