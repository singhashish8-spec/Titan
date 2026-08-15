import { claudeProvider } from './claude';
import { gptProvider } from './gpt';
import { geminiProvider } from './gemini';
import { Provider, ProviderId } from './types';

export const providers: Record<ProviderId, Provider> = {
  claude: claudeProvider,
  gpt: gptProvider,
  gemini: geminiProvider
};

export const providerList: Provider[] = [claudeProvider, gptProvider, geminiProvider];

export * from './types';
