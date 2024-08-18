import { useState } from "react";
import { Link } from "react-router-dom";
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
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";
import Logo from "../assets/Logo";
import { EMAIL_REGEX } from "../utils/constant";
import AppleLogin from "../components/AppleLogin";


interface IFormInput {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {

  const { signup } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    try {
      setLoading(true);
      await signup({name: data.name, email: data.email, password: data.password});
      setLoading(false);
    } catch (error) {
        console.log('+++ error', error);
        
      setLoading(false);
      present({
        message: "Error signing up",
        duration: 2000,
        color: "danger",
      });
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen scrollY={false}>
      <div className="flex justify-content-center align-items-end h-30vh">
          <Logo />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "This is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <IonItem>
                <IonInput
                  label={`Name ${!!errors.name ? `(${errors.name.message})` : ""}`}
                  autoCapitalize="on"
                  onBlur={onBlur}
                  onIonInput={onChange}
                  value={value}
                  type="text"
                  labelPlacement="stacked"
                />
              </IonItem>
            )}
          />

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
                        onIonInput={onChange}
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
                        onIonInput={onChange} 
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
            className="btn-margin-20"
            expand="block"
          >
            {loading && <IonSpinner slot="start" name="lines-small" />} Sign up
          </IonButton>
        </form>
        <AppleLogin />
        <IonText>
          <p className="ion-text-center">
            Already have a account? <Link to="/login">Login</Link>
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
}