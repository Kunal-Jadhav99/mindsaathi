// ============================================================
// Mock Data — replace with Firebase Firestore in production
// ============================================================

export const MOCK_USER = {
  uid: 'u001',
  email: 'student@college.edu',
  pseudonym: 'QuietOwl42',
  avatarColor: '#7c6af7',
  streak: 9,
  joinedAt: '2026-07-01',
  role: 'student',
};

// Check-in history — intentionally trending upward to demo escalation
export const MOCK_CHECKINS = [
  { id: 'ci5', date: '2026-08-16', phq9Score: 14, gad7Score: 13, phq9Q9Score: 0, riskLevel: 'medium', mood: 'bad',   journalSnippet: 'Feeling overwhelmed with upcoming exams...' },
  { id: 'ci4', date: '2026-08-09', phq9Score: 11, gad7Score: 10, phq9Q9Score: 0, riskLevel: 'medium', mood: 'okay',  journalSnippet: 'Hard to concentrate lately.' },
  { id: 'ci3', date: '2026-08-02', phq9Score: 8,  gad7Score: 7,  phq9Q9Score: 0, riskLevel: 'low',    mood: 'okay',  journalSnippet: 'Managing okay but tired.' },
  { id: 'ci2', date: '2026-07-26', phq9Score: 6,  gad7Score: 5,  phq9Q9Score: 0, riskLevel: 'low',    mood: 'good',  journalSnippet: 'Had a good week overall.' },
  { id: 'ci1', date: '2026-07-19', phq9Score: 4,  gad7Score: 3,  phq9Q9Score: 0, riskLevel: 'low',    mood: 'great', journalSnippet: 'Feeling motivated!' },
];

export const MOCK_FORUM_POSTS = [
  {
    id: 'fp1',
    pseudonym: 'SilentMountain7',
    avatarColor: '#4ade80',
    content: "Anyone else finding it impossible to sleep before exams? I've been lying awake for hours with racing thoughts. Nothing seems to help.",
    timestamp: '2026-08-16T14:22:00Z',
    likes: 18, replies: 6,
    tags: ['exam stress', 'sleep'],
    moderationStatus: 'approved',
  },
  {
    id: 'fp2',
    pseudonym: 'DriftingCloud11',
    avatarColor: '#60a5fa',
    content: 'Started doing the 4-7-8 breathing exercise from the resources section. Genuinely helped me calm down during a panic moment today.',
    timestamp: '2026-08-16T11:05:00Z',
    likes: 32, replies: 9,
    tags: ['breathing', 'coping'],
    moderationStatus: 'approved',
  },
  {
    id: 'fp3',
    pseudonym: 'WanderingReed23',
    avatarColor: '#fbbf24',
    content: "Does anyone else feel guilty for taking a break? Like every time I rest I feel like I'm falling behind everyone else.",
    timestamp: '2026-08-15T20:11:00Z',
    likes: 44, replies: 14,
    tags: ['burnout', 'guilt'],
    moderationStatus: 'approved',
  },
  {
    id: 'fp4',
    pseudonym: 'StormyPebble99',
    avatarColor: '#fb923c',
    content: 'This post is being reviewed by our moderation system before it appears publicly.',
    timestamp: '2026-08-15T16:45:00Z',
    likes: 0, replies: 0,
    tags: [],
    moderationStatus: 'pending',
  },
  {
    id: 'fp5',
    pseudonym: 'CalmRiver55',
    avatarColor: '#a78bfa',
    content: 'Booked a counsellor session through the app. Was nervous but the counsellor was really understanding. If you\'re on the fence, just do it.',
    timestamp: '2026-08-14T09:30:00Z',
    likes: 67, replies: 21,
    tags: ['counselling', 'hope'],
    moderationStatus: 'approved',
  },
];

export const MOCK_CHAT = [
  { id: 'm1', role: 'bot',  content: "Hi QuietOwl42 👋 I'm here whenever you need to talk. How are you feeling today?", timestamp: '2026-08-16T10:00:00Z' },
  { id: 'm2', role: 'user', content: "Honestly not great. Exams are coming up and I feel like I can't keep up.", timestamp: '2026-08-16T10:01:00Z' },
  { id: 'm3', role: 'bot',  content: "That sounds really stressful. Feeling overwhelmed before exams is more common than you might think — you're not alone in this. Can you tell me more about what's weighing on you the most?", timestamp: '2026-08-16T10:01:15Z' },
  { id: 'm4', role: 'user', content: "I just feel exhausted all the time and I'm having trouble sleeping.", timestamp: '2026-08-16T10:02:00Z' },
  { id: 'm5', role: 'bot',  content: "Sleep disruption and exhaustion are signs your mind and body need attention. I'd like to suggest a short check-in — it takes about 3 minutes and helps me understand how you're doing more precisely. Would you like to do that?", timestamp: '2026-08-16T10:02:20Z', triggeredCheckin: true },
];

export const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed. Or being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way', // Q9 — SOS override
];

export const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen',
];

export const FREQUENCY_OPTIONS = [
  { label: 'Not at all',            value: 0 },
  { label: 'Several days',          value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day',      value: 3 },
];

export const MOCK_DEPT_STATS = [
  { dept: 'Computer Science', low: 45, medium: 38, high: 17 },
  { dept: 'Mechanical Engg',  low: 55, medium: 30, high: 15 },
  { dept: 'Civil Engg',       low: 60, medium: 27, high: 13 },
  { dept: 'Electronics',      low: 42, medium: 40, high: 18 },
  { dept: 'Business Mgmt',    low: 50, medium: 35, high: 15 },
];

export const MOCK_WEEKLY_TREND = [
  { week: 'Jul W1', avgPhq9: 5.2, avgGad7: 4.8, highCount: 8  },
  { week: 'Jul W2', avgPhq9: 5.8, avgGad7: 5.1, highCount: 10 },
  { week: 'Jul W3', avgPhq9: 6.1, avgGad7: 5.5, highCount: 12 },
  { week: 'Jul W4', avgPhq9: 7.2, avgGad7: 6.3, highCount: 18 },
  { week: 'Aug W1', avgPhq9: 8.4, avgGad7: 7.1, highCount: 24 },
  { week: 'Aug W2', avgPhq9: 9.7, avgGad7: 8.2, highCount: 31 },
  { week: 'Aug W3', avgPhq9: 11.2,avgGad7: 9.8, highCount: 38 },
];

export const MOCK_COUNSELLOR_ALERTS = [
  { id: 'ca1', pseudonym: 'BrokenCompass88', realName: 'Arjun Mehta',   riskLevel: 'high',   latestScore: 16, trend: 'rising',   flaggedAt: '2026-08-16T09:30:00Z', q9Override: false },
  { id: 'ca2', pseudonym: 'TiredWalker12',   realName: 'Priya Singh',   riskLevel: 'high',   latestScore: 22, trend: 'rising',   flaggedAt: '2026-08-15T14:10:00Z', q9Override: true  },
  { id: 'ca3', pseudonym: 'GraySkies44',     realName: 'Rohan Verma',   riskLevel: 'medium', latestScore: 12, trend: 'stable',   flaggedAt: '2026-08-14T11:22:00Z', q9Override: false },
  { id: 'ca4', pseudonym: 'StillWater07',    realName: 'Ananya Pillai', riskLevel: 'medium', latestScore: 11, trend: 'rising',   flaggedAt: '2026-08-13T08:05:00Z', q9Override: false },
];
