import { db } from '../config/firebase.js';

// ============================================================
// Suicide & Crisis Trigger Keywords
// ============================================================
const SUICIDE_KEYWORDS = [
  'suicide',
  'kill myself',
  'killing myself',
  'end my life',
  'ending my life',
  'want to die',
  'wanna die',
  'hang myself',
  'hurt myself',
  'cutting myself',
  'slit my wrist',
  'no reason to live',
  'better off dead',
  'end it all',
  'self harm',
  'self-harm',
  'poison myself',
  'dont want to live',
  "don't want to live",
  'take my own life'
];

const TOXIC_WORDS = ['stupid', 'idiot', 'hate you', 'dumb', 'ugly', 'kill you', 'die loser'];

const DEFAULT_POSTS = [
  {
    id: 'fp_seed_1',
    pseudonym: 'SilentMountain7',
    avatarColor: '#22C55E',
    content: "Anyone else finding it impossible to sleep before exams? I've been lying awake for hours with racing thoughts. Nothing seems to help.",
    category: 'stress',
    tags: ['exam-stress', 'sleep'],
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    likes: 18,
    replies: 6,
    moderationStatus: 'approved'
  },
  {
    id: 'fp_seed_2',
    pseudonym: 'DriftingCloud11',
    avatarColor: '#06B6D4',
    content: 'Started doing the 4-7-8 breathing exercise from the resources section. Genuinely helped me calm down during a panic moment today.',
    category: 'wellbeing',
    tags: ['breathing', 'coping'],
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    likes: 32,
    replies: 9,
    moderationStatus: 'approved'
  },
  {
    id: 'fp_seed_3',
    pseudonym: 'WanderingReed23',
    avatarColor: '#F59E0B',
    content: "Does anyone else feel guilty for taking a break? Like every time I rest I feel like I'm falling behind everyone else in engineering.",
    category: 'academics',
    tags: ['burnout', 'guilt'],
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    likes: 44,
    replies: 14,
    moderationStatus: 'approved'
  },
  {
    id: 'fp_seed_4',
    pseudonym: 'CalmRiver55',
    avatarColor: '#8B5CF6',
    content: "Booked a counsellor session through the app. Was nervous but the counsellor was really understanding. If you're on the fence, just do it.",
    category: 'general',
    tags: ['counselling', 'hope'],
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    likes: 67,
    replies: 21,
    moderationStatus: 'approved'
  }
];

/** Get all forum posts */
export const getPosts = async (req, res) => {
  if (!db) {
    return res.json(DEFAULT_POSTS);
  }

  try {
    const snapshot = await db.collection('forum_posts').get();
    
    if (snapshot.empty) {
      return res.json(DEFAULT_POSTS);
    }

    const posts = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Show approved posts, or student's own flagged posts
      if (data.moderationStatus === 'approved' || (req.user && data.uid === req.user.uid)) {
        posts.push({ id: doc.id, ...data });
      }
    });

    // Merge default posts if few
    if (posts.length < 4) {
      DEFAULT_POSTS.forEach(p => {
        if (!posts.some(x => x.id === p.id)) posts.push(p);
      });
    }

    // Sort by timestamp descending
    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.json(posts);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return res.json(DEFAULT_POSTS);
  }
};

/** Create post with real-time suicide & toxicity moderation + instant admin escalation */
export const createPost = async (req, res) => {
  const { uid, email } = req.user;
  const { content, category, tags } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Bad Request', message: 'Post content cannot be empty.' });
  }

  const textLower = content.toLowerCase();
  const isSuicideTrigger = SUICIDE_KEYWORDS.some(keyword => textLower.includes(keyword));
  const isToxic = TOXIC_WORDS.some(word => textLower.includes(word));

  const moderationStatus = isSuicideTrigger ? 'flagged' : (isToxic ? 'flagged' : 'approved');

  try {
    let userProfile = {};
    if (db) {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) userProfile = userDoc.data();
    }

    const pseudonym = userProfile.pseudonym || 'AnonymousStudent';
    const avatarColor = userProfile.avatarColor || '#2563EB';
    const instituteId = userProfile.instituteId || req.user.instituteId || 'default-institute';
    const department = userProfile.department || 'Computer Science';
    const realName = userProfile.realName || email?.split('@')[0] || 'Student';

    const newPost = {
      uid,
      pseudonym,
      avatarColor,
      content: content.trim(),
      category: category || 'general',
      tags: Array.isArray(tags) ? tags : [],
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0,
      moderationStatus,
      suicideFlag: isSuicideTrigger
    };

    let postId = `fp_${Date.now()}`;
    if (db) {
      const postRef = await db.collection('forum_posts').add(newPost);
      postId = postRef.id;

      // 🚨 CRITICAL: If suicide trigger is detected, immediately create an active alert for counsellors
      if (isSuicideTrigger) {
        await db.collection('alerts').add({
          uid,
          instituteId,
          department,
          pseudonym,
          realName,
          email: email || '',
          phone: userProfile.phone || '',
          riskLevel: 'high',
          latestScore: 48,
          trend: 'q9-override',
          flaggedAt: new Date().toISOString(),
          q9Override: true,
          explanation: `🚨 Crisis Trigger in Peer Forum: "${content.trim().substring(0, 100)}..."`,
          status: 'active'
        });

        console.log(`🚨 SUICIDE TRIGGER ESCALATED to Counsellor Alerts for student ${uid} (${realName})`);
      }
    }

    return res.status(201).json({
      id: postId,
      ...newPost,
      suicideTriggered: isSuicideTrigger,
      message: isSuicideTrigger
        ? 'Crisis trigger detected. Support resources have been dispatched.'
        : (isToxic ? 'Post flagged for review.' : 'Post published successfully.')
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

/** Like / upvote a forum post */
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!db) {
    return res.json({ success: true, likes: 1 });
  }

  try {
    const postRef = db.collection('forum_posts').doc(id);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      const newLikes = (postDoc.data().likes || 0) + 1;
      await postRef.update({ likes: newLikes });
      return res.json({ success: true, likes: newLikes });
    }

    return res.json({ success: true, likes: 1 });
  } catch (error) {
    console.error('Error liking post:', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
};
