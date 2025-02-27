import { IonButton, IonChip, IonIcon, IonText } from "@ionic/react";
import ProPlanLogo from "../../assets/svg/ProPlanLogo";
import { checkmarkOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  LOG_LEVEL,
  Purchases,
  PurchasesOffering,
} from "@revenuecat/purchases-capacitor";
import { REVENUCAT_APPLE_API_KEY } from "../../utils/env";

const ProPlan = () => {
  const { user, updateUser } = useAuthContext();
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    if (!user) return;

    (async function () {
      try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.VERBOSE }); // Enable to get debug logs
        await Purchases.configure({
          apiKey: REVENUCAT_APPLE_API_KEY,
          appUserID: user.id,
        });
        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
          setOfferings(offerings.current);
        }
      } catch (error) {}
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
    } catch (error) {}
  };

  const handleManageSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();

      if (customerInfo.customerInfo.managementURL) {
        window.open(customerInfo.customerInfo.managementURL, "_blank"); // Opens in a new tab
      } else {
        alert("No active subscription found.");
      }
    } catch (error) {
      console.error("Error fetching subscription info:", error);
    }
  };

  return (
    <>
      <div
        className="p-4"
        style={{
          backgroundColor: "#E2E7F3",
          minHeight: "20vh",
          borderRadius: "8px",
        }}
      >
        <div className="flex w-full align-items-center">
          <div className="flex flex-1">
            <ProPlanLogo />
          </div>
          {user?.userType === "PRO" && (
            <div className="flex flex-1 justify-content-end">
              <div>
                <IonChip outline color="medium">
                  Current Plan
                </IonChip>
              </div>
            </div>
          )}
        </div>

        <div>
          <IonText className="font-bold font-xl">
            <p>Features</p>
          </IonText>
        </div>
        <div className="flex flex-column gap-5">
          {[
            "Unlimited Tags",
            "Unlimited Content Archive",
            "Advanced Search options",
            "Priority support",
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
        <div className="w-full">
          <div className="flex flex-1">
            <IonText className="font-regular font-base">
              <p>$8.99/month</p>
            </IonText>
          </div>
          <div className="w-full">
            {user?.userType !== "PRO" ? (
              <IonButton
                className="ion-text-end font-bold"
                expand="block"
                color="primary"
                onClick={() => {
                  onClickActivate();
                }}
              >
                Subscribe
              </IonButton>
            ) : (
              <IonButton
                className="ion-text-end font-bold"
                expand="block"
                color="primary"
                onClick={handleManageSubscription}
              >
                Manage Subscription
              </IonButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProPlan;
