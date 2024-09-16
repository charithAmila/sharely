import { IonPage, IonContent, IonText, IonButton } from "@ionic/react";
import ExpandedLogo from "../../assets/svg/ExpandedLogo";
import OnBoardFirst from "../../assets/svg/OnBoardFirst";

type Props = {
  img: React.ReactNode;
  title: React.ReactNode | string;
  description?: React.ReactNode | string;
  buttonLabel?: string;
  onClickButton?: () => void;
};

export default function OnboardSwiper({
  img,
  title,
  description,
  buttonLabel,
  onClickButton,
}: Props) {
  return (
    <IonPage>
      <IonContent className="" fullscreen>
        <div className="flex flex-column h-100vh">
          <div className="flex align-items-start pt-8">
            <ExpandedLogo />
          </div>
          <div>{img}</div>
          <IonText>
            <h1 className="ion-text-left font-2xl font-bold">{title}</h1>
          </IonText>
          <IonText>
            <p className="ion-text-left font-regular font-xs">{description}</p>
          </IonText>
          <div className="flex justify-content-center align-items-end pb-6 flex-grow-1">
            <div className="w-full">
              <IonButton
                onClick={onClickButton}
                className="mt-auto"
                color="primary"
                expand="block"
              >
                <IonText color="light">{buttonLabel}</IonText>
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
