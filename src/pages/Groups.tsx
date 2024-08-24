import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { useAppContext } from "../context/MainContext";
import { useEffect } from "react";

export default function Groups() {
  const { groups, getFriends } = useAppContext();

  useEffect(() => {
    getFriends();
  },[])
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Groups</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/tabs/group-form">
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Groups</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {groups.map((group) => (
            <IonItem key={group.id} routerLink={`/tabs/groups/${group.id}`}>
              <IonLabel>{group.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
