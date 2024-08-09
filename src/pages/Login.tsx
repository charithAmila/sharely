import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonLabel,
    IonPage,
    IonSpinner,
    IonText,
    useIonToast,
  } from "@ionic/react";
  import { useState } from "react";
  import { useForm, Controller, SubmitHandler } from "react-hook-form";
  import { Link } from "react-router-dom";
  import { logoApple } from "ionicons/icons";
import { useAuthContext } from "../context/AuthContext";
import { EMAIL_REGEX } from "../utils/constant";
import Logo from "../assets/Logo";
import AppleLogin from "../components/AppleLogin";
  
  interface IFormInput {
    email: string;
    password: string;
  }
  
  export default function Login() {
  
    const { login: signInWithEmailPassword } = useAuthContext();
  
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<IFormInput>();
  
    const [loading, setLoading] = useState(false);
    const [present, dismiss] = useIonToast();
  
    const onSubmit: SubmitHandler<IFormInput> = (data: {
      email: string;
      password: string;
    }) => {
      setLoading(true);
      signInWithEmailPassword({email: data.email, password: data.password})
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          const errorCode = error?.code;
          const errorMessage = error?.message;
          present({
            color: "danger",
            buttons: [{ text: "hide", handler: () => dismiss() }],
            message:
              errorCode === "auth/wrong-password"
                ? `There's no account with this email. Please check for typos or sign up.`
                : errorMessage,
          });
        });
    };
  
    return (
      <IonPage>
        <IonContent className="ion-padding" scrollY={false}>
          <div className="flex justify-content-center align-items-end h-30vh">
            <Logo />
          </div>
          <form className="mt-16" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "This is required",
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <IonItem>
                  <IonInput
                    label={`Email ${!!errors.email ? `(${errors.email.message})` : ""}`}
                    onBlur={onBlur}
                    onIonChange={onChange}
                    value={value}
                    type="email"
                    labelPlacement="stacked" 
                  />
                </IonItem>
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "This is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <IonItem>
                      <IonInput 
                        type="password" 
                        label={`Password ${!!errors.password ? `(${errors.password.message})` : ""}`} 
                        labelPlacement="stacked" 
                        onIonChange={onChange} 
                        onBlur={onBlur}
                        value={value}
                      >
                          <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                      </IonInput>
                  </IonItem>
                </>
              )}
            />
            <IonButton
              shape="round"
              type="submit"
              className="m-20"
              expand="block"
            >
              {loading && <IonSpinner slot="start" name="lines-small" />} Login
            </IonButton>
          </form>
          <AppleLogin />
          <IonText>
            <p className="ion-text-center">
              First time here? <Link to="/sign-up">Sign up</Link>
            </p>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }