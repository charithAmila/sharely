import { IonContent, IonText, IonButton, IonIcon } from "@ionic/react";
import ProCheckIcon from "../assets/svg/ProCheckIcon";
import { close } from "ionicons/icons";
import { useAuthContext } from "../context/AuthContext";
import {
  LOG_LEVEL,
  Purchases,
  PurchasesOffering,
} from "@revenuecat/purchases-capacitor";
import { useEffect, useState } from "react";
import { REVENUCAT_APPLE_API_KEY } from "../utils/env";

type Props = {
  closeModal: () => void;
};

const Pro = ({ closeModal }: Props) => {
  const { user, updateUser } = useAuthContext();
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    if (!user) return;

    (async function fetchOfferings() {
      try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.VERBOSE });
        await Purchases.configure({
          apiKey: REVENUCAT_APPLE_API_KEY,
          appUserID: user.id,
        });

        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
          setOfferings(offerings.current);
        }
      } catch (error) {
        console.error("Error fetching RevenueCat offerings:", error);
      }
    })();
  }, [user]);

  const onClickActivate = async () => {
    try {
      if (!user) return;

      if (offerings?.availablePackages[0]) {
        await Purchases.purchasePackage({
          aPackage: offerings.availablePackages[0],
        });

        if (user.email) {
          await Purchases.setEmail({
            email: user.email,
          });
        }

        updateUser({
          userType: "PRO",
        });
      }
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();

      if (customerInfo.customerInfo.managementURL) {
        window.open(customerInfo.customerInfo.managementURL, "_blank");
      } else {
        alert("No active subscription found.");
      }
    } catch (error) {
      console.error("Error fetching subscription info:", error);
    }
  };

  const proList = [
    "Unlimited Tags",
    "Unlimited Content Archive",
    "Advanced Search Options",
    "Priority Support",
  ];

  return (
    <IonContent
      fullscreen
      className="ion-padding"
      style={{
        background: "linear-gradient(to top, rgb(3, 23, 48) 0%, #0172fc 100%)",
      }}
    >
      {/* Close Button */}
      <div className="flex flex-1 pt-5">
        <IonButton
          className="ml-auto"
          style={{ "--border-radius": "50%" }}
          onClick={closeModal}
          shape="round"
          color="light"
          aria-label="Close"
        >
          <IonIcon slot="icon-only" icon={close}></IonIcon>
        </IonButton>
      </div>

      {/* Heading and Description */}
      <div className="flex flex-1">
        <IonText color="light" className="ion-text-center">
          <h1 className="font-large">
            Upgrade to Pro & Unlock Your Full Potential
          </h1>
          <p>
            Enjoy unlimited access, enhanced search, and priority support. Try
            free for 2 weeks!
          </p>
        </IonText>
      </div>

      <br />
      <br />

      {/* Features List */}
      <div
        className="p-3 flex flex-column flex-1"
        style={{ borderRadius: "8px", border: "1px solid", color: "#fff" }}
      >
        {proList.map((item, index) => (
          <div key={index} className="flex align-items-center gap-1rem">
            <ProCheckIcon />
            <IonText color="light">
              <p className="font-medium">{item}</p>
            </IonText>
          </div>
        ))}
      </div>

      {/* Pricing and CTA */}
      <div className="flex flex-1 flex-column">
        <br />
        <br />
        <br />
        <div className="flex flex-column align-items-center">
          <IonText color="light" className="ion-text-center">
            Try 2 weeks free, then{" "}
            <span className="font-medium">$8.99 per month</span>
          </IonText>
        </div>
        <br />
        <div className="w-full">
          <IonButton onClick={onClickActivate} color="light" expand="block">
            <IonText color="primary">Upgrade Now</IonText>
          </IonButton>
          {/* "Maybe Later" Button */}
          <IonButton fill="clear" onClick={closeModal} expand="block">
            <IonText color="light">Maybe Later</IonText>
          </IonButton>
        </div>

        {/* Footer Links */}
        <div className="flex align-items-center gap-1rem pt-3 ion-text-center">
          <div className="flex-1">
            <IonText
              className="font-xxs"
              onClick={() =>
                window.open(
                  "https://sharelyplatform.com/terms-and-conditions",
                  "_blank"
                )
              }
              color="light"
            >
              Terms & Conditions
            </IonText>
          </div>
          <div className="flex-1">
            <IonText
              className="font-xxs"
              onClick={() =>
                window.open(
                  "https://sharelyplatform.com/privacy-notice",
                  "_blank"
                )
              }
              color="light"
            >
              Privacy Policy
            </IonText>
          </div>
          <div className="flex-1">
            <IonText
              className="font-xxs"
              onClick={handleManageSubscription}
              color="light"
            >
              Cancel Anytime
            </IonText>
          </div>
        </div>
      </div>
    </IonContent>
  );
};

export default Pro;
