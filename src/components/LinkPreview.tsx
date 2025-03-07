import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonAvatar,
  IonIcon,
  IonText,
  IonButton,
  useIonAlert,
  useIonToast,
  useIonRouter,
} from "@ionic/react";
import { createOutline, openOutline, trashOutline } from "ionicons/icons";
import { isUrl, truncateText } from "../helpers";
import { useMemo, useRef } from "react";
import ThinDivider from "./ThinDivider";
import { useAppContext } from "../context/MainContext";
import MediaPreview from "./MideaPreview";
import _ from "lodash";

type Props = {
  item: SharedItem;
  selectedTags: { id: string; name: string }[];
  tags: Tag[];
  onClickEdit: () => void;
};

const LinkPreview = ({ item, tags, onClickEdit }: Props) => {
  const { push } = useIonRouter();

  const linkRef = useRef<HTMLAnchorElement>(null);
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();
  const { deleteItem } = useAppContext();

  const renderChips = () => {
    const first3Tags = item.tags.slice(0, 3);
    return (
      <div className="flex gap-2 pt-2">
        {(tags.filter((tag) => first3Tags.includes(tag.id)) || []).map(
          (tag: Tag) => (
            <IonChip outline key={tag.id}>
              {tag.name}
            </IonChip>
          )
        )}

        {item.tags.length > 3 && (
          <IonChip outline>+{item.tags.length - 3} more</IonChip>
        )}
      </div>
    );
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

  const cardFooter = () => {
    return (
      <div className="flex flex-column gap-5">
        {renderChips()}
        <ThinDivider />
        <div className="flex align-items-center">
          <div className="flex-1 flex justify-content-start">
            <IonButton
              onClick={(e) => {
                e.stopPropagation();
                onClickEdit();
              }}
              color="medium"
              fill="clear"
              size="small"
            >
              <IonIcon slot="start" icon={createOutline} />
              Edit
            </IonButton>
          </div>
          <div className="flex-1 flex justify-content-center">
            <IonButton
              color="medium"
              fill="clear"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                linkRef.current?.click();
              }}
            >
              <IonIcon slot="start" icon={openOutline} />
              Open
            </IonButton>
          </div>
          <div className="flex-1 flex justify-content-end">
            <IonButton
              color="medium"
              fill="clear"
              size="small"
              onClick={(e) => {
                try {
                  e.stopPropagation();
                  presentAlert({
                    header: "Delete Item",
                    message: "Are you sure you want to delete this item?",
                    buttons: [
                      "Cancel",
                      {
                        text: "Delete",
                        handler: () => {
                          if (item) {
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
                } catch (error) {}
              }}
              // routerLink={`item/${item.id}`}
            >
              <IonIcon slot="start" icon={trashOutline} />
              Delete
            </IonButton>
          </div>
        </div>
      </div>
    );
  };

  const metadata = useMemo(() => {
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

    if (item.contentType === "text") {
      metadata.description = item.content;
    }

    return metadata;
  }, [item.metadata]);

  return (
    <>
      {metadata && (
        <>
          <IonCard
            onClick={() => {
              if (item.type === "HOW_TO_USE") {
                push(`/tabs/how-to-use`);
                return;
              }
              push(`/tabs/item/${item.id}`);
            }}
            className="main-card"
          >
            <div
              style={{
                backgroundColor: "#EEF0F5",
                borderRadius: "8px",
                border: "1px solid #C3C9DA",
              }}
            >
              {metadata.image && (
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
                  />
                </div>
              )}
              <div>
                <IonCardHeader>
                  <div className="flex gap-4 align-items-center">
                    <IonCardSubtitle>
                      {truncateText(metadata.title, 25)}
                    </IonCardSubtitle>
                  </div>
                </IonCardHeader>
                <IonCardContent className="flex flex-column gap-4">
                  {metadata.publisher && (
                    <IonText>{truncateText(metadata.publisher, 38)}</IonText>
                  )}

                  {metadata.url && (
                    <IonText color={"primary"}>
                      {truncateText(metadata.url, 38)}
                    </IonText>
                  )}

                  {metadata.description && (
                    <IonText>{truncateText(metadata.description, 100)}</IonText>
                  )}
                </IonCardContent>
              </div>
            </div>
            {item.type === "HOW_TO_USE" ? <></> : cardFooter()}
          </IonCard>
          {renderLink()}
        </>
      )}
    </>
  );
};

export default LinkPreview;
