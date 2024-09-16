import { IonText } from "@ionic/react";
import Logo from "../../assets/svg/ExpandedLogo";
import React from "react";

type Props = {
  logo?: React.ReactNode;
  title: React.ReactNode | string;
};

export default function AuthHeader({ logo, title }: Props) {
  return (
    <>
      <div className="flex align-items-start pt-8">
        {logo ? logo : <Logo />}
      </div>
      <div>
        <IonText>
          <h1 className="ion-text-left font-2xl font-bold">{title}</h1>
        </IonText>
      </div>
    </>
  );
}
