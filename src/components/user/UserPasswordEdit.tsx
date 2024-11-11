import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonText,
} from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { c } from "vitest/dist/reporters-5f784f42";

type Props = {
  closeModal: () => void;
};

const UserPasswordEdit = ({ closeModal }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, watch } = useForm<{ password: string }>();

  const { resetPassword } = useAuthContext();

  const password = watch("password");

  console.log("password", password);

  const onClickDone = async ({ password }: { password: string }) => {
    try {
      if (!password || password.trim().length < 6) {
        return;
      }

      resetPassword(password);
      closeModal();
    } catch (error) {}
  };

  return (
    <div className="flex flex-column gap-2">
      <>
        <IonList>
          <IonListHeader>
            <IonLabel>Reset Password</IonLabel>
          </IonListHeader>
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
                <IonItem className={errors.password ? "error-item" : ""}>
                  <IonInput
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    labelPlacement="floating"
                    placeholder="Enter password"
                    value={value}
                    onIonInput={(e) => onChange(e.detail.value!)}
                    onIonBlur={onBlur}
                  />
                  <IonIcon
                    onClick={() => setShowPassword(!showPassword)}
                    color="primary"
                    slot="end"
                    icon={showPassword ? eye : eyeOff}
                  />
                  {value && value.trim().length > 0 && (
                    <IonButton
                      fill="clear"
                      className="font-bold"
                      slot="end"
                      onClick={() => handleSubmit(onClickDone)()}
                    >
                      Reset
                    </IonButton>
                  )}
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
        </IonList>
      </>
    </div>
  );
};

export default UserPasswordEdit;
