import { useEffect, useMemo, useRef, useState } from "react";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonContent,
  IonHeader,
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
import { Clipboard } from "@capacitor/clipboard";
import NoteForm from "../components/NoteForm";
import TagSelector from "../components/TagSelector";
import { isUrl } from "../helpers";
import dayjs from "dayjs";
import { getOrdinalSuffix } from "../utils/constant";
import ThinDivider from "../components/ThinDivider";
import MediaPreview from "../components/MideaPreview";
import _ from "lodash";
import DeviceWrapper from "../components/DeviceWrapper";

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

  const writeToClipboard = async () => {
    await Clipboard.write({
      string: item?.url || item?.content,
    });
  };

  const title = () => {
    if (!item) return;

    let _title = `${dayjs(item.createdAt).format("DD")} ${getOrdinalSuffix(
      dayjs(item.createdAt).date()
    )}, ${dayjs(item.createdAt).format("dddd")} `;

    const sub = `${
      dayjs().isSame(item.createdAt, "day")
        ? "Today"
        : dayjs().subtract(1, "day").isSame(item.createdAt, "day")
        ? "Yesterday"
        : dayjs(item.createdAt).format("MMMM, YYYY")
    }`;

    return (
      <div className="flex flex-column">
        <IonText className="font-sx">{sub}</IonText>
        <IonText className="font-20">{_title}</IonText>
      </div>
    );
  };

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
      />
    );
  };

  const metadata = useMemo(() => {
    if (!item) return;
    if (!_.isEmpty(item.metadata)) {
      return {
        ...item.metadata,
        contentType: "image",
      };
    }
    let metadata: any = {};
    if (item.fileURL) {
      metadata.image = {
        url: item.fileURL,
      };
    }

    metadata.contentType = item?.contentType || "image";

    const isUrlYoutube = (url: string) => {
      return url?.includes("youtube.com");
    };

    if (item.contentType === "text") {
      if (isUrlYoutube(item.url || item.content || "")) {
        metadata = {
          ...metadata,
          image: {
            url: item.url || item.content,
          },
          contentType: "video",
        };
      }

      if (!metadata.description) {
        metadata.description = item.url || item.content;
      }
    }

    return metadata;
  }, [item]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar class="white-header">
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{title()}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
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
              }}
            >
              Delete
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ background: "#EEF0F5" }} fullscreen scrollY={true}>
        <DeviceWrapper>
          <IonCard className="main-card">
            <div
              style={{
                backgroundColor: "#EEF0F5",
              }}
            >
              {metadata?.image && (
                <div className="relative">
                  {metadata.logo && (
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
                        <img
                          alt="Silhouette of a person's head"
                          src={metadata.logo.url}
                        />
                      </IonAvatar>
                    </div>
                  )}

                  <MediaPreview
                    url={metadata?.image?.url}
                    type={metadata.contentType}
                    contentType={item?.contentType}
                  />
                </div>
              )}
            </div>
          </IonCard>

          <div className="ion-padding flex flex-column gap-5">
            <div>
              <IonText className="text-lg font-large">
                {item?.metadata?.title}
              </IonText>
            </div>
            <div>
              <IonText>{item?.metadata?.description}</IonText>
            </div>
          </div>

          {item && item?.contentType !== "image" && (
            <>
              <div className="ion-padding">
                <ThinDivider />
              </div>
              <div className="flex ion-padding flex-column gap-4">
                <div className="flex-1 flex gap-5 align-items-center">
                  {item?.metadata?.logo && (
                    <IonAvatar style={{ width: "25px", height: "25px" }}>
                      <img
                        alt="Silhouette of a person's head"
                        src={item.metadata.logo.url}
                      />
                    </IonAvatar>
                  )}
                  {metadata.publisher && (
                    <IonText className="">{metadata.publisher}</IonText>
                  )}
                  <div style={{ marginLeft: "auto" }} className="font-bold">
                    <IonButton
                      className="font-bold"
                      fill="clear"
                      onClick={writeToClipboard}
                    >
                      Copy Link
                    </IonButton>
                  </div>
                </div>
              </div>
              <div className="ion-padding">
                <IonText
                  onClick={() => linkRef?.current?.click()}
                  color={"primary"}
                >
                  {item?.url || item?.content}
                </IonText>
              </div>
            </>
          )}
          <div className="ion-padding">
            <ThinDivider />
          </div>
          <div className="ion-padding flex flex-column gap-5">
            <div className="flex align-items-center">
              <div>
                <IonText className="font-sx">Note</IonText>
              </div>
              <div style={{ marginLeft: "auto" }} className="font-bold">
                <IonText
                  onClick={() => {
                    setModalType("note");
                    setIsOpen(true);
                  }}
                  color={"primary"}
                >
                  Edit
                </IonText>
              </div>
            </div>
            <div>
              <IonText className="font-sx" color="medium">
                {item?.note || "No note"}
              </IonText>
            </div>
          </div>
          <div className="ion-padding">
            <ThinDivider />
          </div>
          <div className="ion-padding flex flex-column gap-5">
            <div className="flex align-items-center">
              <div>
                <IonText className="font-sx">Tags</IonText>
              </div>
              <div style={{ marginLeft: "auto" }} className="font-bold">
                <IonText
                  onClick={() => {
                    setModalType("tags");
                    setIsOpen(true);
                  }}
                  color={"primary"}
                >
                  Edit
                </IonText>
              </div>
            </div>
            <div>
              {item?.tags?.map((tag) => (
                <IonChip key={tag}>
                  {tags.find((t) => t.id === tag)?.name}
                </IonChip>
              ))}
            </div>
          </div>
        </DeviceWrapper>
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
            onClickDone={async (tags) => {
              await updateItem({ tags: tags.map((tag) => tag.id) }, id);
              setIsOpen(false);
            }}
            selectedTags={
              tags.filter((tag) => item?.tags?.includes(tag.id)) || []
            }
            title="Manage Tags"
            setIsOpen={setIsOpen}
          />
        )}
      </IonModal>
      {renderLink()}
    </IonPage>
  );
};

export default ItemDetail;
