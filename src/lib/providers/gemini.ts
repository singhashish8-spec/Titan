import { Provider, ProviderApiError, SendOptions } from './types';

// Check https://ai.google.dev/gemini-api/docs/models for the current model list.
const MODEL = 'gemini-2.0-flash';

export const geminiProvider: Provider = {
  id: 'gemini',
  label: 'Gemini',
  async send({ apiKey, message, history, notes }: SendOptions): Promise<string> {
    const contents = [
      ...history.map((turn) => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const body: Record<string, unknown> = { contents };
    if (notes) {
      body.systemInstruction = {
        parts: [
          {
            text: `The following are notes from earlier in this project. Use them as context if relevant, but don't repeat them back unprompted.\n\n${notes}`
          }
        ]
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const detail = data?.error?.message ?? response.statusText;
      throw new ProviderApiError('gemini', response.status, detail);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string') {
      throw new ProviderApiError('gemini', response.status, 'Unexpected response shape from Gemini API');
    }
    return text;
  }
};
