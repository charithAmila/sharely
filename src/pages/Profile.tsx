import {
  IonButton,
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
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";
import {
  openOutline,
  pencil,
  personCircleOutline,
  trashOutline,
} from "ionicons/icons";
import { useMemo, useRef, useState } from "react";
import UserEdit from "../components/user/UserEdit";
import UserPasswordEdit from "../components/user/UserPasswordEdit";
import { useTabIcon } from "../hooks/useTabIcon";
import { useAppContext } from "../context/MainContext";
import Pro from "./Pro";

const Profile = () => {
  const [presentAlert] = useIonAlert();
  const { user, updateUser, logout } = useAuthContext();
  const { deleteAccount } = useAppContext();
  const [deleting, setDeleting] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  useTabIcon();

  const [modalType, setModalType] = useState<
    "editUser" | "resetPassword" | "subscribe"
  >("editUser");

  const menu = [
    {
      name: "Subscription Plans",
      icon: personCircleOutline,
      url: "/tabs/subscribe",
    },
    {
      name: "Privacy Policy",
      icon: openOutline,
      onClick: () => {
        window.open("https://sharelyplatform.com/privacy-notice", "_blank");
      },
    },
    {
      name: "Terms of Use",
      icon: openOutline,

      onClick: () => {
        window.open(
          "https://sharelyplatform.com/terms-and-conditions",
          "_blank"
        );
      },
    },
    {
      name: "Delete Account",
      icon: trashOutline,
      onClick: () => {
        presentAlert({
          header: "Delete Account",
          message: "Are you sure you want to delete your account?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "Delete",
              role: "destructive",
              handler: async () => {
                setDeleting(true);
                await deleteAccount();
                setDeleting(false);
              },
            },
          ],
        });
      },
    },
  ];

  if (deleting) {
    return (
      <IonPage>
        <IonContent>
          <div
            className="flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <IonSpinner color="primary" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const renderModalContent = () => {
    switch (modalType) {
      case "editUser":
        return (
          <UserEdit
            updateUser={updateUser}
            initialValue={user}
            closeModal={() => {
              modal.current?.dismiss();
            }}
          />
        );
      case "resetPassword":
        return (
          <UserPasswordEdit
            closeModal={() => {
              modal.current?.dismiss();
            }}
          />
        );
      case "subscribe":
        return <Pro closeModal={() => modal.current?.dismiss()} />;
      default:
        return null;
    }
  };

  const modelSizeProps = useMemo(() => {
    if (modalType !== "subscribe") {
      return {
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.5, 0.75, 1],
      };
    }

    return {
      initialBreakpoint: undefined,
      breakpoints: undefined,
    };
  }, [modalType]);

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
            onClick={() => {
              setModalType("editUser");
              modal.current?.present();
            }}
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
          {menu.map((item) => {
            const itemProps: any = {};

            if (item.onClick) {
              itemProps.onClick = item.onClick;
            }

            if (item.url) {
              itemProps.routerLink = item.url;
            }

            return (
              <IonItem key={item.name} button {...itemProps}>
                <IonIcon slot="start" icon={item.icon} />
                <IonLabel>{item.name}</IonLabel>
              </IonItem>
            );
          })}
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
        <IonModal ref={modal} trigger="open-modal" {...modelSizeProps}>
          {renderModalContent()}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
