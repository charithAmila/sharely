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
import { ContactPayload, Contacts, GetContactsResult, NamePayload } from '@capacitor-community/contacts';
import { useEffect, useState } from "react";


type Props = {
  closeModal: () => void;
  selectedMembers: Member[];
  setSelectedMembers: (members: Member[]) => void;
};
export default function GroupMembers({ closeModal, selectedMembers, setSelectedMembers }: Props) {
  const { friends } = useAppContext();
  const [phoneContacts, setPhoneContacts] = useState<ContactPayload[]>([]);

  useEffect(() => {
    const getContacts = async () => {
      const projection = {
        // Specify which fields should be retrieved.
        name: true,
        phones: true,
        postalAddresses: true,
      };
    
      const result: GetContactsResult = await Contacts.getContacts({
        projection,
      });

      const _contacts: ContactPayload[] = result.contacts

      setPhoneContacts(result.contacts);
    };
    getContacts();
  }, [])

  const makeNameFromContact = (contact: NamePayload | undefined) => {
    if (!contact) {
      return '';
    }
    let name: string = '';

    if(contact.prefix) {
      name += `${contact.prefix} `;
    }
    if(contact.display) {
      name += `${contact.display} `;
    }
    if(contact.middle) {
      name += `${contact.middle} `;
    }
    if(contact.family) {
      name += `${contact.family} `;
    }

    return name;
  }

  const makeEmailsFromContact = (contact: ContactPayload | undefined): string => {
    if (!contact) {
      return '';
    }
    return contact.emails?.map((email) => email.address).join(', ') ?? '';
  }

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
            <IonListHeader>
              <IonLabel>My Phone Contacts</IonLabel>
            </IonListHeader>
            {phoneContacts.map((contact: ContactPayload, index) => (
              <IonItem key={index}>
                <IonAvatar slot="start">
                  <img alt="Silhouette of a person's head" src={contact.image?.base64String ? contact.image?.base64String : "https://ionicframework.com/docs/img/demos/avatar.svg"} />
                </IonAvatar>
                <IonLabel>{contact.name ? makeNameFromContact(contact.name) : ""}
                  <p>{contact.phones?.[0]?.number}</p>
                  <p>{makeEmailsFromContact(contact)}</p>
                </IonLabel>
                <IonCheckbox
                  // checked={!!selectedMembers.find((member) => member.id === contact.id)}
                  // onClick={() => setSelectedMembers( selectedMembers.includes(contact) ? selectedMembers.filter((member) => member.id !== contact.id) : [...selectedMembers, contact])}
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

