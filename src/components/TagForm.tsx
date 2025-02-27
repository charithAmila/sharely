import {
  IonItem,
  IonInput,
  IonButton,
  useIonToast,
  IonList,
  IonListHeader,
  IonLabel,
  IonText,
} from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/MainContext";
import { useAuthContext } from "../context/AuthContext";

type Props = {
  onSuccess: () => void;
  hideModal: () => void;
  initialValue?: Tag;
};
const TagForm = ({ onSuccess, initialValue, hideModal }: Props) => {
  const [tagName, setTagName] = useState<string | undefined | null>("");
  const { createTag, updateTag, settings, tags } = useAppContext();
  const { user } = useAuthContext();
  const [present] = useIonToast();

  useEffect(() => {
    if (initialValue) {
      setTagName(initialValue.name);
    }
  }, [initialValue]);

  const isTagLimitExceeded = useMemo(() => {
    if (user?.userType === "PRO") return false;

    if (!!user?.maxTagCount) {
      return tags.length >= user.maxTagCount;
    }

    return tags.length >= (settings?.maxTagCount || 0);
  }, [tags, settings, user]);

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
        {isTagLimitExceeded && !initialValue ? (
          <div className="ion-padding">
            <div
              className="flex flex-column gap-3rem ion-text-center"
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: "#E2E7F3",
                borderRadius: "10px",
                padding: "20px",
                border: "1px solid #C3C9DA",
              }}
            >
              <IonText className="font-large">
                Sorry, Tag limit exceeded
              </IonText>
              <IonText className="font-bold">
                Max Tags: {settings?.maxTagCount}
              </IonText>
              <IonText className="font-sm">
                Upgrade your plan to add more tags
              </IonText>
            </div>

            <br />
            <IonButton
              onClick={() => {
                hideModal();
              }}
              routerLink="/tabs/subscribe"
              expand="block"
              color="primary"
            >
              Upgrade
            </IonButton>
          </div>
        ) : (
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
        )}
      </IonList>
    </>
  );
};

export default TagForm;
