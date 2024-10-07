import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonSkeletonText,
  IonThumbnail,
  IonAvatar,
  IonIcon,
  IonText,
  IonButton,
  IonItemDivider,
} from "@ionic/react";
import {
  createOutline,
  linkOutline,
  openOutline,
  trashOutline,
} from "ionicons/icons";
import { isUrl, truncateText } from "../helpers";
import { useRef } from "react";
import ThinDivider from "./ThinDivider";

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface LinkPreviewProps {
  item: SharedItem;
  selectedTags: { id: string; name: string }[];
  onClickTag: (tag: Tag) => void;
  tags: Tag[];
}

const LinkPreview = ({
  item,
  selectedTags,
  onClickTag,
  tags,
}: LinkPreviewProps) => {
  const { metadata } = item;

  const linkRef = useRef<HTMLAnchorElement>(null);

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
      ></a>
    );
  };

  if (!metadata) {
    if (item.content) {
      return (
        <IonCard>
          <div className="ion-padding">
            <IonText>{truncateText(item.content, 100)}</IonText>
          </div>

          {renderChips()}

          {renderLink()}
        </IonCard>
      );
    }

    return (
      <div className="ion-padding w-full">
        <IonSkeletonText
          className="w-full"
          style={{ height: "200px" }}
          animated={true}
        />
      </div>
    );
  }

  return (
    <>
      {metadata && (
        <>
          <IonCard className="main-card">
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
                  <img
                    src={metadata?.image?.url}
                    style={{
                      maxHeight: "225px",
                      width: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                    alt="Preview"
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
            <div className="flex flex-column gap-5">
              {renderChips()}
              <ThinDivider />
              <div className="flex align-items-center">
                <div className="flex-1 flex justify-content-start">
                  <IonButton
                    color="medium"
                    fill="clear"
                    size="small"
                    routerLink={`item/${item.id}`}
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
                    onClick={() => linkRef.current?.click()}
                  >
                    <IonIcon slot="start" icon={openOutline} />
                    Open Link
                  </IonButton>
                  {renderLink()}
                </div>
                <div className="flex-1 flex justify-content-end">
                  <IonButton
                    color="medium"
                    fill="clear"
                    size="small"
                    routerLink={`item/${item.id}`}
                  >
                    <IonIcon slot="start" icon={trashOutline} />
                    Delete
                  </IonButton>
                </div>
              </div>
            </div>
          </IonCard>
        </>
      )}
    </>
  );
};

export default LinkPreview;
