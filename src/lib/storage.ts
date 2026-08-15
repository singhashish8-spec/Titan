import { Preferences } from '@capacitor/preferences';
import { ProviderId } from './providers';

export interface Project {
  id: string;
  name: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  providerId?: ProviderId;
  ts: number;
}

async function getJson<T>(key: string, fallback: T): Promise<T> {
  const { value } = await Preferences.get({ key });
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function setJson(key: string, value: unknown): Promise<void> {
  await Preferences.set({ key, value: JSON.stringify(value) });
}

// --- API keys ---

export async function getApiKey(providerId: ProviderId): Promise<string> {
  const { value } = await Preferences.get({ key: `titan.apiKey.${providerId}` });
  return value ?? '';
}

export async function setApiKey(providerId: ProviderId, key: string): Promise<void> {
  await Preferences.set({ key: `titan.apiKey.${providerId}`, value: key });
}

// --- Projects ---

export async function listProjects(): Promise<Project[]> {
  const projects = await getJson<Project[]>('titan.projects', []);
  return projects.sort((a, b) => b.createdAt - a.createdAt);
}

export async function createProject(name: string): Promise<Project> {
  const projects = await getJson<Project[]>('titan.projects', []);
  const project: Project = { id: crypto.randomUUID(), name, createdAt: Date.now() };
  await setJson('titan.projects', [...projects, project]);
  return project;
}

export async function getProject(id: string): Promise<Project | undefined> {
  const projects = await getJson<Project[]>('titan.projects', []);
  return projects.find((p) => p.id === id);
}

// --- Chat history ---

export async function getMessages(projectId: string): Promise<ChatMessage[]> {
  return getJson<ChatMessage[]>(`titan.project.${projectId}.messages`, []);
}

export async function appendMessage(projectId: string, message: ChatMessage): Promise<void> {
  const messages = await getMessages(projectId);
  await setJson(`titan.project.${projectId}.messages`, [...messages, message]);
}

// --- Selected provider per project ---

export async function getSelectedProvider(projectId: string): Promise<ProviderId> {
  const { value } = await Preferences.get({ key: `titan.project.${projectId}.provider` });
  return (value as ProviderId) || 'claude';
}

export async function setSelectedProvider(projectId: string, providerId: ProviderId): Promise<void> {
  await Preferences.set({ key: `titan.project.${projectId}.provider`, value: providerId });
}

// --- Notes (v0.1: naive truncation, appended after each exchange) ---

const NOTE_SNIPPET_LENGTH = 160;

export async function getNotes(projectId: string): Promise<string> {
  const { value } = await Preferences.get({ key: `titan.project.${projectId}.notes` });
  return value ?? '';
}

function truncate(text: string, length: number): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  return trimmed.length > length ? `${trimmed.slice(0, length)}…` : trimmed;
}

export async function appendNote(projectId: string, userMessage: string, reply: string): Promise<void> {
  const existing = await getNotes(projectId);
  const line = `Asked: ${truncate(userMessage, NOTE_SNIPPET_LENGTH)} — Reply: ${truncate(reply, NOTE_SNIPPET_LENGTH)}`;
  const updated = existing ? `${existing}\n${line}` : line;
  await Preferences.set({ key: `titan.project.${projectId}.notes`, value: updated });
}
