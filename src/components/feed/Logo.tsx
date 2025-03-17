import { IonAvatar } from "@ionic/react";

type Props = {
  url: string;
};
const Logo = ({ url }: Props) => {
  return (
    <>
      <div
        className="absolute flex justify-content-center align-items-center shadow-1"
        style={{
          width: "60px",
          height: "60px",
          top: "40%",
          right: "40%",
          borderRadius: "50%",
          backgroundColor: "white",
        }}
      >
        <IonAvatar style={{ width: "50px", height: "50px" }}>
          <img alt="Silhouette of a person's head" src={url} />
        </IonAvatar>
      </div>
    </>
  );
};

export default Logo;
