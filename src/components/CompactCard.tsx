import { IonText } from "@ionic/react";
import { truncateText } from "../helpers";

type Props = {
  item: SharedItem;
};
const CompactCard = ({ item }: Props) => {
  return (
    <div
      className="w-full flex"
      style={{ borderRadius: "8px", backgroundColor: "#E2E7F3" }}
    >
      <div className="w-3 p-2">
        <img
          src={item.metadata.image.url}
          alt={item.metadata.title}
          style={{ minHeight: "100%", maxHeight: 150, borderRadius: "8px" }}
        />
      </div>
      <div
        className="w-9 bg-secondary p-2 flex flex-column justify-content-between"
        style={{}}
      >
        <IonText className="font-regular font-lg font-bold">
          <span>{truncateText(item.metadata.title, 30)}</span>
        </IonText>

        <IonText className="font-regular font-xs text-medium">
          <span>{truncateText(item.metadata.description, 50)}</span>
        </IonText>
        {item.metadata.url && (
          <IonText color={"primary"}>
            {truncateText(item.metadata.url, 30)}
          </IonText>
        )}
      </div>
    </div>
  );
};

export default CompactCard;
