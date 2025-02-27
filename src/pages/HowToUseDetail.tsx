import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonBackButton,
} from "@ionic/react";
import ReactPlayer from "react-player";
import { useAppContext } from "../context/MainContext";

const HowToUseDetail = () => {
  const { sharedItems } = useAppContext();

  const item = sharedItems.find((item) => item.id === "how-to-use");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="white-header">
          <IonTitle>How to use Sharely</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen style={{ background: "#EEF0F5" }}>
        <ReactPlayer
          {...(item?.metadata?.video || {})}
          controls
          width="100%"
          height={window.innerHeight - (window.innerHeight * 10) / 100}
        />
      </IonContent>
    </IonPage>
  );
};

export default HowToUseDetail;
