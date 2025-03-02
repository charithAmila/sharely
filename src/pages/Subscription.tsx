import { useEffect, useRef } from "react";
import { IonContent, IonModal, IonPage, useIonRouter } from "@ionic/react";
import Pro from "./Pro";

type Props = {
  onClickSkip?: () => void;
};
export default function Subscription({ onClickSkip }: Props) {
  const modal = useRef<HTMLIonModalElement>(null);
  const { goBack } = useIonRouter();

  useEffect(() => {
    modal.current?.present();
  }, []);

  return (
    <IonPage>
      <IonContent
        className="ion-padding"
        style={{
          background:
            "linear-gradient(to top,rgb(8, 102, 216) 0%, #0172fc 100%)",
        }}
      >
        <IonModal ref={modal} trigger="open-modal">
          <Pro
            closeModal={() => {
              if (onClickSkip) {
                modal.current?.dismiss();
                onClickSkip();
                return;
              }

              modal.current?.dismiss();
              goBack();
            }}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
