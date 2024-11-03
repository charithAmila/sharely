import { useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton,
  IonModal,
  useIonAlert,
  IonLabel,
} from "@ionic/react";
import { useAppContext } from "../context/MainContext";
import { add, trash } from "ionicons/icons";
import { addIcons } from "ionicons";
import ThickPencil from "../assets/icons/thick-pencil.svg";
import TagForm from "../components/TagForm";
import dayjs from "dayjs";

addIcons({
  "thick-pencil": ThickPencil,
});

const Tags = () => {
  const { tags, deleteTag, linksCount } = useAppContext();
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const modal = useRef<HTMLIonModalElement>(null);
  const [presentAlert] = useIonAlert();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tags</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setSelectedTag(undefined);
                modal.current?.present();
              }}
            >
              <IonIcon icon={add} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size={"large"}>Mange Tags</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {tags.map((tag) => {
            const tagCountObj = linksCount.find(
              (l) => Object.keys(l)[0] === tag.id
            );
            const tagCount = Object.values(tagCountObj || {})[0];

            return (
              <IonItem key={tag.id}>
                <IonLabel>
                  <h2>{tag.name}</h2>
                  {tagCount && (
                    <p> {`${tagCount}  ${tagCount > 1 ? "links" : "link"}`} </p>
                  )}
                  <p className="font-xs">
                    Created: {dayjs(tag.createdAt).format("MMM DD, YYYY")}
                  </p>
                </IonLabel>
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={() => {
                    setSelectedTag(tag);
                    modal.current?.present();
                  }}
                >
                  <IonIcon slot="icon-only" icon={"thick-pencil"} />
                </IonButton>
                <IonButton
                  fill="clear"
                  color={"danger"}
                  slot="end"
                  onClick={() => {
                    presentAlert({
                      header: "Delete Tag",
                      message: "Are you sure you want to delete this tag?",
                      buttons: [
                        {
                          text: "Cancel",
                          role: "cancel",
                          handler: () => {
                            console.log("Cancel clicked");
                          },
                        },
                        {
                          text: "Delete",
                          handler: () => {
                            deleteTag(tag);
                          },
                        },
                      ],
                    });
                  }}
                >
                  <IonIcon slot="icon-only" icon={trash} />
                </IonButton>
              </IonItem>
            );
          })}
        </IonList>

        <IonModal
          ref={modal}
          trigger="open-modal"
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5, 0.75, 1]}
        >
          <TagForm
            onSuccess={() => {
              if (selectedTag) {
                setSelectedTag(undefined);
                modal.current?.dismiss();
              }
            }}
            initialValue={selectedTag}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tags;
