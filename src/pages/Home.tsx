import { Fragment, useMemo, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonLabel,
  IonModal,
  IonPage,
  IonSearchbar,
  IonText,
  IonToolbar,
} from "@ionic/react";
import LinkPreview from "../components/LinkPreview";
import { useAppContext } from "../context/MainContext";
import { add } from "ionicons/icons";
import { getOrdinalSuffix } from "../utils/constant";
import TagsFitler from "../components/TagsFilter";
import ExpandedLogo from "../assets/svg/ExpandedLogo";

import { addIcons } from "ionicons";
import FilterSvg from "../assets/icons/filter-icon.svg";
import CardSvg from "../assets/icons/card-icon.svg";
import dayjs from "dayjs";
import LinkEdit from "../components/LinkEdit";

addIcons({
  "filter-icon": FilterSvg,
  "card-icon": CardSvg,
});

type Props = {
  isSearch?: boolean;
};

const Home = ({ isSearch }: Props) => {
  const { items, tags, sharedItems } = useAppContext();

  const modal = useRef<HTMLIonModalElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [modelType, setModelType] = useState<"tag-filter" | "edit">(
    "tag-filter"
  );
  const [selectedItem, setSelectedItem] = useState<SharedItem>();

  const itemsCount = (tagId: string) => {
    return sharedItems.filter((item: SharedItem) => item.tags.includes(tagId))
      .length;
  };

  const itemFilterByTags = (item: SharedItem) => {
    const selectedTagIds = selectedTags.map((tag) => tag.id);
    const itemTagIds = item.tags.map((tag) => tag);

    if (selectedTagIds.length === 0) {
      return true;
    }

    // Compare item tags with selected tags
    if (!itemTagIds.some((tagId) => selectedTagIds.includes(tagId))) {
      return false;
    }

    return true;
  };

  const listArray = useMemo(() => {
    if (!selectedTags || selectedTags.length === 0) {
      return items; // Return all items if no tags are selected
    }

    return items
      .map((item: GroupedSharedItem) => ({
        ...item,
        data: item.data
          .filter(itemFilterByTags)
          .sort(
            (a: SharedItem, b: SharedItem) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
      }))
      .filter((item) => item.data.length > 0);
  }, [items, selectedTags]);

  const onClickTag = (tag: Tag) => {
    setSelectedTags(
      selectedTags.map((t) => t.id).includes(tag.id)
        ? selectedTags.filter((t) => t.id !== tag.id)
        : [...selectedTags, tag]
    );
  };

  const searchByText = (e: any) => {
    e.preventDefault();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="p-3 white-header">
          <ExpandedLogo />
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setShowAddForm(false);
                setModelType("tag-filter");
                modal.current?.present();
              }}
            >
              <IonIcon icon={"filter-icon"} />
            </IonButton>
            {/* <IonButton
              onClick={() => {
                modal.current?.present();
              }}
            >
              <IonIcon icon={"card-icon"} />
            </IonButton> */}
          </IonButtons>
        </IonToolbar>
        {!!isSearch && (
          <IonToolbar className="white-header">
            <form action="" onSubmit={searchByText}>
              <IonSearchbar
                inputmode="search"
                placeholder="Search"
              ></IonSearchbar>
            </form>
          </IonToolbar>
        )}
        <IonToolbar className="white-header pl-2">
          <div className="chips-container">
            <IonChip
              onClick={() => {
                setShowAddForm(true);
                setModelType("tag-filter");
                modal.current?.present();
              }}
              outline
              color="primary"
            >
              <IonIcon icon={add} color="primary"></IonIcon>
              <IonLabel>Add New Tag</IonLabel>
            </IonChip>
            {sharedItems.length > 0 && (
              <IonChip
                onClick={() => {
                  setSelectedTags([]);
                }}
                className="gap-4"
                color={selectedTags.length === 0 ? "primary" : ""}
              >
                <IonLabel className="font-16 font-bold">All</IonLabel>
                <span
                  className="font-16 font-bold p-1"
                  style={{
                    width: "1.4rem",
                    height: "1.4rem",
                    backgroundColor: "var(--ion-color-light)",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "10px",
                    color: "var(--ion-color-primary)",
                  }}
                >
                  {sharedItems.length > 9 ? "9+" : sharedItems.length}
                </span>
              </IonChip>
            )}
            {/* <IonChip className="gap-4">
              <IonLabel>Untagged</IonLabel>
              <span
                className="font-16 font-bold p-1"
                style={{
                  width: "1.4rem",
                  height: "1.4rem",
                  backgroundColor: "var(--ion-color-light)",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "10px",
                  color: "var(--ion-color-primary)",
                }}
              >
                1
              </span>
            </IonChip> */}
            {tags
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tag: Tag) => {
                const count = itemsCount(tag.id);
                return (
                  <IonChip
                    key={tag.id}
                    className="gap-4"
                    onClick={() => onClickTag(tag)}
                    color={selectedTags.includes(tag) ? "primary" : ""}
                  >
                    <IonLabel>{tag.name}</IonLabel>
                    {count > 0 && (
                      <span
                        className="font-16 font-bold p-1"
                        style={{
                          width: "1.4rem",
                          height: "1.4rem",
                          backgroundColor: "var(--ion-color-light)",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "10px",
                          color: "var(--ion-color-primary)",
                        }}
                      >
                        {count > 9 ? "9+" : count}
                      </span>
                    )}
                  </IonChip>
                );
              })}
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="" style={{ position: "relative" }} fullscreen>
        {listArray &&
          listArray.map((item: GroupedSharedItem, index: number) => (
            <Fragment key={index}>
              <div className="flex flex-column">
                <div
                  className="flex justify-content-center pb-3 ion-padding"
                  style={{
                    marginTop: "20px",
                    borderBottom: "1px solid #ccc",
                    position: "-webkit-sticky",
                  }}
                >
                  <div className="flex flex-column w-full">
                    <IonText color="dark font-lg" style={{}}>
                      {dayjs().isSame(item.createdAt, "day")
                        ? "Today"
                        : dayjs()
                            .subtract(1, "day")
                            .isSame(item.createdAt, "day")
                        ? "Yesterday"
                        : dayjs(item.createdAt).format("MMMM, YYYY")}
                    </IonText>
                    <IonText color="dark font-2xl font-bold" className="w-full">
                      {dayjs(item.createdAt).format("DD")}
                      {getOrdinalSuffix(dayjs(item.createdAt).date())},{" "}
                      {dayjs(item.createdAt).format("dddd")}
                    </IonText>
                  </div>
                </div>
                <div className="ion-padding">
                  {item.data.map((_d: any) => (
                    <div key={_d.id} className="w-full">
                      <LinkPreview
                        tags={tags}
                        onClickTag={onClickTag}
                        selectedTags={selectedTags}
                        item={_d}
                        onClickEdit={() => {
                          setSelectedItem(_d);
                          setModelType("edit");
                          modal.current?.present();
                        }}
                      />
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
            initialBreakpoint={0.5}
            breakpoints={[0, 0.5, 0.75, 1]}
          >
            {modelType === "edit" ? (
              <>
                {selectedItem && (
                  <LinkEdit
                    closeModal={() => modal.current?.dismiss()}
                    tags={tags}
                    item={selectedItem}
                  />
                )}
              </>
            ) : (
              <TagsFitler
                showAddForm={showAddForm}
                tags={tags}
                selectedTags={selectedTags}
                onClickTag={onClickTag}
              />
            )}
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
