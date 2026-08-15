import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText
} from '@ionic/react';
import { send as sendIcon } from 'ionicons/icons';
import { providers, providerList, ProviderApiError, ProviderId } from '../lib/providers';
import {
  appendMessage,
  appendNote,
  ChatMessage,
  getMessages,
  getNotes,
  getProject,
  getApiKey,
  getSelectedProvider,
  setSelectedProvider,
  Project
} from '../lib/storage';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [providerId, setProviderId] = useState<ProviderId>('claude');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(true);
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    (async () => {
      setProject(await getProject(id));
      setMessages(await getMessages(id));
      setProviderId(await getSelectedProvider(id));
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      const key = await getApiKey(providerId);
      setHasKey(!!key);
    })();
  }, [providerId]);

  useEffect(() => {
    contentRef.current?.scrollToBottom(150);
  }, [messages, sending]);

  async function handleProviderChange(next: ProviderId) {
    setProviderId(next);
    await setSelectedProvider(id, next);
  }

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;

    setError(null);
    setDraft('');
    setSending(true);

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, ts: Date.now() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    await appendMessage(id, userMessage);

    try {
      const apiKey = await getApiKey(providerId);
      if (!apiKey) {
        setError(`No ${providers[providerId].label} API key set. Add one in Settings.`);
        setHasKey(false);
        return;
      }

      const notes = await getNotes(id);
      const reply = await providers[providerId].send({
        apiKey,
        message: text,
        history: nextMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        notes: notes || undefined
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        providerId,
        ts: Date.now()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      await appendMessage(id, assistantMessage);
      await appendNote(id, text, reply);
    } catch (err) {
      if (err instanceof ProviderApiError) {
        if (err.status === 401 || err.status === 403) {
          setError(`${providers[providerId].label} rejected the API key. Check it in Settings.`);
          setHasKey(false);
        } else {
          setError(`${providers[providerId].label} error: ${err.message}`);
        }
      } else {
        setError('Something went wrong sending that message. Check your connection and try again.');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{project?.name ?? 'Chat'}</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSelect
            value={providerId}
            interface="popover"
            onIonChange={(e) => handleProviderChange(e.detail.value)}
            className="ion-padding-start"
          >
            {providerList.map((p) => (
              <IonSelectOption key={p.id} value={p.id}>
                {p.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} className="ion-padding">
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: '16px',
                background: m.role === 'user' ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
                color: m.role === 'user' ? 'var(--ion-color-primary-contrast)' : 'var(--ion-color-dark)'
              }}
            >
              <div className="markdown-bubble">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {sending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <IonSpinner name="dots" />
          </div>
        )}
        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
      </IonContent>
      <IonToolbar>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '8px' }}>
          <IonTextarea
            value={draft}
            autoGrow
            placeholder={hasKey ? 'Message…' : `Add a ${providers[providerId].label} API key in Settings to start`}
            onIonInput={(e) => setDraft(e.detail.value ?? '')}
            style={{ flex: 1 }}
            disabled={!hasKey}
          />
          <IonButton onClick={handleSend} disabled={!hasKey || sending || !draft.trim()}>
            <IonIcon slot="icon-only" icon={sendIcon} />
          </IonButton>
        </div>
      </IonToolbar>
    </IonPage>
  );
}
