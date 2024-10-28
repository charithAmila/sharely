import {
  IonButton,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { useAppContext } from "../context/MainContext";

type Props = {
  selectedTags: Tag[];
  onClickTag: (tag: Tag) => void;
  view?: "list" | "grid";
};
export default function TagList({
  selectedTags,
  onClickTag,
  view = "grid",
}: Props) {
  const { tags } = useAppContext();

  if (view === "list") {
    return (
      <>
        <IonList>
          {tags.map((tag: Tag) => (
            <IonItem key={tag.id}>
              <IonLabel>{tag.name}</IonLabel>
              <IonCheckbox
                slot="end"
                onClick={() => onClickTag(tag)}
                checked={selectedTags.map((t) => t.id).includes(tag.id)}
              ></IonCheckbox>
            </IonItem>
          ))}
        </IonList>
      </>
    );
  }

  return (
    <div>
      {tags.map((tag: Tag) => (
        <IonButton
          key={tag.id}
          shape="round"
          size="small"
          fill={
            selectedTags.map((t) => t.id).includes(tag.id) ? "solid" : "outline"
          }
          onClick={() => onClickTag(tag)}
        >
          {tag.name}
        </IonButton>
      ))}
    </div>
  );
}
