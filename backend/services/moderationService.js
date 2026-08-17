// ============================================================
// Moderation Service — Placeholder for Person B (Teammate)
// ============================================================
// This file will use Gemini to screen forum submissions:
// - moderatePost(postContent) → { status: 'approved' | 'flagged' | 'blocked', reason, confidence }
// - If flagged for self-harm/crisis → auto-creates an alert in the 'alerts' collection
// - If blocked for toxicity → post is rejected and never stored
// ============================================================

export const moderatePost = async (postContent) => {
  // TODO: Person B will implement Gemini moderation pipeline here
  return { status: 'approved', reason: 'Placeholder — auto-approved', confidence: 1.0 };
};
