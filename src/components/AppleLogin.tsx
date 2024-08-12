import { SignInWithApple, SignInWithAppleOptions, SignInWithAppleResponse } from "@capacitor-community/apple-sign-in";
import { IonButton, IonIcon } from "@ionic/react";
import { logoApple } from "ionicons/icons";
import { useAuthContext } from "../context/AuthContext";

const AppleLogin = () => {
  const { appleSignIn } = useAuthContext();
    const signIn = () => {
        let options: SignInWithAppleOptions = {
          clientId: 'io.sharely.app',
          redirectURI: 'https://snap-link-424d4.firebaseapp.com/__/auth/handler',
          scopes: 'email name',
          state: '12345',
          // nonce: 'nonce',
        };
        SignInWithApple.authorize(options)
        .then(async (result: SignInWithAppleResponse) => {
          appleSignIn(result.response.identityToken)
        })
        .catch(error => {
          console.log('+++ error', error);
        });
    }

    return (
        <IonButton
            onClick={signIn}
            fill="outline"
            shape="round"
            className="m-20"
            color="dark"
            expand="block"
          >
            <IonIcon slot="start" icon={logoApple}></IonIcon>
            Login With Apple
        </IonButton>
    );
};

export default AppleLogin;