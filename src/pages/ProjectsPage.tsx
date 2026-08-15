import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  useIonAlert,
  useIonViewWillEnter
} from '@ionic/react';
import { add, settingsOutline, folderOpenOutline } from 'ionicons/icons';
import { createProject, listProjects, Project } from '../lib/storage';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [presentAlert] = useIonAlert();
  const history = useHistory();

  async function refresh() {
    setProjects(await listProjects());
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  useIonViewWillEnter(() => {
    refresh();
  });

  function promptNewProject() {
    presentAlert({
      header: 'New project',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Project name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: async (data) => {
            const name = (data.name ?? '').trim();
            if (!name) return;
            const project = await createProject(name);
            history.push(`/project/${project.id}`);
          }
        }
      ]
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Titan</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/settings">
              <IonIcon slot="icon-only" icon={settingsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loaded && projects.length === 0 ? (
          <div className="ion-padding ion-text-center" style={{ marginTop: '3rem', color: 'var(--ion-color-medium)' }}>
            <IonIcon icon={folderOpenOutline} style={{ fontSize: '48px' }} />
            <p>No projects yet. Tap + to start one.</p>
          </div>
        ) : (
          <IonList>
            {projects.map((project) => (
              <IonItem key={project.id} routerLink={`/project/${project.id}`} button>
                <IonLabel>{project.name}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={promptNewProject}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
