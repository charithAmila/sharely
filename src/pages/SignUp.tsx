import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonSpinner,
  IonText,
  useIonRouter,
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
  const router = useIonRouter();

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
      <IonContent
        className="ion-padding"
        style={{ backgroundColor: "#f5f5f5" }}
        fullscreen
        scrollY={false}
      >
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
              render={({
                field: { onChange, onBlur, value },
                formState: { errors },
              }) => (
                <>
                  <IonItem className={errors.name && "error-item"}>
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
                  {errors.name && (
                    <IonText
                      className="ion-text-start ion-padding-start font-regular font-xxs"
                      color="danger"
                      slot="error"
                    >
                      {errors.name.message}
                    </IonText>
                  )}
                </>
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
              render={({
                field: { onChange, onBlur, value },
                formState: { errors },
              }) => (
                <>
                  <IonItem className={errors.email && "error-item"}>
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
                    className={`pt-4 ${errors.password && "error-item"}`}
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
          <div className="flex flex-row justify-content-center align-items-center">
            <IonButton fill="clear" onClick={() => router.goBack()}>
              <IonText color="dark" style={{ marginRight: "5px" }}>
                <p className="">Already have a account?</p>
              </IonText>{" "}
              Login
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
