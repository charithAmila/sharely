import {
  SignInWithApple,
  SignInWithAppleOptions,
  SignInWithAppleResponse,
} from "@capacitor-community/apple-sign-in";
import { IonButton, IonCol, IonIcon, IonRow, IonText } from "@ionic/react";
import { logoApple, logoGoogle } from "ionicons/icons";
import { useAuthContext } from "../context/AuthContext";
import GoogleLogo from "../assets/svg/GoogleLogo";

const GoogleLogin = () => {
  const { appleSignIn } = useAuthContext();
  const signIn = () => {
    let options: SignInWithAppleOptions = {
      clientId: "io.sharely.app",
      redirectURI: "https://snap-link-424d4.firebaseapp.com/__/auth/handler",
      scopes: "email name",
      state: "12345",
      // nonce: 'nonce',
    };
    SignInWithApple.authorize(options)
      .then(async (result: SignInWithAppleResponse) => {
        appleSignIn(result.response.identityToken);
      })
      .catch((error) => {
        console.log("+++ error", error);
      });
  };

  return (
    <IonButton
      onClick={signIn}
      fill="outline"
      shape="round"
      color="medium"
      expand="block"
    >
      <IonRow className="ion-align-items-center">
        <IonCol>
          <GoogleLogo />
        </IonCol>
        <IonCol>Google</IonCol>
      </IonRow>
    </IonButton>
  );
};

export default GoogleLogin;
