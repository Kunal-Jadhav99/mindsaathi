import Groq from 'groq-sdk';

let clientInstance = null;

function getGroqClient() {
  if (!clientInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not defined.');
    }
    clientInstance = new Groq({ apiKey });
  }
  return clientInstance;
}

const SYSTEM_PROMPT = {
  role: 'system',
  content:
    'You are an empathetic, warm, and sensitive mental-wellness companion for students. ' +
    'You must never diagnose medical or psychological conditions. ' +
    'If the user mentions self-harm or suicide, respond immediately with crisis resources (such as Tele-MANAS or iCall) and encourage them to seek professional help.\n\n' +
    'Strict Conversation & Formatting Rules:\n' +
    '- Never use markdown formatting of any kind — no **bold**, no *italics*, no bullet points, no numbered lists, no tables, no headers. Send plain conversational text only, like a real person texting.\n' +
    '- Keep responses short — 2 to 4 sentences maximum per reply.\n' +
    '- Ask only ONE question at a time. Never stack multiple questions in a single response; pick the most important one and hold the rest for later turns.\n' +
    '- Write like a caring friend texting, not like a report, article, or formal essay.',
};

/**
 * Generates an AI chat response using Groq SDK with openai/gpt-oss-120b.
 * @param {Array<{role: string, content: string}>} messages - Conversation history array [{role, content}]
 * @returns {Promise<string>} Content of completion choice message
 */
export async function getChatResponse(messages = []) {
  try {
    const client = getGroqClient();
    const formattedMessages = Array.isArray(messages) ? messages : [{ role: 'user', content: String(messages) }];
    const fullMessages = [SYSTEM_PROMPT, ...formattedMessages];

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: fullMessages,
      temperature: 0.7,
      max_completion_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    throw new Error(`Groq AI Service Error: ${error.message}`);
  }
}
