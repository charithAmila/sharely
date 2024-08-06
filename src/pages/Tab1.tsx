import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import { appleSignIn, auth, signInWithToken } from '../firebase';
import { useEffect, useState } from 'react';
import Echo from '../plugins/Echo';


const Tab1: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(()=> {
    const unsubscribe = auth.onAuthStateChanged(async (user)=> {
      if(user) {
          setAuthenticated(true)
          const savedUserId = await Echo.readFromKeyChain({key: 'uid'})

          if(savedUserId.value !== user.uid) {
              Echo.saveToKeyChain({key: 'uid', value: user.uid})
          }
      }
    })

    return () => unsubscribe();
  },[])

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
        {authenticated === false ? <IonButton onClick={signIn}>Sign In</IonButton> : 'Authenticated'}

        <IonButton onClick={()=>{
          Echo.readFromKeyChain({key: 'firebaseAuthToken'}).then( async (res)=>{
            console.log('++++ res',res);

          await signInWithToken(res.value)
            
          }).catch(error=>{
            console.log('+ error',error);
            
          })
        }}>Click me</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
