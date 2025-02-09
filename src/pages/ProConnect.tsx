import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";
import ExpandedLogo from "../assets/svg/ExpandedLogo";
import { checkmarkOutline } from "ionicons/icons";
import ProPlanLogo from "../assets/svg/ProPlanLogo";

import { useAuthContext } from "../context/AuthContext";
import ProPlan from "../components/subscriptions/ProPlan";

const ProConnect = () => {
  const { updateUser } = useAuthContext();

  const onClickSkip = async () => {
    try {
      await updateUser({ userType: "FREE" });
    } catch (error) {
      console.log("+++++ error", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="p-3 white-header">
          <ExpandedLogo />
          <IonButtons slot="end">
            <IonButton onClick={() => onClickSkip()}>Skip</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <IonText className="ion-text-center">
            <p className="font-large">
              Activate your Sharely account with 7 days free trial
            </p>
          </IonText>
        </div>
        <div className="ion-padding">
          <ProPlan />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProConnect;
