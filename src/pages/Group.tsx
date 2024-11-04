import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonBackButton,
  IonAvatar,
  IonText,
  IonChip,
  IonItemDivider,
  IonLabel,
  IonIcon,
  IonButton,
  useIonActionSheet,
  IonModal,
} from "@ionic/react";
import { useAppContext } from "../context/MainContext";
import { useParams } from "react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { months } from "../utils/constant";
import { ItemService } from "../services/ItemServices";
import { groupByCreatedAt } from "../helpers";
import { add, menuOutline } from "ionicons/icons";
import GroupMembers from "../components/GroupMembers";

export default function Group() {
  const { id } = useParams<{ id: string }>();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [items, setItems] = useState<GroupedSharedItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [present] = useIonActionSheet();

  const { groups, tags } = useAppContext();
  const group = groups.find((i) => i.id === id);

  useEffect(() => {
    if (!group) {
      return;
    }

    const tagIds = (group?.tags || []).map((tag) => tag.id) || [];

    if (tagIds.length > 0) {
      const itemService = new ItemService();
      itemService.findByFieldsArrayContainsAny("tags", tagIds).then((data) => {
        const groupedItem: GroupedSharedItem[] = groupByCreatedAt(data);

        setItems([...groupedItem]);
      });
    }
  }, [group]);

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

  const onClickMoreOptions = () => {
    present({
      header: "Actions",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          handler: () => {
            alert("Sorry, not implemented yet");
          },
          data: {
            action: "delete",
          },
        },
        {
          text: "Manage Members",
          handler: () => {
            setIsOpen(true);
          },
        },
        {
          text: "Manage Tags",
          handler: () => {
            // setIsOpen(true);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{group?.name ?? "Group"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClickMoreOptions}>
              <IonIcon slot="icon-only" icon={menuOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="flex flex-column h-30vh justify-content-center align-items-center bg-light">
          <IonText>
            <h3>{group?.name}</h3>
          </IonText>
          <div className="flex gap-5">
            {(group?.members || []).length > 0 &&
              (group?.members || []).map((member, index) => (
                <IonAvatar
                  key={index}
                  className={`flex justify-content-center align-items-center ${
                    member.type === "author" ? "bg-primary" : "bg-dark"
                  }`}
                  style={{ width: "30px", height: "30px" }}
                >
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt="profile"
                      style={{ width: "25px", height: "25px" }}
                    />
                  ) : (
                    <IonLabel color="light">
                      {(!!member.name ? member.name : member.email)
                        ?.charAt(0)
                        .toUpperCase()}
                    </IonLabel>
                  )}
                </IonAvatar>
              ))}
            <IonAvatar
              className={`flex justify-content-center align-items-center bg-dark`}
              style={{ width: "30px", height: "30px" }}
            >
              <IonIcon color="light" icon={add}></IonIcon>
            </IonAvatar>
          </div>
        </div>
        <div className="ion-padding">
          {group?.tags?.map((tag, index) => (
            <IonChip
              key={index}
              color={
                selectedTags.find((t) => t.id === tag.id)
                  ? "warning"
                  : "primary"
              }
              onClick={() => onClickTag(tag)}
            >
              {tag.name}
            </IonChip>
          ))}
        </div>
        <div>
          {listArray &&
            listArray.map((item, index) => (
              <Fragment key={index}>
                <div className="flex">
                  <div
                    className="w-2 flex justify-content-center"
                    style={{ marginTop: "20px" }}
                  >
                    <div className="flex flex-column">
                      <IonText color="primary font-24 font-bold">
                        {new Date(item.createdAt).getDate()}
                      </IonText>
                      <IonText color="primary font-12 font-bold">
                        {months[new Date(item.createdAt).getMonth()]}
                      </IonText>
                    </div>
                  </div>
                  {/* <div className="w-10">
                    {item.data.map((_d: any) => (
                      <div key={_d.id} className="w-full">
                        <LinkPreview
                          tags={tags}
                          selectedTags={selectedTags}
                          item={_d}
                        />
                      </div>
                    ))}
                  </div> */}
                </div>
                {index < listArray.length - 1 && <IonItemDivider />}
              </Fragment>
            ))}
        </div>
        <IonModal isOpen={isOpen}>
          <GroupMembers
            closeModal={() => setIsOpen(false)}
            selectedMembers={group?.members || []}
            setSelectedMembers={(members) => {}}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
