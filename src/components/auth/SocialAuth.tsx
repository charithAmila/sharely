import { IonRow, IonCol, IonText } from "@ionic/react";
import AppleLogin from "../AppleLogin";
import GoogleLogin from "../GoogleLogin";

export default function SocialAuth() {
  return (
    <>
      <IonRow className="flex align-items-center">
        <IonCol>
          <hr className="flex-1 bg-medium" />
        </IonCol>
        <IonCol>
          <IonText className="ion-text-center">
            <p>or sign in with</p>
          </IonText>
        </IonCol>
        <IonCol>
          <hr className="flex-1 bg-medium" />
        </IonCol>
      </IonRow>
      <IonRow>
        {/* <IonCol>
          <GoogleLogin />
        </IonCol> */}
        <IonCol>
          <AppleLogin />
        </IonCol>
      </IonRow>
    </>
  );
}
