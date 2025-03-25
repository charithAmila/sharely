import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonSpinner,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";
import AuthHeader from "../components/auth/AuthHeader"; // same header used in login

const ForgotPassword: React.FC = () => {
  const { sendResetPasswordEmail } = useAuthContext();
  const [email, setEmail] = useState("");
  const [present] = useIonToast();
  const router = useIonRouter();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      present({
        color: "danger",
        duration: 2000,
        message: "Please enter your email",
      });
      return;
    }

    try {
      setLoading(true);
      await sendResetPasswordEmail(email);
      setEmail("");
      present({
        color: "success",
        duration: 2000,
        message: "Password reset link sent to your email",
      });
      setLoading(false);
    } catch (error: any) {
      present({
        color: "danger",
        duration: 2000,
        message: "Error sending password reset link",
      });
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent
        className="ion-padding"
        style={{ backgroundColor: "#f5f5f5" }}
        scrollY={false}
        fullscreen
      >
        <div className="flex flex-column h-100vh">
          <AuthHeader title="Reset your Password" />

          <div className="pt-5">
            <IonItem>
              <IonInput
                label="Email"
                labelPlacement="floating"
                placeholder="Enter your email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>
          </div>

          <div className="pt-4">
            <IonButton expand="block" onClick={handleReset}>
              {loading && <IonSpinner slot="start" name="lines-small" />} Send
              Reset Link
            </IonButton>
          </div>

          <div className="pt-2">
            <IonButton
              onClick={() => router.goBack()}
              expand="block"
              fill="clear"
              color="medium"
            >
              Back to Login
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
