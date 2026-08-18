// ============================================================
// API Service Layer — MindSaathi Frontend to Backend
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/** Helper to get Auth Headers */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || 'mock-dev-token';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/** Generic fetch wrapper with robust error handling */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...getAuthHeaders(), ...options.headers };

  try {
    const res = await fetch(url, { ...options, headers });
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Server error (${res.status}): ${text.substring(0, 120)}`);
    }

    if (!res.ok) {
      throw new Error(data.message || data.error || `API Error (${res.status})`);
    }

    return data;
  } catch (err) {
    console.error(`API Request Failed [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

// ============================================================
// User Profile APIs
// ============================================================
export const getUserProfile = () => request('/users/profile');

export const updateUserProfile = (profileData) => request('/users/profile', {
  method: 'PUT',
  body: JSON.stringify(profileData)
});

export const setUserRole = (role, instituteId) => request('/users/role', {
  method: 'POST',
  body: JSON.stringify({ role, instituteId })
});

// ============================================================
// Clinical Check-ins APIs
// ============================================================
export const getCheckins = () => request('/checkins');

export const submitCheckin = (phq9Answers, gad7Answers, mood, journalSnippet) => request('/checkins', {
  method: 'POST',
  body: JSON.stringify({ phq9Answers, gad7Answers, mood, journalSnippet })
});

// ============================================================
// Journal APIs
// ============================================================
export const getJournals = () => request('/journals');

export const getJournalById = (id) => request(`/journals/${id}`);

export const createJournal = (journalData) => request('/journals', {
  method: 'POST',
  body: JSON.stringify(journalData)
});

export const updateJournal = (id, journalData) => request(`/journals/${id}`, {
  method: 'PUT',
  body: JSON.stringify(journalData)
});

export const deleteJournal = (id) => request(`/journals/${id}`, {
  method: 'DELETE'
});

// ============================================================
// Counsellor Admin Analytics APIs
// ============================================================
export const getAdminSummary = () => request('/admin/summary');

export const getDeptStats = () => request('/admin/dept-stats');

export const getWeeklyTrends = () => request('/admin/weekly-trends');

export const getAlerts = () => request('/admin/alerts');

export const updateAlertStatus = (id, status, notes) => request(`/admin/alerts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ status, notes })
});

// ============================================================
// AI Chatbot APIs
// ============================================================
export const sendChatMessage = (messages) => request('/chat', {
  method: 'POST',
  body: JSON.stringify({ messages })
});
