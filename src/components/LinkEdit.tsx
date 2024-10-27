import {
  IonButton,
  IonChip,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonText,
  IonTextarea,
  useIonToast,
} from "@ionic/react";
import CompactCard from "./CompactCard";
import ThinDivider from "./ThinDivider";
import { add, close, closeCircle } from "ionicons/icons";
import { useAppContext } from "../context/MainContext";
import { useEffect, useState } from "react";
import NoteForm from "./NoteForm";
import TagSelector from "./TagSelector";

type Props = {
  item: SharedItem;
  tags: Tag[];
  closeModal: () => void;
};

const LinkEdit = ({ item, tags, closeModal }: Props) => {
  const { updateItem } = useAppContext();
  const [selectedItem, setSelectedItem] = useState<SharedItem>(item);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"note" | "tags">("note");
  const [present] = useIonToast();

  useEffect(() => {
    setSelectedItem(item);
  }, [item]);

  const onClickRemoveTag = (tagId: string) => {
    const newTags = item.tags.filter((tag) => tag !== tagId);
    setSelectedItem({ ...selectedItem, tags: newTags });
  };

  const onClickSave = async () => {
    await updateItem({ ...selectedItem }, item.id);

    present({
      message: "Note saved successfully",
      duration: 1500,
      position: "top",
      color: "success",
    });

    closeModal();
  };

  const renderChips = () => {
    return (
      <div className="flex flex-wrap gap-2 pt-2">
        <IonChip
          onClick={() => {
            setModalType("tags");
            setIsOpen(true);
          }}
          color={"primary"}
          outline
        >
          <IonIcon icon={add} size="small"></IonIcon>
          <IonLabel>Add New Tag</IonLabel>
        </IonChip>
        {(tags.filter((tag) => selectedItem.tags.includes(tag.id)) || []).map(
          (tag: Tag) => (
            <IonChip color={"primary"} outline key={tag.id}>
              <IonLabel>{tag.name}</IonLabel>
              <IonIcon
                onClick={() => {
                  onClickRemoveTag(tag.id);
                }}
                size="small"
                icon={closeCircle}
              ></IonIcon>
            </IonChip>
          )
        )}
      </div>
    );
  };

  return (
    <div className="ion-padding flex flex-column gap-2">
      <IonRow>
        <IonCol>
          <IonText color="dark" className="font-bold font-large">
            <p>Edit Link</p>
          </IonText>
        </IonCol>
        <IonCol className="flex justify-content-end">
          <IonButton
            color={"medium"}
            fill="clear"
            className="ml-auto"
            onClick={closeModal}
          >
            <IonIcon slot="icon-only" className="font-large" icon={close} />
          </IonButton>
        </IonCol>
      </IonRow>

      {item && <CompactCard item={item} />}
      <br />
      <ThinDivider />
      <IonText color="dark">
        <h5>Tags</h5>
      </IonText>
      {renderChips()}
      <br />
      <ThinDivider />
      <IonText color="dark">
        <h5>Note</h5>
      </IonText>
      <IonItem lines="full">
        <IonTextarea
          readonly
          onClick={() => {
            setModalType("note");
            setIsOpen(true);
          }}
          autoGrow
          value={selectedItem.note}
          onIonInput={(e) => {
            setSelectedItem({ ...selectedItem, note: e.detail.value! });
          }}
          placeholder="Add a note"
        />
      </IonItem>
      <br />
      <br />
      <div className="w-full">
        <IonButton
          disabled={
            !(
              item.note !== selectedItem.note || item.tags !== selectedItem.tags
            )
          }
          style={{ color: "white" }}
          expand="block"
          onClick={onClickSave}
        >
          Done
        </IonButton>
      </div>
      <IonModal isOpen={isOpen}>
        {modalType === "note" ? (
          <NoteForm
            onClickSave={() => setIsOpen(false)}
            setIsOpen={() => setIsOpen(false)}
            note={selectedItem.note || ""}
            setNote={(e: string) =>
              setSelectedItem({ ...selectedItem, note: e })
            }
          />
        ) : (
          <TagSelector
            onClickDone={(tags: Tag[]) => {
              setSelectedItem({
                ...selectedItem,
                tags: tags.map((tag) => tag.id),
              });
              setIsOpen(false);
            }}
            title="Select Tags"
            setIsOpen={() => setIsOpen(false)}
            selectedTags={
              tags.filter((tag) => selectedItem.tags.includes(tag.id)) || []
            }
          />
        )}
      </IonModal>
    </div>
  );
};

export default LinkEdit;
