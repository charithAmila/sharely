import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonModal,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import LinkPreview from "../components/LinkPreview";
import { useAppContext } from "../context/MainContext";
import { add, filter } from "ionicons/icons";
import { Fragment, useMemo, useRef, useState } from "react";
import { months } from "../utils/constant";

const Home = () => {
  const { items, tags } = useAppContext();

  const modal = useRef<HTMLIonModalElement>(null);

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const listArray = useMemo(() => {
    if (!selectedTags || selectedTags.length === 0) {
      return items; // Return all items if no tags are selected
    }
  
    const selectedTagNames = selectedTags.map(tag => tag.name);
  
    return items.map(item => ({
      ...item,
      data: item.data.filter((dataItem: any) =>
        (dataItem.tags || []).some((tag: any) => selectedTagNames.includes(tag))
      ).sort((a: SharedItem, b: SharedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    })).filter(item => item.data.length > 0);
  
  }, [items, selectedTags]);

  const onClickTag = (tag: Tag) => {
    setSelectedTags(
      selectedTags.map((t) => t.id).includes(tag.id)
        ? selectedTags.filter((t) => t.id !== tag.id)
        : [...selectedTags, tag]
    )
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Collection</IonTitle>
          <IonButtons slot="end">
            <IonButton id="open-modal">
              <IonIcon slot="icon-only" icon={filter}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false} scrollY={true} fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Collection</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="">
          <IonSearchbar />
        </div>
        {listArray &&
          listArray.map((item, index) => (
            <Fragment key={index}>
              <div className="flex">
                <div
                  className="w-2 flex justify-content-center"
                  style={{ marginTop: "20px" }}
                >
                  <div
                    className="flex flex-column"
                    style={{
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <IonText color="primary font-24 font-bold">
                      {new Date(item.createdAt).getDate()}
                    </IonText>
                    <IonText color="primary font-12 font-bold">
                      {months[new Date(item.createdAt).getMonth()]}
                    </IonText>
                  </div>
                </div>
                <div className="w-10">
                  {item.data.map((_d: any) => (
                    <div key={_d.id} className="w-full">
                       <LinkPreview selectedTags={selectedTags} item={_d} />
                    </div>
                  ))}
                </div>
              </div>
              { index < listArray.length - 1 && <IonItemDivider />}
            </Fragment>
          ))}
        <IonModal
          ref={modal}
          trigger="open-modal"
          initialBreakpoint={1}
          breakpoints={[0, 1]}
        >
          <div className="h-50vh ion-padding">
            {tags.length > 0 ? (
              tags.map((tag: { id: string; name: string }) => (
                <IonButton
                  key={tag.id}
                  shape="round"
                  fill={
                    selectedTags.map((t) => t.id).includes(tag.id)
                      ? "solid"
                      : "outline"
                  }
                  onClick={() => onClickTag(tag)}
                >
                  {tag.name}
                </IonButton>
              ))
            ) : (
              <>
                <div className="flex flex-column gap-4">
                <IonText>No Tags</IonText>
                  <IonButton
                    expand="full"
                    shape="round"
                    fill="outline"
                    routerLink="/add-tags"
                  >
                    Add Tags
                  </IonButton>
                </div>
               
              </>
            )}
          </div>
          { tags.length > 0 && <IonButton fill="clear" routerLink="/add-tags">
            <IonIcon icon={add}></IonIcon>
            Add Tags
          </IonButton>}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
