import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonSpinner,
  IonText,
  useIonToast,
} from "@ionic/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";
import { EMAIL_REGEX } from "../utils/constant";
import AuthHeader from "../components/auth/AuthHeader";
import { eye, eyeOff } from "ionicons/icons";
import SocialAuth from "../components/auth/SocialAuth";

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
  const [showPassword, setShowPassword] = useState(false);
  const [present] = useIonToast();

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    try {
      setLoading(true);
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      present({
        message: "Error signing up",
        position: "top",
        duration: 2000,
        color: "danger",
      });
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen scrollY={false}>
        <div className="flex flex-column h-100vh">
          <AuthHeader
            title={
              <>
                Create New <br></br> Account
              </>
            }
          />
          <form className="pt-5" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "This is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <IonItem lines="full">
                  <IonInput
                    label="Name"
                    autoCapitalize="on"
                    placeholder="Enter your name"
                    onBlur={onBlur}
                    onIonInput={onChange}
                    value={value}
                    type="text"
                    labelPlacement="floating"
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
                <IonItem lines="full">
                  <IonInput
                    label="Email"
                    placeholder="Enter email"
                    onBlur={onBlur}
                    onIonInput={onChange}
                    value={value}
                    type="email"
                    labelPlacement="floating"
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
                <IonItem className="pt-4" lines="full">
                  <IonInput
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    labelPlacement="floating"
                    placeholder="Enter password"
                    onIonInput={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                  <IonIcon
                    onClick={() => setShowPassword(!showPassword)}
                    color="primary"
                    slot="end"
                    icon={showPassword ? eye : eyeOff}
                  />
                </IonItem>
              )}
            />
            <div className="pt-4">
              <IonButton
                shape="round"
                type="submit"
                className="btn-margin-20"
                expand="block"
              >
                {loading && <IonSpinner slot="start" name="lines-small" />} Sign
                up
              </IonButton>
            </div>
          </form>
          <SocialAuth />
          <div className="flex flex-column justify-content-center align-items-center flex-grow-1">
            <IonText className="pb-4 mt-auto">
              <p className="ion-text-center">
                Already have a account? <Link to="/login">Login</Link>
              </p>
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
