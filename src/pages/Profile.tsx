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
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";
import { pencil, personCircleOutline, pricetagsOutline } from "ionicons/icons";

const Profile = () => {
  const { logout } = useAuthContext();
  const { user } = useAuthContext();

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
          <IonItem className="custom-ion-item">
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
          <IonItem className="custom-ion-item">
            <IonInput
              disabled
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
      </IonContent>
    </IonPage>
  );
};

export default Profile;
