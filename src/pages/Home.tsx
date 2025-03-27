import React, { Fragment, useMemo, useRef, useState } from "react";
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
import TagsFilter from "../components/TagsFilter";
import ExpandedLogo from "../assets/svg/ExpandedLogo";
import { addIcons } from "ionicons";
import FilterSvg from "../assets/icons/filter-icon.svg";
import CardSvg from "../assets/icons/card-icon.svg";
import dayjs from "dayjs";
import LinkEdit from "../components/LinkEdit";
import { useTabIcon } from "../hooks/useTabIcon";
import Fuse from "fuse.js";

addIcons({
  "filter-icon": FilterSvg,
  "card-icon": CardSvg,
});

// Type definitions (or import these from your types file)

type Props = {
  isSearch?: boolean;
  onChangeSearch?: (text: string) => void;
  searchText?: string;
};

const Home = ({ isSearch, onChangeSearch, searchText = "" }: Props) => {
  const { items, tags, sharedItems } = useAppContext();
  useTabIcon();

  const modal = useRef<HTMLIonModalElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [modelType, setModelType] = useState<"tag-filter" | "edit">(
    "tag-filter"
  );
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);

  // Helper: Count how many shared items have a given tag.
  const itemsCount = (tagId: string) => {
    return sharedItems.filter((item: SharedItem) =>
      (item.tags || []).includes(tagId)
    ).length;
  };

  // Filter each group by selected tags. If none are selected, all items pass.
  const itemFilterByTags = (item: SharedItem) => {
    const selectedTagIds = selectedTags.map((tag) => tag.id);
    if (selectedTagIds.length === 0) return true;
    return (item.tags || []).some((tagId) => selectedTagIds.includes(tagId));
  };

  // First, filter the grouped items based on selected tags.
  const filteredGroupedItems = useMemo(() => {
    return items
      .map((group: GroupedSharedItem) => ({
        ...group,
        data: group.data.filter(itemFilterByTags),
      }))
      .filter((group: GroupedSharedItem) => group.data.length > 0);
  }, [items, selectedTags]);

  // Build a tag lookup map (id -> tag name) for enriching items.
  const tagMap = useMemo(() => {
    return tags.reduce((map: Record<string, string>, tag: Tag) => {
      map[tag.id] = tag.name;
      return map;
    }, {});
  }, [tags]);

  // Flatten the filtered groups to a single array and add a "tagNames" string for Fuse.
  const flattenedItems = useMemo(() => {
    return filteredGroupedItems.flatMap((group: GroupedSharedItem) =>
      group.data.map((item: SharedItem) => ({
        ...item,
        // Ensure these fields are strings so Fuse can search them
        note: item.note || "",
        metadata: {
          ...item.metadata,
          title: item.metadata?.title || "",
          description: item.metadata?.description || "",
          publisher: item.metadata?.publisher || "",
          author: item.metadata?.author || "",
        },
        // Combine tag names into a single searchable string
        tagNames: (item.tags || [])
          .map((tagId) => tagMap[tagId] || "")
          .join(" "),
      }))
    );
  }, [filteredGroupedItems, tagMap]);

  // Configure Fuse.js: specify which keys to search and the threshold for fuzzy matching.
  const fuseOptions = {
    keys: [
      "note",
      "metadata.title",
      "metadata.description",
      "metadata.publisher",
      "metadata.author",
      "tagNames",
    ],
    threshold: 0.3,
  };

  // Memoize the Fuse instance so it only re-creates when flattenedItems change.
  const fuse = useMemo(
    () => new Fuse(flattenedItems, fuseOptions),
    [flattenedItems]
  );

  // If a search text exists, use Fuse to get matching items; otherwise, use all items.
  const searchResults = useMemo(() => {
    if (!searchText.trim()) {
      return flattenedItems;
    }
    return fuse.search(searchText).map((result) => result.item);
  }, [fuse, searchText, flattenedItems]);

  // Re-group the search results by date (grouped by YYYY-MM-DD).
  const groupedResults = useMemo(() => {
    const groups: Record<string, SharedItem[]> = {};
    searchResults.forEach((item: SharedItem) => {
      const groupKey = dayjs(item.createdAt).format("YYYY-MM-DD");
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });
    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((dateKey) => ({
        createdAt: dateKey,
        data: groups[dateKey].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      }));
  }, [searchResults]);

  // If a search is active, display the Fuse results; otherwise, show the filtered groups.
  const finalList = useMemo(() => {
    return searchText.trim() ? groupedResults : filteredGroupedItems;
  }, [searchText, groupedResults, filteredGroupedItems]);

  const onClickTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="p-3 white-header">
          <ExpandedLogo />
          {/* <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setShowAddForm(false);
                setModelType("tag-filter");
                modal.current?.present();
              }}
            >
              <IonIcon icon={"filter-icon"} />
            </IonButton>
          </IonButtons> */}
        </IonToolbar>
        {isSearch && (
          <IonToolbar className="white-header">
            <form onSubmit={handleSearchSubmit}>
              <IonSearchbar
                inputmode="search"
                placeholder="Search"
                value={searchText}
                onIonInput={(e) =>
                  onChangeSearch && onChangeSearch(e.detail.value!)
                }
              />
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
              <IonIcon icon={add} color="primary" />
              <IonLabel>Add New Tag</IonLabel>
            </IonChip>
            {sharedItems.length > 0 && (
              <IonChip
                onClick={() => setSelectedTags([])}
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
            {tags
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tag: Tag) => {
                const count = itemsCount(tag.id);
                return (
                  <IonChip
                    key={tag.id}
                    className="gap-4"
                    onClick={() => onClickTag(tag)}
                    color={
                      selectedTags.find((t) => t.id === tag.id) ? "primary" : ""
                    }
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
      <IonContent fullscreen style={{ position: "relative" }}>
        {finalList.map((group: GroupedSharedItem, index: number) => {
          const createdAt = dayjs(group.data[0].createdAt);
          return (
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
                    <IonText color="dark" className="font-lg">
                      {dayjs().isSame(createdAt, "day")
                        ? "Today"
                        : dayjs().subtract(1, "day").isSame(createdAt, "day")
                        ? "Yesterday"
                        : dayjs(createdAt).format("MMMM, YYYY")}
                    </IonText>
                    <IonText color="dark" className="font-2xl font-bold w-full">
                      {dayjs(createdAt).format("DD")}
                      {getOrdinalSuffix(dayjs(createdAt).date())},{" "}
                      {dayjs(createdAt).format("dddd")}
                    </IonText>
                  </div>
                </div>
                <div className="ion-padding">
                  {group.data.map((item: SharedItem) => (
                    <div key={item.id} className="w-full">
                      <LinkPreview
                        tags={tags}
                        selectedTags={selectedTags}
                        item={item}
                        onClickEdit={() => {
                          setSelectedItem(item);
                          setModelType("edit");
                          modal.current?.present();
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {index < finalList.length - 1 && <IonItemDivider />}
            </Fragment>
          );
        })}
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
              <TagsFilter
                showAddForm={showAddForm}
                closeModal={() => modal.current?.dismiss()}
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
