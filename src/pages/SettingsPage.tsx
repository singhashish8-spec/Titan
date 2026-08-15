import { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonNote,
  useIonToast
} from '@ionic/react';
import { providerList, ProviderId } from '../lib/providers';
import { getApiKey, setApiKey } from '../lib/storage';

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<ProviderId, string>>({ claude: '', gpt: '', gemini: '' });
  const [present] = useIonToast();

  useEffect(() => {
    (async () => {
      const entries = await Promise.all(providerList.map(async (p) => [p.id, await getApiKey(p.id)] as const));
      setKeys(Object.fromEntries(entries) as Record<ProviderId, string>);
    })();
  }, []);

  async function save() {
    await Promise.all(providerList.map((p) => setApiKey(p.id, keys[p.id].trim())));
    present({ message: 'Saved', duration: 1200, position: 'bottom' });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList inset>
          {providerList.map((p) => (
            <IonItem key={p.id}>
              <IonLabel position="stacked">{p.label} API key</IonLabel>
              <IonInput
                type="password"
                value={keys[p.id]}
                placeholder={`Paste your ${p.label} API key`}
                onIonInput={(e) => setKeys((prev) => ({ ...prev, [p.id]: e.detail.value ?? '' }))}
              />
            </IonItem>
          ))}
        </IonList>
        <IonNote className="ion-padding" color="medium">
          Keys are stored on-device only. Titan never sends them anywhere except directly to each provider's own API.
        </IonNote>
        <div className="ion-padding">
          <IonButton expand="block" onClick={save}>
            Save
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
