import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
} from "@ionic/react";
import TagList from "./TagList";
import { useEffect, useState } from "react";

type Props = {
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  selectedTags: Tag[];
  onClickDone: (tags: Tag[]) => void;
};

export default function TagSelector({ title, setIsOpen, ...rest }: Props) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    setSelectedTags(rest.selectedTags);
  }, [rest.selectedTags]);

  const onClickTag = (tag: Tag) => {
    setSelectedTags(
      selectedTags.map((t) => t.id).includes(tag.id)
        ? selectedTags.filter((t) => t.id !== tag.id)
        : [...selectedTags, tag]
    );
  };

  const onClickSave = () => {
    rest.onClickDone(selectedTags);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onClickSave()}>Done</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <TagList
          view="list"
          onClickTag={onClickTag}
          selectedTags={selectedTags}
        />
      </IonContent>
    </>
  );
}
