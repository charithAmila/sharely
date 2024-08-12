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
} from "@ionic/react";
import { linkOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface LinkPreviewProps {
  item: any;
  selectedTags: { id: string; name: string }[];
}

const LinkPreview = ({ item, selectedTags }: LinkPreviewProps) => {

  const { metadata } = item;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  if (!metadata) {
    return (
      <div className="ion-padding w-full">
        <IonSkeletonText
          className="w-full"
          style={{ height: "200px" }}
          animated={true}
        ></IonSkeletonText>
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
              <IonCardSubtitle>{metadata.title}</IonCardSubtitle>
              </div>
            </IonCardHeader>
            <IonCardContent>
              {metadata.description && truncateText(metadata.description, 100)}
              <div className="flex gap-2 justify-content-start pt-10 flex-wrap">
                {(item.tags || []).map((tag: string) => (
                  <IonChip
                    key={tag}
                    color={
                      selectedTags.find((t) => t.name === tag)
                        ? "warning"
                        : "primary"
                    }
                  >
                    {tag}
                  </IonChip>
                ))}
              </div>
              <div className="flex justify-content-end">
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
