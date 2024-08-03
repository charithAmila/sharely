import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import useSecureStorage from '../hooks/useSecureStorage';
import { appleSignIn, auth } from '../firebase';
import { useEffect, useState } from 'react';


const Tab1: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const { setItem, getItem, removeItem } = useSecureStorage('sharely-secure-storage');

  useEffect(()=> {
    const unsubscribe = auth.onAuthStateChanged(async (user)=>{
      if(user) {
          const token = await user?.getIdToken()
          await setItem('firebaseAuth', token)
          console.log('+++ user',user);
          console.log('+++ token', token);
          setAuthenticated(true)
      }
    })

    return () => unsubscribe();
  })

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
     const userData = appleSignIn(result.response.identityToken)
      console.log('+++ successfully saved to keychain', userData);
      
    })
    .catch(error => {
      console.log('+++ error', error);
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
        {authenticated === false ?<IonButton onClick={signIn}>Sign In</IonButton> : 'Authenticated'}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
