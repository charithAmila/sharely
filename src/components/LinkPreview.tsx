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
} from "@ionic/react";
import { linkOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { truncateText } from "../helpers";

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

const LinkPreview = ({ item, selectedTags, onClickTag, tags }: LinkPreviewProps) => {

  const { metadata } = item;

  const renderChips = () => {
    return (
      <>
        {(item.tags || []).map((tag: Tag) => (
          <IonChip
            key={tag.id}
            onClick={() => onClickTag(tags.find((t) => t.id === tag.id)!)}
            color={
              selectedTags.find((t) => t.id === tag.id)
                ? "warning"
                : "primary"
            }
          >
            {tag.name}
          </IonChip>
        ))}
      </>
    )
  }

  if (!metadata) {
    if (item.content) {
      return (
        <IonCard>
          <div className="ion-padding">
            <IonText>{truncateText(item.content, 100)}</IonText>
          </div>
          <div className="flex gap-2 justify-content-start pt-10 flex-wrap">
            {renderChips()}
          </div>
        </IonCard>
      )
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
          <IonCard>
            {metadata.image && (
              <img
                src={metadata?.image?.url}
                style={{ maxHeight: "300px", width: "100%" }}
                alt="Preview"
              />
            )}
            <IonCardHeader>
              <div className="flex gap-4 align-items-center">
                {metadata.logo && (
                  <IonAvatar style={{ width: "30px", height: "30px" }}>
                    <img
                      alt="Silhouette of a person's head"
                      src={metadata.logo.url}
                    />
                  </IonAvatar>
                )}
                <IonCardSubtitle>{truncateText(metadata.title, 25)}</IonCardSubtitle>
              </div>
            </IonCardHeader>
            <IonCardContent>
              {metadata.description && truncateText(metadata.description, 100)}
              <div className="flex gap-2 justify-content-start pt-10 flex-wrap">
                {renderChips()}
              </div>
              <div className="flex justify-content-end align-items-center">
                <IonButton fill="clear" size="small"  routerLink={`item/${item.id}`}>Read</IonButton>
                <a
                  href={metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IonIcon icon={linkOutline} />
                </a>
              </div>
            </IonCardContent>
          </IonCard>
        </>
      )}
    </>
  );
};

export default LinkPreview;
