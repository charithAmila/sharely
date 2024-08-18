import { Fragment, useMemo, useRef, useState } from "react";
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
import { filter } from "ionicons/icons";
import { months } from "../utils/constant";
import TagsFitler from "../components/TagsFilter";

const Home = () => {
  const { items, tags } = useAppContext();

  const modal = useRef<HTMLIonModalElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchText, setSearchText] = useState("");

  const itemFilterByTags = (item: SharedItem) => {

    const selectedTagIds = selectedTags.map(tag => tag.id);
    const itemTagIds = item.tags.map(tag => tag.id);

    if (selectedTagIds.length === 0) {
      return true;
    }

    // Compare item tags with selected tags
    if (!itemTagIds.some(tagId => selectedTagIds.includes(tagId))) {
      return false;
    }

    return true
  }

  const listArray = useMemo(() => {
    if (!selectedTags || selectedTags.length === 0) {
      return items; // Return all items if no tags are selected
    }

    return items.map((item: GroupedSharedItem) => ({
      ...item,
      data: item.data.filter(itemFilterByTags).sort((a: SharedItem, b: SharedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
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
          <IonSearchbar placeholder="Search" onInput={(e) => {
            // @ts-ignore
            setSearchText(e.target.value || "")
          }} value={searchText} />
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
                      <LinkPreview tags={tags} onClickTag={onClickTag} selectedTags={selectedTags} item={_d} />
                    </div>
                  ))}
                </div>
              </div>
              {index < listArray.length - 1 && <IonItemDivider />}
            </Fragment>
          ))}
        <div className="c-modal-container">
          <IonModal
            ref={modal}
            trigger="open-modal"
            initialBreakpoint={1}
            breakpoints={[0, 1]}
          >
            <TagsFitler tags={tags} selectedTags={selectedTags} onClickTag={onClickTag} />
          </IonModal>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Home;
