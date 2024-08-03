import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import useSecureStorage from '../hooks/useSecureStorage';


const Tab1: React.FC = () => {
  const { setItem, getItem, removeItem } = useSecureStorage('sharely-secure-storage');

  

  const appleSignIn = () => {

    let options: SignInWithAppleOptions = {
      clientId: 'io.sharely.app',
      redirectURI: 'https://snap-link-424d4.firebaseapp.com/__/auth/handler',
      scopes: 'email name',
      state: '12345',
      // nonce: 'nonce',
    };

    SignInWithApple.authorize(options)
    .then(async (result: SignInWithAppleResponse) => {
      await setItem('identityToken', result.response.identityToken)
      // Handle user information
      // Validate token with server and create new session
      console.log('+++ successfully saved to keychain');
      
    })
    .catch(error => {
      console.log('+++ error', error);
      
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
