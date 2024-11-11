import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
} from "@ionic/react";
import { useEffect, useState } from "react";

type Props = {
  closeModal: () => void;
  initialValue?: AuthUser | null;
  updateUser: (user: Partial<AuthUser>) => Promise<void>;
};

const UserEdit = ({ closeModal, initialValue, updateUser }: Props) => {
  const [userName, setUserName] = useState<string | undefined | null>("");

  useEffect(() => {
    if (initialValue) {
      setUserName(initialValue.name);
    }
  }, [initialValue]);

  const onClickDone = () => {
    if (!userName) return;

    updateUser({ name: userName });
    closeModal();
  };

  return (
    <div className="flex flex-column gap-2">
      <>
        <IonList>
          <IonListHeader>
            <IonLabel>
              {initialValue ? "Edit User" : "Add User Details"}
            </IonLabel>
          </IonListHeader>
          <IonItem>
            <IonInput
              labelPlacement="floating"
              label="User Name"
              placeholder="Enter User Name"
              value={userName}
              onIonInput={(e) => setUserName(e.detail.value!)}
            />
            {userName &&
              userName.trim() !== initialValue?.name &&
              userName.trim().length > 0 && (
                <IonButton
                  fill="clear"
                  className="font-bold"
                  slot="end"
                  onClick={() => onClickDone()}
                >
                  Done
                </IonButton>
              )}
          </IonItem>
        </IonList>
      </>
    </div>
  );
};

export default UserEdit;
