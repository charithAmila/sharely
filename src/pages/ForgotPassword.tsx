import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonSpinner,
  IonText,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";
import AuthHeader from "../components/auth/AuthHeader";
import { useForm, Controller } from "react-hook-form";
import { EMAIL_REGEX } from "../utils/constant"; // Make sure you have this defined

interface IFormInput {
  email: string;
}

const ForgotPassword = () => {
  const { sendResetPasswordEmail } = useAuthContext();
  const [present] = useIonToast();
  const router = useIonRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    try {
      await sendResetPasswordEmail(data.email);
      reset();
      present({
        color: "success",
        duration: 2000,
        message: "Password reset link sent to your email",
      });
    } catch (error: any) {
      present({
        color: "danger",
        duration: 2000,
        message: "Error sending password reset link",
      });
    }
  };

  return (
    <IonPage>
      <IonContent
        className="ion-padding"
        style={{ backgroundColor: "#f5f5f5" }}
        scrollY={false}
        fullscreen
      >
        <div className="flex flex-column h-100vh">
          <AuthHeader title="Reset your Password" />

          <form className="pt-5" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <IonItem className={errors.email ? "error-item" : ""}>
                    <IonInput
                      label="Email"
                      labelPlacement="floating"
                      placeholder="Enter your email"
                      onIonInput={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  </IonItem>
                  {errors.email && (
                    <IonText
                      className="ion-text-start ion-padding-start font-regular font-xxs"
                      color="danger"
                    >
                      {errors.email.message}
                    </IonText>
                  )}
                </>
              )}
            />

            <div className="pt-4">
              <IonButton type="submit" expand="block" disabled={isSubmitting}>
                {isSubmitting && <IonSpinner slot="start" name="lines-small" />}
                Send Reset Link
              </IonButton>
            </div>
          </form>

          <div className="pt-2">
            <IonButton
              onClick={() => router.goBack()}
              expand="block"
              fill="clear"
              color="medium"
            >
              Back to Login
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
