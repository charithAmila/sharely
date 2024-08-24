import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonText,
  IonBackButton,
  IonItem,
  IonInput,
  useIonToast,
  IonLabel,
  IonModal,
  IonList,
  IonBadge,
} from "@ionic/react";
import { useState } from "react";
import { useAppContext } from "../context/MainContext";
import TagList from "../components/TagList";
import { chevronForwardOutline } from "ionicons/icons";
import GroupMembers from "../components/GroupMembers";
import { useAuthContext } from "../context/AuthContext";

export default function GroupForm() {
  const [name, setName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [modalType, setModalType] = useState<"members" | "tags">("tags");

  const { createGroup } = useAppContext();
  const { user } = useAuthContext();
  const [present] = useIonToast();

  const onSubmit = async () => {
    try {
      if (!name) {
        return;
      }

      const members: Member[] = selectedMembers.map((m) => {
        return {
          id: m.id,
          type: 'contributor',
          name: m.name ?? '',
          email: m.email ?? '',
          photo: m.photo ?? '',
        };
      })
      if(user) {
        members.push({
          id: user.id,
          type: 'author',
          name: user.name ?? '',
          email: user.email ?? '',
          photo: user.photo ?? '',
        })
      }
      

      await createGroup({
        name: name,
        tags: selectedTags,
        members,
      });
      setName("");
      present({ message: "Group Created", duration: 2000, color: "success" });
    } catch (error) {
      present({
        message: "Error creating group",
        duration: 2000,
        color: "danger",
      });
    }
  };

  const onClickTag = (tag: Tag) => {
    setSelectedTags(
      selectedTags.map((t) => t.id).includes(tag.id)
        ? selectedTags.filter((t) => t.id !== tag.id)
        : [...selectedTags, tag]
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Create New Group</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onSubmit}>
              <IonText>Save</IonText>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonInput
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              label="Group Name"
              placeholder="Enter Name"
            />
          </IonItem>
          <IonItem
            onClick={() => {
              setModalType("tags");
              setIsOpen(true);
            }}
          >
            <IonLabel>Add or Remove Tags</IonLabel>
            <IonBadge slot="end">
              <div className="flex align-items-center">
                {selectedTags.length
                  ? `${selectedTags.length} Tag${
                      selectedTags.length > 1 ? "s" : ""
                    }`
                  : "Select"}{" "}
                <IonIcon icon={chevronForwardOutline} />
              </div>
            </IonBadge>
          </IonItem>
          <IonItem
            onClick={() => {
              setModalType("members");
              setIsOpen(true);
            }}
          >
            <IonLabel>Add or Remove Group Members</IonLabel>
            <IonBadge slot="end">
              <div className="flex align-items-center">
                {selectedMembers.length
                  ? `${selectedMembers.length} Member${
                      selectedMembers.length > 1 ? "s" : ""
                    }`
                  : "Select"}{" "}
                <IonIcon icon={chevronForwardOutline} />
              </div>
            </IonBadge>
          </IonItem>
        </IonList>
      </IonContent>
      <IonModal isOpen={isOpen}>
        {modalType === "tags" ? (
          <>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setSelectedTags([])}>
                    Clear
                  </IonButton>
                </IonButtons>
                <IonTitle>Add Tags</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>Done</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <TagList onClickTag={onClickTag} selectedTags={selectedTags} />
            </IonContent>
          </>
        ) : (
          <GroupMembers
            setSelectedMembers={setSelectedMembers}
            selectedMembers={selectedMembers}
            closeModal={() => setIsOpen(false)}
          />
        )}
      </IonModal>
    </IonPage>
  );
}
