import { db } from '../config/firebase.js';

// ============================================================
// Suicide, Toxicity & Harm Keywords
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

const TOXIC_AND_HARM_WORDS = [
  'kill yourself',
  'kill ur self',
  'kys',
  'go die',
  'hang yourself',
  'cut yourself',
  'slit your',
  'die loser',
  'die idiot',
  'stupid',
  'idiot',
  'hate you',
  'dumb',
  'ugly',
  'kill you',
  'worthless',
  'waste of space',
  'nobody likes you'
];

function checkToxicityAndHarm(text) {
  const lower = text.toLowerCase();
  const isSuicide = SUICIDE_KEYWORDS.some(k => lower.includes(k));
  const isToxic = TOXIC_AND_HARM_WORDS.some(w => lower.includes(w));
  return {
    isSuicide,
    isToxic,
    isFlagged: isSuicide || isToxic
  };
}

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
    replies: 2,
    moderationStatus: 'approved',
    repliesList: [
      {
        id: 'rep_1',
        pseudonym: 'GentleWind33',
        avatarColor: '#3B82F6',
        content: 'Try putting your phone in another room at least 30 mins before sleeping. It made a huge difference for my anxiety.',
        timestamp: new Date(Date.now() - 1.8 * 86400000).toISOString(),
        moderationStatus: 'approved'
      },
      {
        id: 'rep_2',
        pseudonym: 'StillLake88',
        avatarColor: '#8B5CF6',
        content: 'The progressive muscle relaxation audio in the Resources tab helps me every time!',
        timestamp: new Date(Date.now() - 1.5 * 86400000).toISOString(),
        moderationStatus: 'approved'
      }
    ]
  },
  {
    id: 'fp_seed_2',
    pseudonym: 'DriftingCloud11',
    avatarColor: '#06B6D4',
    content: 'Started doing the 4-7-8 breathing exercise from the resources section. Genuinely helped me calm down during a panic moment today.',
    category: 'wellbeing',
    tags: ['breathing', 'coping'],
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    likes: 33,
    replies: 2,
    moderationStatus: 'approved',
    repliesList: [
      {
        id: 'rep_3',
        pseudonym: 'BrightStar09',
        avatarColor: '#F59E0B',
        content: 'So glad it helped! The box breathing method is another great one to try when you have sudden palpitations.',
        timestamp: new Date(Date.now() - 1.9 * 86400000).toISOString(),
        moderationStatus: 'approved'
      },
      {
        id: 'rep_4',
        pseudonym: 'CalmRiver55',
        avatarColor: '#10B981',
        content: '4-7-8 is amazing. Saved me during mid-terms last semester.',
        timestamp: new Date(Date.now() - 1.6 * 86400000).toISOString(),
        moderationStatus: 'approved'
      }
    ]
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
    replies: 2,
    moderationStatus: 'approved',
    repliesList: [
      {
        id: 'rep_5',
        pseudonym: 'SilentMountain7',
        avatarColor: '#22C55E',
        content: 'Rest is part of the work! Without rest, brain fog just doubles study time anyway.',
        timestamp: new Date(Date.now() - 2.8 * 86400000).toISOString(),
        moderationStatus: 'approved'
      },
      {
        id: 'rep_6',
        pseudonym: 'QuietOwl42',
        avatarColor: '#EC4899',
        content: '100% relate. Scheduling specific break times as "mandatory maintenance" helped remove the guilt for me.',
        timestamp: new Date(Date.now() - 2.5 * 86400000).toISOString(),
        moderationStatus: 'approved'
      }
    ]
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
    replies: 1,
    moderationStatus: 'approved',
    repliesList: [
      {
        id: 'rep_7',
        pseudonym: 'DriftingCloud11',
        avatarColor: '#06B6D4',
        content: 'Proud of you! Mental health stigma in college needs to end.',
        timestamp: new Date(Date.now() - 3.8 * 86400000).toISOString(),
        moderationStatus: 'approved'
      }
    ]
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
        // Filter out flagged replies so peers never see toxic comments
        const cleanReplies = Array.isArray(data.repliesList)
          ? data.repliesList.filter(r => r.moderationStatus !== 'flagged')
          : [];

        posts.push({
          id: doc.id,
          ...data,
          replies: cleanReplies.length,
          repliesList: cleanReplies
        });
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

  const { isSuicide, isToxic, isFlagged } = checkToxicityAndHarm(content);
  const moderationStatus = isFlagged ? 'flagged' : 'approved';

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
      repliesList: [],
      moderationStatus,
      suicideFlag: isSuicide,
      toxicFlag: isToxic
    };

    let postId = `fp_${Date.now()}`;
    if (db) {
      const postRef = await db.collection('forum_posts').add(newPost);
      postId = postRef.id;

      // 🚨 CRITICAL: If suicide trigger or extreme toxicity is detected, escalate to counsellor alerts
      if (isSuicide || isToxic) {
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
          explanation: isSuicide
            ? `🚨 Crisis Trigger in Peer Forum Post: "${content.trim().substring(0, 100)}..."`
            : `⚠️ Toxic/Harassment Trigger in Peer Forum Post: "${content.trim().substring(0, 100)}..."`,
          status: 'active'
        });

        console.log(`🚨 MODERATION TRIGGER ESCALATED to Counsellor Alerts for student ${uid} (${realName})`);
      }
    }

    return res.status(201).json({
      id: postId,
      ...newPost,
      suicideTriggered: isSuicide,
      flagged: isFlagged,
      message: isSuicide
        ? 'Crisis trigger detected. Support resources have been dispatched.'
        : (isToxic ? 'Post flagged and hidden for review.' : 'Post published successfully.')
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

/** Add a reply to a forum post with NLP safety moderation */
export const addReply = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { uid, email } = req.user;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Bad Request', message: 'Reply content cannot be empty.' });
  }

  const { isSuicide, isToxic, isFlagged } = checkToxicityAndHarm(content);

  try {
    let userProfile = {};
    if (db) {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) userProfile = userDoc.data();
    }

    const replyObj = {
      id: `rep_${Date.now()}`,
      uid,
      pseudonym: userProfile.pseudonym || 'PeerHelper',
      avatarColor: userProfile.avatarColor || '#3B82F6',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      moderationStatus: isFlagged ? 'flagged' : 'approved'
    };

    if (db) {
      const postRef = db.collection('forum_posts').doc(id);
      const postDoc = await postRef.get();

      if (postDoc.exists) {
        const postData = postDoc.data();
        const currentReplies = Array.isArray(postData.repliesList) ? postData.repliesList : [];
        currentReplies.push(replyObj);

        // Calculate count of only approved replies
        const approvedCount = currentReplies.filter(r => r.moderationStatus !== 'flagged').length;

        await postRef.update({
          replies: approvedCount,
          repliesList: currentReplies
        });
      }

      // If crisis or severe toxic harassment in reply, create alert for counsellor
      if (isSuicide || isToxic) {
        await db.collection('alerts').add({
          uid,
          instituteId: userProfile.instituteId || 'default-institute',
          department: userProfile.department || 'General',
          pseudonym: userProfile.pseudonym || 'Student',
          realName: userProfile.realName || email?.split('@')[0] || 'Student',
          email: email || '',
          phone: userProfile.phone || '',
          riskLevel: 'high',
          latestScore: 48,
          trend: 'q9-override',
          flaggedAt: new Date().toISOString(),
          q9Override: true,
          explanation: isSuicide
            ? `🚨 Crisis Trigger in Peer Forum Reply: "${content.trim().substring(0, 100)}..."`
            : `⚠️ Toxic/Harassment Trigger in Peer Forum Reply: "${content.trim().substring(0, 100)}..."`,
          status: 'active'
        });
      }
    }

    if (isFlagged) {
      return res.status(200).json({
        success: false,
        flagged: true,
        suicideTriggered: isSuicide,
        message: 'Your reply was blocked by AI moderation for violating community safety guidelines.'
      });
    }

    return res.status(201).json({
      success: true,
      flagged: false,
      reply: replyObj,
      suicideTriggered: false
    });
  } catch (error) {
    console.error('Error adding reply:', error);
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
