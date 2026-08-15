import { Provider, ProviderApiError, SendOptions } from './types';

// Check https://docs.anthropic.com/en/docs/about-claude/models for the current model list.
const MODEL = 'claude-sonnet-4-5-20250929';

function buildSystemPrompt(notes?: string): string | undefined {
  if (!notes) return undefined;
  return `The following are notes from earlier in this project. Use them as context if relevant, but don't repeat them back unprompted.\n\n${notes}`;
}

export const claudeProvider: Provider = {
  id: 'claude',
  label: 'Claude',
  async send({ apiKey, message, history, notes }: SendOptions): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: buildSystemPrompt(notes),
        messages: [...history, { role: 'user', content: message }].map((m) => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = data?.error?.message ?? response.statusText;
      throw new ProviderApiError('claude', response.status, detail);
    }

    const text = data?.content?.[0]?.text;
    if (typeof text !== 'string') {
      throw new ProviderApiError('claude', response.status, 'Unexpected response shape from Claude API');
    }
    return text;
  }
};
