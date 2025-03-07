import {
  IonButton,
  IonCol,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { eye, eyeOff } from "ionicons/icons";
import { useAuthContext } from "../context/AuthContext";
import { EMAIL_REGEX } from "../utils/constant";
import Logo from "../assets/svg/ExpandedLogo";
import AppleLogin from "../components/AppleLogin";
import GoogleLogin from "../components/GoogleLogin";
import AuthHeader from "../components/auth/AuthHeader";
import SocialAuth from "../components/auth/SocialAuth";

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
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = (data: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    signInWithEmailPassword({ email: data.email, password: data.password })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error?.code;
        const errorMessage = error?.message;
        present({
          color: "danger",
          duration: 2000,
          position: "top",
          message:
            errorCode === "auth/invalid-credential"
              ? `Invalid email or password`
              : errorMessage,
        });
      });
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" scrollY={false} fullscreen>
        <div className="flex flex-column h-100vh">
          <AuthHeader title="Sign in to your Account" />
          <form className="pt-5" onSubmit={handleSubmit(onSubmit)}>
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
              render={({
                field: { onChange, onBlur, value },
                formState: { errors },
              }) => (
                <>
                  <IonItem className={errors.email ? "error-item" : ""}>
                    <IonInput
                      onBlur={onBlur}
                      onIonInput={onChange}
                      value={value}
                      label="Email"
                      labelPlacement="floating"
                      placeholder="Enter email"
                    />
                  </IonItem>
                  {errors.email && (
                    <IonText
                      className="ion-text-start ion-padding-start font-regular font-xxs"
                      color="danger"
                      slot="error"
                    >
                      {errors.email.message}
                    </IonText>
                  )}
                </>
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "This is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                formState: { errors },
              }) => (
                <>
                  <IonItem
                    className={`pt-4 ${errors.password ? "error-item" : ""}`}
                  >
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
                  {errors.password && (
                    <IonText
                      className="ion-text-start ion-padding-start font-regular font-xxs"
                      color="danger"
                      slot="error"
                    >
                      {errors.password.message}
                    </IonText>
                  )}
                </>
              )}
            />
            <IonText className="ion-text-end font-bold" color="primary">
              <p>Forgot password?</p>
            </IonText>
            <div className="pt-4">
              <IonButton type="submit" color={"primary"} expand="block">
                {loading && <IonSpinner slot="start" name="lines-small" />}{" "}
                <IonText color="light">Sign In</IonText>
              </IonButton>
            </div>
          </form>
          <SocialAuth />
          <div className="flex flex-column justify-content-center align-items-center flex-grow-1">
            <IonText className="pb-4 mt-auto">
              <p className="ion-text-center">
                Don't have an account?{" "}
                <Link to="/sign-up">Create New Account</Link>
              </p>
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
