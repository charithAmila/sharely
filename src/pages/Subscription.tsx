import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ProPlanLogo from "../assets/svg/ProPlanLogo";
import { checkmarkOutline } from "ionicons/icons";
import FreePlanLogo from "../assets/svg/FreePlanLogo";

export default function Subscription() {
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
          <div
            className="p-4"
            style={{
              backgroundColor: "#E2E7F3",
              minHeight: "20vh",
              borderRadius: "8px",
            }}
          >
            <div className="flex w-full">
              <ProPlanLogo />
            </div>
            <div>
              <IonText className="font-bold font-xl">
                <p>Pro Plan</p>
              </IonText>
            </div>
            <div className="flex flex-column gap-5">
              {[
                "Unlimited tags",
                "Priority support",
                "Advanced link management",
                "Access to premium features",
              ].map((item, index) => (
                <div key={index} className="flex gap-5 align-items-center">
                  <IonIcon
                    className="font-base font-bold"
                    color="primary"
                    icon={checkmarkOutline}
                  />
                  <IonText className="font-regular">
                    <span>{item}</span>
                  </IonText>
                </div>
              ))}
            </div>
            <div className="w-full flex ">
              <div className="flex flex-1">
                <IonText className="font-regular font-base">
                  <p>$9.99/month</p>
                </IonText>
              </div>
              <div className="flex flex-1 justify-content-end">
                <IonButton
                  className="ion-text-end font-bold ml-auto"
                  fill="clear"
                  expand="block"
                  color="primary"
                >
                  Upgrade
                </IonButton>
              </div>
            </div>
          </div>
          <div
            className="p-4"
            style={{
              borderColor: "#E2E7F3",
              borderWidth: "1px",
              borderStyle: "solid",
              minHeight: "20vh",
              borderRadius: "8px",
            }}
          >
            <div className="flex w-full align-items-center">
              <div className="flex flex-1">
                <FreePlanLogo />
              </div>
              <div className="flex flex-1 justify-content-end">
                <div>
                  <IonChip outline color="medium">
                    Current Plan
                  </IonChip>
                </div>
              </div>
            </div>
            <div>
              <IonText className="font-bold font-xl">
                <p>Free Plan</p>
              </IonText>
            </div>
            <div className="flex flex-column gap-5">
              {[
                "Limited tags",
                "Basic link management",
                "Standard support",
              ].map((item, index) => (
                <div key={index} className="flex gap-5 align-items-center">
                  <IonIcon
                    className="font-base font-bold"
                    color="primary"
                    icon={checkmarkOutline}
                  />
                  <IonText className="font-regular">
                    <span>{item}</span>
                  </IonText>
                </div>
              ))}
            </div>
            <div className="w-full flex ">
              <div className="flex flex-1">
                <IonText className="font-regular font-base">
                  <p>$0/month</p>
                </IonText>
              </div>
            </div>
          </div>
        </div>
        <br />
      </IonContent>
    </IonPage>
  );
}
