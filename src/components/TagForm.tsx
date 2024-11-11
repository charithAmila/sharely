import {
  IonItem,
  IonInput,
  IonButton,
  useIonToast,
  IonList,
  IonListHeader,
  IonLabel,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/MainContext";

type Props = {
  onSuccess: () => void;
  initialValue?: Tag;
};
const TagForm = ({ onSuccess, initialValue }: Props) => {
  const [tagName, setTagName] = useState<string | undefined | null>("");
  const { createTag, updateTag } = useAppContext();
  const [present] = useIonToast();

  useEffect(() => {
    if (initialValue) {
      setTagName(initialValue.name);
    }
  }, [initialValue]);

  const onClickDone = async () => {
    try {
      if (!tagName) return;

      if (tagName.trim().length > 0) {
        if (initialValue) {
          await updateTag({ name: tagName }, initialValue.id);
          onSuccess();
          present({
            message: "Tag updated successfully",
            duration: 1500,
            position: "top",
            color: "success",
          });
          return;
        }

        await createTag(tagName);
        setTagName("");
        onSuccess();
        present({
          message: "Tag created successfully",
          duration: 1500,
          position: "top",
          color: "success",
        });
      } else {
        present({
          message: "Please enter tag name",
          duration: 1500,
          position: "top",
          color: "danger",
        });
      }
    } catch (error: any) {
      present({
        message: error.message,
        duration: 1500,
        position: "top",
        color: "danger",
      });
    }
  };
  return (
    <>
      <IonList>
        <IonListHeader>
          <IonLabel>{initialValue ? "Edit Tag" : "Create Tag"}</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonInput
            placeholder="Enter Tag Name"
            value={tagName}
            onIonInput={(e) => setTagName(e.detail.value)}
          />
          {tagName && tagName.trim().length > 0 && (
            <IonButton
              fill="clear"
              className="font-bold"
              slot="end"
              onClick={() => onClickDone()}
            >
              Done
            </IonButton>
          )}
        </IonItem>
      </IonList>
    </>
  );
};

export default TagForm;
