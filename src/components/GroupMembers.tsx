import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  addCircleOutline,
  closeCircle,
  linkOutline,
  person,
  personCircleOutline,
} from "ionicons/icons";
import { useAppContext } from "../context/MainContext";

type Props = {
  closeModal: () => void;
  selectedMembers: Member[];
  setSelectedMembers: (members: Member[]) => void;
};
export default function GroupMembers({ closeModal, selectedMembers, setSelectedMembers }: Props) {
  const { friends } = useAppContext();

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>Close</IonButton>
          </IonButtons>
          <IonTitle>Select Members</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={closeModal}>Done</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        { !!friends.length && <IonSearchbar placeholder="Search"></IonSearchbar>}
        {!!selectedMembers.length && (
          <div className="ion-padding">
            {selectedMembers.map((member) => (
              <IonChip key={member.id}>
                {member.photo ? (
                  <IonAvatar slot="start">
                    <img src={member.photo} alt={member.name} />
                  </IonAvatar>
                ) : (
                  <IonIcon icon={person}></IonIcon>
                )}
                <IonLabel>{!!member.name ? member.name : member.email}</IonLabel>
                <IonIcon onClick={() => setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id))} icon={closeCircle}></IonIcon>
              </IonChip>
            ))}
          </div>
        )}
        <div className="ion-padding">
          <IonButton fill="outline" expand="block">
            <IonIcon icon={addCircleOutline} slot="start"></IonIcon>
            <IonLabel>Add New Contact to Sharely</IonLabel>
          </IonButton>
          <br />
          <IonButton fill="outline" expand="block">
            <IonIcon icon={linkOutline} slot="start"></IonIcon>
            <IonLabel>Copy Link</IonLabel>
          </IonButton>
        </div>
        {!!friends.length && (
          <IonList>
            <IonListHeader>
              <IonLabel>Your friends on Sharely</IonLabel>
            </IonListHeader>
            {friends.map((friend) => (
              <IonItem key={friend.id}>
               { friend.photo ? <IonAvatar slot="start">
                  <img
                    alt="Silhouette of a person's head"
                    src={
                      friend.photo ??
                      "https://ionicframework.com/docs/img/demos/avatar.svg"
                    }
                  />
                </IonAvatar>
                : <IonIcon size="large" slot="start" icon={personCircleOutline}></IonIcon>
              }
                <IonLabel>{!!friend.name ? friend.name : friend.email}</IonLabel>
                <IonCheckbox 
                  checked={!!selectedMembers.find((member) => member.id === friend.id)}
                  onClick={() => setSelectedMembers( selectedMembers.includes(friend) ? selectedMembers.filter((member) => member.id !== friend.id) : [...selectedMembers, friend])} 
                  slot="end" 
                  />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </>
  );
}

