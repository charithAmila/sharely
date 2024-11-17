import {
  IonButton,
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

import { Purchases, LOG_LEVEL } from "@revenuecat/purchases-capacitor";
import { useEffect } from "react";

const ProConnect = () => {
  useEffect(() => {
    (async function () {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }); // Enable to get debug logs
      await Purchases.configure({
        apiKey: "sk_KsDdoCxGZVIvBfLGQmfVxCOFOhXAc",
        // appUserID: "my_app_user_id" // Optional
      });
    })();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="p-3 white-header">
          <ExpandedLogo />
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
                <p>Features</p>
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
                  <p>$8.99/month</p>
                </IonText>
              </div>
              <div className="flex flex-1 justify-content-end">
                <IonButton
                  className="ion-text-end font-bold ml-auto"
                  fill="clear"
                  expand="block"
                  color="primary"
                  onClick={() => {
                    // Purchases.purchasePackage("pro");
                  }}
                >
                  Activate
                </IonButton>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProConnect;
