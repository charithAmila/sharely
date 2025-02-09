import { IonChip, IonText, IonIcon } from "@ionic/react";
import { checkmarkOutline } from "ionicons/icons";
import FreePlanLogo from "../../assets/svg/FreePlanLogo";
import { useAuthContext } from "../../context/AuthContext";

const FreePlan = () => {
  const { user } = useAuthContext();
  return (
    <>
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
          {user?.userType === "FREE" && (
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
            <p>Free Plan</p>
          </IonText>
        </div>
        <div className="flex flex-column gap-5">
          {["Limited tags", "Basic link management", "Standard support"].map(
            (item, index) => (
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
            )
          )}
        </div>
        <div className="w-full flex ">
          <div className="flex flex-1">
            <IonText className="font-regular font-base">
              <p>$0/month</p>
            </IonText>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreePlan;
