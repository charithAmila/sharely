import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';

const Tab1: React.FC = () => {

  

  const appleSignIn = () => {

    let options: SignInWithAppleOptions = {
      clientId: 'io.sharely.app',
      redirectURI: 'https://snap-link-424d4.firebaseapp.com/__/auth/handler',
      scopes: 'email name',
      state: '12345',
      // nonce: 'nonce',
    };

    SignInWithApple.authorize(options)
    .then((result: SignInWithAppleResponse) => {
      // Handle user information
      // Validate token with server and create new session
    })
    .catch(error => {
      // Handle error
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={appleSignIn}>Sign In</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
