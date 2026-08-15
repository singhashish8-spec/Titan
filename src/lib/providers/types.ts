export type ProviderId = 'claude' | 'gpt' | 'gemini';

export interface SendOptions {
  apiKey: string;
  message: string;
  /** Prior turns in this chat, oldest first. */
  history: { role: 'user' | 'assistant'; content: string }[];
  /** Quietly-included project notes, if any. */
  notes?: string;
}

export interface Provider {
  id: ProviderId;
  label: string;
  send(options: SendOptions): Promise<string>;
}

export class ProviderApiError extends Error {
  constructor(
    public providerId: ProviderId,
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ProviderApiError';
  }
}
