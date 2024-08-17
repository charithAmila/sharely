import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useAuthContext } from '../context/AuthContext';
import { cog, home, peopleOutline, powerOutline, pricetagsOutline } from 'ionicons/icons';


const Profile = () => {
  const { logout } = useAuthContext();

  const menu = [
    { name: 'Settings',  icon: cog },
    { name: 'Groups',  icon: peopleOutline },
    { name: 'Tags', url: '/tags', icon: pricetagsOutline },
  ]

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle></IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={logout}>
              <IonIcon slot="icon-only" icon={powerOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false} fullscreen className='ion-padding'>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {
            menu.map(item => (
              <IonItem key={item.name} button routerLink={item.url}>
                <IonIcon slot="start" icon={item.icon} />
                <IonLabel>{item.name}</IonLabel>
              </IonItem>
            ))
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
