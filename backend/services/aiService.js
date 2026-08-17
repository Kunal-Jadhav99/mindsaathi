import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = {
  role: 'system',
  content:
    'You are an empathetic, warm, and sensitive mental-wellness companion for students. ' +
    'You must never diagnose medical or psychological conditions. ' +
    'If the user mentions self-harm or suicide, respond immediately with crisis resources (such as Tele-MANAS or iCall) and encourage them to seek professional help.',
};

/**
 * Generates an AI chat response using Groq SDK with openai/gpt-oss-120b.
 * @param {Array<{role: string, content: string}>} messages - Conversation history array [{role, content}]
 * @returns {Promise<string>} Content of completion choice message
 */
export async function getChatResponse(messages = []) {
  try {
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
