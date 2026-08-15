import { Provider, ProviderApiError, SendOptions } from './types';

// Check https://platform.openai.com/docs/models for the current model list.
const MODEL = 'gpt-4o';

function buildMessages({ message, history, notes }: SendOptions) {
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];
  if (notes) {
    messages.push({
      role: 'system',
      content: `The following are notes from earlier in this project. Use them as context if relevant, but don't repeat them back unprompted.\n\n${notes}`
    });
  }
  for (const turn of history) {
    messages.push({ role: turn.role, content: turn.content });
  }
  messages.push({ role: 'user', content: message });
  return messages;
}

export const gptProvider: Provider = {
  id: 'gpt',
  label: 'GPT',
  async send(options: SendOptions): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${options.apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: buildMessages(options)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = data?.error?.message ?? response.statusText;
      throw new ProviderApiError('gpt', response.status, detail);
    }

    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string') {
      throw new ProviderApiError('gpt', response.status, 'Unexpected response shape from OpenAI API');
    }
    return text;
  }
};
