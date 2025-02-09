import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";
import ProPlan from "../components/subscriptions/ProPlan";
import FreePlan from "../components/subscriptions/FreePlan";

export default function Subscription() {
  const { user } = useAuthContext();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="white-header">
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Subscription Plans</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText className="font-bold">
          <p>Upgrade you experience</p>
        </IonText>
        <IonText className="font-regular text-medium">
          <p>Unlock premium features to manage your links more efficiently</p>
        </IonText>
        <div className="flex flex-column" style={{ gap: "2rem" }}>
          <ProPlan />
          <FreePlan />
        </div>
        <br />
      </IonContent>
    </IonPage>
  );
}
