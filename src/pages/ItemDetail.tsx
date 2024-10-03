import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonCardSubtitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useParams } from "react-router";
import { useAppContext } from "../context/MainContext";
import {
  calendarClearOutline,
  createOutline,
  linkOutline,
  pricetagsOutline,
  trashOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import NoteForm from "../components/NoteForm";
import TagSelector from "../components/TagSelector";
import { isUrl } from "../helpers";

type Params = {
  id: string;
};
const ItemDetail = () => {
  const { id }: Params = useParams();
  const { goBack } = useIonRouter();
  const { sharedItems, updateItem, deleteItem, tags } = useAppContext();

  const item = sharedItems.find((item) => item.id === id);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"note" | "tags">("note");
  const [note, setNote] = useState(item?.note || "");
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setNote(item?.note || "");
  }, [item?.note]);

  const title = "Note Details";

  const menu = [
    {
      icon: createOutline,
      label: note.trim().length > 0 ? "Update Note" : "Write a Note",
      onClick: () => {
        setModalType("note");
        setIsOpen(true);
      },
    },
    {
      icon: pricetagsOutline,
      label: "Manage Tags",
      onClick: () => {
        setModalType("tags");
        setIsOpen(true);
      },
    },
    {
      icon: trashOutline,
      label: "Delete",
      onClick: () => {
        presentAlert({
          header: "Delete Item",
          message: "Are you sure you want to delete this item?",
          buttons: [
            "Cancel",
            {
              text: "Delete",
              handler: () => {
                if (item) {
                  goBack();
                  deleteItem(item);
                  present({
                    message: "Item deleted successfully",
                    duration: 1500,
                    position: "top",
                    color: "success",
                  });
                }
              },
            },
          ],
        });
      },
    },
    {
      icon: linkOutline,
      label: "Open",
      onClick: () => linkRef.current?.click(),
    },
  ];

  const onClickSave = async () => {
    if (note.trim().length > 0) {
      await updateItem({ note }, id);
      setIsOpen(false);
      present({
        message: "Note saved successfully",
        duration: 1500,
        position: "top",
        color: "success",
      });
    }
  };

  const renderLink = () => {
    let url = "";

    if (!item) {
      return null;
    }

    if (item.url && isUrl(item.url)) {
      url = item.url;
    } else if (item.content && isUrl(item.content)) {
      url = item.content;
    }

    if (!url) {
      return null;
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        ref={linkRef}
        style={{ display: "none" }}
      ></a>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">{title}</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={true}>
        {item?.metadata?.image && (
          <div className="p-10 bg-light">
            <IonImg className="h-30vh" src={item?.metadata?.image.url} />
          </div>
        )}
        <div className="flex ion-padding flex-column gap-4">
          {renderLink()}
          <div className="flex-1 flex gap-5 align-items-center">
            {item?.metadata?.logo && (
              <IonAvatar style={{ width: "35px", height: "35px" }}>
                <img
                  alt="Silhouette of a person's head"
                  src={item.metadata.logo.url}
                />
              </IonAvatar>
            )}
            {item?.metadata.publisher && (
              <IonCardSubtitle>
                {item?.metadata.publisher} (publisher){" "}
              </IonCardSubtitle>
            )}
          </div>
          <div className="flex-1 flex">
            {item?.createdAt && (
              <div className="flex align-items-center gap-4">
                <IonIcon color="primary" icon={calendarClearOutline} />
                <IonText>
                  {new Date(item.createdAt).toLocaleDateString()}
                </IonText>
              </div>
            )}
          </div>
        </div>
        <div className="ion-padding flex flex-column gap-5">
          <div>
            <IonText className="text-sm">{item?.metadata?.title}</IonText>
          </div>
          <div>
            {item?.tags?.map((tag) => (
              <IonChip key={tag}>
                {tags.find((t) => t.id === tag)?.name}
              </IonChip>
            ))}
          </div>
          <div>
            <IonText>{item?.metadata?.description}</IonText>
          </div>
        </div>
        <div className="flex flex-column gap-5">
          <IonList>
            {menu.map((item) => (
              <IonItem
                key={item.label}
                onClick={item.onClick || (() => {})}
                button
              >
                <IonIcon slot="start" icon={item.icon} />
                <IonLabel>{item.label}</IonLabel>
              </IonItem>
            ))}
          </IonList>

          {item?.note && (
            <div className="ion-padding bg-light">
              <IonText color="dark">
                <h1>Note</h1>
              </IonText>
              <IonText>{item?.note}</IonText>
            </div>
          )}
        </div>
      </IonContent>
      <IonModal isOpen={isOpen}>
        {modalType === "note" ? (
          <NoteForm
            onClickSave={onClickSave}
            setIsOpen={setIsOpen}
            note={note}
            setNote={setNote}
          />
        ) : (
          <TagSelector
            id={id}
            selectedTags={
              tags.filter((tag) => item?.tags?.includes(tag.id)) || []
            }
            title="Manage Tags"
            setIsOpen={setIsOpen}
          />
        )}
      </IonModal>
    </IonPage>
  );
};

export default ItemDetail;
