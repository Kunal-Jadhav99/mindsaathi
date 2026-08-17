import { db } from '../config/firebase.js';

/** Get all journal entries for the logged-in user, newest first */
export const getJournals = async (req, res) => {
  const { uid } = req.user;

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const snapshot = await db.collection('journals')
      .where('uid', '==', uid)
      .orderBy('date', 'desc')
      .get();

    const journals = [];
    snapshot.forEach(doc => {
      journals.push({ id: doc.id, ...doc.data() });
    });

    return res.json(journals);
  } catch (error) {
    console.error('Error fetching journals:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch journal entries.' });
  }
};

/** Get a single journal entry by ID */
export const getJournalById = async (req, res) => {
  const { uid } = req.user;
  const { id } = req.params;

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const doc = await db.collection('journals').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Not Found', message: 'Journal entry not found.' });
    }

    const data = doc.data();
    if (data.uid !== uid) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only view your own journal entries.' });
    }

    return res.json({ id: doc.id, ...data });
  } catch (error) {
    console.error('Error fetching journal by ID:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch journal entry.' });
  }
};

/** Create a new journal entry */
export const createJournal = async (req, res) => {
  const { uid } = req.user;
  const { mood, title, content, tags } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'Journal content cannot be empty.' });
  }

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  const journalEntry = {
    uid,
    date: new Date().toISOString(),
    mood: mood || 'okay',
    title: title || 'Untitled',
    content: content.trim(),
    tags: Array.isArray(tags) ? tags : []
  };

  try {
    const docRef = await db.collection('journals').add(journalEntry);
    return res.status(201).json({ id: docRef.id, ...journalEntry });
  } catch (error) {
    console.error('Error creating journal:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not save journal entry.' });
  }
};

/** Update an existing journal entry */
export const updateJournal = async (req, res) => {
  const { uid } = req.user;
  const { id } = req.params;
  const { mood, title, content, tags } = req.body;

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const docRef = db.collection('journals').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Not Found', message: 'Journal entry not found.' });
    }

    if (doc.data().uid !== uid) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only edit your own journal entries.' });
    }

    const updates = {};
    if (mood !== undefined) updates.mood = mood;
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content.trim();
    if (tags !== undefined) updates.tags = tags;
    updates.updatedAt = new Date().toISOString();

    await docRef.update(updates);

    const updatedDoc = await docRef.get();
    return res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating journal:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not update journal entry.' });
  }
};

/** Delete a journal entry */
export const deleteJournal = async (req, res) => {
  const { uid } = req.user;
  const { id } = req.params;

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const docRef = db.collection('journals').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Not Found', message: 'Journal entry not found.' });
    }

    if (doc.data().uid !== uid) {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only delete your own journal entries.' });
    }

    await docRef.delete();
    return res.json({ success: true, message: 'Journal entry deleted.' });
  } catch (error) {
    console.error('Error deleting journal:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not delete journal entry.' });
  }
};
