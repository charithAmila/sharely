import {
  IonButton,
  IonText,
  IonItem,
  IonInput,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import { useAppContext } from "../context/MainContext";
import TagList from "./TagList";

type Props = {
  tags: Tag[];
  selectedTags: Tag[];
  onClickTag: (tag: Tag) => void;
  showAddForm?: boolean;
  closeModal: () => void;
};

const TagsFilter = ({
  tags,
  selectedTags,
  onClickTag,
  showAddForm,
  closeModal,
}: Props) => {
  const [showForm, setShowForm] = useState(showAddForm || false);
  const [tagName, setTagName] = useState("");
  const { createTag } = useAppContext();
  const [present] = useIonToast();

  const onClickDone = () => {
    if (tagName.trim().length > 0) {
      createTag(tagName);
      setTagName("");

      if (showAddForm) {
        closeModal();
      } else {
        setShowForm(false);
      }

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
  };

  return (
    <>
      <div className="h-50vh ion-padding">
        {showForm ? (
          <>
            <IonText>
              <h1 className="ion-text-left font-large font-bold">
                Add New Tag
              </h1>
            </IonText>
            <IonItem>
              <IonInput
                placeholder="Enter Tag Name"
                value={tagName}
                onIonInput={(e) => e.detail.value && setTagName(e.detail.value)}
              />
              <IonButton
                shape="round"
                disabled={tagName.trim().length === 0}
                slot="end"
                onClick={() => onClickDone()}
              >
                Save
              </IonButton>
            </IonItem>
          </>
        ) : (
          <>
            {tags.length > 0 ? (
              <>
                <IonText>
                  <h1 className="ion-text-left font-large font-bold">
                    Filter by Tags
                  </h1>
                </IonText>
                <TagList selectedTags={selectedTags} onClickTag={onClickTag} />
              </>
            ) : (
              <>
                <div className="flex flex-column gap-4">
                  <IonText>No Tags</IonText>
                  <IonButton
                    expand="full"
                    shape="round"
                    fill="outline"
                    onClick={() => setShowForm(true)}
                  >
                    Add Tags
                  </IonButton>
                </div>
              </>
            )}
          </>
        )}
        <div
          className="w-full"
          style={{
            position: "absolute",
            bottom: "-5px",
            left: -1,
            width: "105%",
          }}
        >
          {!showForm ? (
            <>
              {tags.length > 0 && (
                <IonButton expand="full" onClick={() => setShowForm(true)}>
                  ADD NEW TAG
                </IonButton>
              )}
            </>
          ) : (
            <>
              <IonButton
                color={"danger"}
                expand="full"
                onClick={() => {
                  if (showAddForm) {
                    closeModal();
                    return;
                  }
                  setShowForm(false);
                }}
              >
                <IonText>CANCEL</IonText>
              </IonButton>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TagsFilter;
