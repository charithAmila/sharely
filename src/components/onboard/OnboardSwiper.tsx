import { IonText, IonButton } from "@ionic/react";
import ExpandedLogo from "../../assets/svg/ExpandedLogo";

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
    <div className="flex flex-column h-100vh">
      <div className="flex align-items-start pt-5">
        <ExpandedLogo />
      </div>
      <div className="" style={{ height: "55vh" }}>
        {img}
      </div>
      <IonText>
        <h1 className="ion-text-left font-2xl font-bold">{title}</h1>
      </IonText>
      <IonText className="ion-text-left font-regular font-xs">
        {description}
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
  );
}
