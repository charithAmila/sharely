import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";
import { pencil, personCircleOutline, pricetagsOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import UserEdit from "../components/user/UserEdit";
import UserPasswordEdit from "../components/user/UserPasswordEdit";

const Profile = () => {
  const { logout } = useAuthContext();
  const { user, updateUser } = useAuthContext();
  const modal = useRef<HTMLIonModalElement>(null);

  const [modalType, setModalType] = useState<"editUser" | "resetPassword">(
    "editUser"
  );

  const menu = [
    { name: "Tags", url: "/tabs/tags", icon: pricetagsOutline },
    {
      name: "Subscription Plans",
      icon: personCircleOutline,
      url: "/tabs/subscribe",
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false} fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div
          style={{ backgroundColor: "#eef0f5" }}
          className="w-full ion-padding"
        >
          <IonText className="font-bold">Your Information</IonText>
          <IonItem
            onClick={() => modal.current?.present()}
            className="custom-ion-item"
          >
            <IonInput
              readonly
              label="Name"
              labelPlacement="floating"
              placeholder="Enter text"
              value={user?.name}
            />
            <IonIcon slot="end" color="primary" icon={pencil} />
          </IonItem>
          <IonItem className="custom-ion-item">
            <IonInput
              readonly
              label="Email"
              labelPlacement="floating"
              placeholder="Enter text"
              value={user?.email}
            />
          </IonItem>
          <IonItem
            onClick={() => {
              setModalType("resetPassword");
              modal.current?.present();
            }}
            className="custom-ion-item"
          >
            <IonInput
              readonly
              label="Reset Password"
              labelPlacement="floating"
              placeholder="Enter text"
              type="password"
            />
            <IonIcon slot="end" color="primary" icon={pencil} />
          </IonItem>
        </div>
        <IonList>
          <IonListHeader>
            <IonLabel className="font-sm">
              Personalize Your Tags & Plan
            </IonLabel>
          </IonListHeader>
          {menu.map((item) => (
            <IonItem key={item.name} button routerLink={item.url}>
              <IonIcon slot="start" icon={item.icon} />
              <IonLabel>{item.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <div className="ion-padding">
          <IonButton
            fill="outline"
            shape="round"
            expand="block"
            onClick={() => {
              localStorage.removeItem("isOnBoarded");
              logout();
            }}
          >
            Logout
          </IonButton>
        </div>
        <IonModal
          ref={modal}
          trigger="open-modal"
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5, 0.75, 1]}
        >
          {modalType === "editUser" ? (
            <UserEdit
              updateUser={updateUser}
              initialValue={user}
              closeModal={() => {
                modal.current?.dismiss();
              }}
            />
          ) : (
            <UserPasswordEdit
              closeModal={() => {
                modal.current?.dismiss();
              }}
            />
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
