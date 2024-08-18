import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCardSubtitle, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonPage, IonText, IonTextarea, IonTitle, IonToolbar, useIonAlert, useIonRouter, useIonToast } from "@ionic/react"
import { useParams } from "react-router"
import { useAppContext } from "../context/MainContext"
import { calendarClearOutline, createOutline, linkOutline, trashOutline } from "ionicons/icons"
import { useEffect, useRef, useState } from "react"

type Params = {
    id: string
}
const ItemDetail = () => {
    const { id }: Params = useParams()
    const { goBack } = useIonRouter();
    const { sharedItems, updateItem, deleteItem } = useAppContext();

    const item = sharedItems.find(item => item.id === id);
    const [isOpen, setIsOpen] = useState(false);
    const [note, setNote] = useState(item?.note || '');
    const [present] = useIonToast();
    const [presentAlert] = useIonAlert();
    const linkRef = useRef<HTMLAnchorElement>(null);


    useEffect(() => {
        setNote(item?.note || '');
    }, [item?.note])


    const title = 'Note Details';

    const menu = [
        {
            icon: createOutline,
            label: note.trim().length > 0 ? 'Update Note' : 'Write a Note',
            onClick: () => setIsOpen(true)
        },
        {
            icon: trashOutline,
            label: 'Delete',
            onClick: () => {
                presentAlert({
                    header: 'Delete Item',
                    message: 'Are you sure you want to delete this item?',
                    buttons: [
                        'Cancel',
                        {
                            text: 'Delete',
                            handler: () => {
                                if (item) {
                                    goBack();
                                    deleteItem(item);
                                    present({
                                        message: 'Item deleted successfully',
                                        duration: 1500,
                                        position: 'top',
                                        color: 'success'
                                    })
                                }
                            }
                        }
                    ]
                })
            }
        },
        {
            icon: linkOutline,
            label: 'Open',
            onClick: () => linkRef.current?.click()
        }
    ]

    const onClickSave = async () => {
        if (note.trim().length > 0) {
            await updateItem({ note }, id);
            setIsOpen(false);
            present({
                message: 'Note saved successfully',
                duration: 1500,
                position: 'top',
                color: 'success'
            })
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot="start">
                        {title}
                    </IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent scrollY={true}>
                <div className="p-10 bg-light">
                    <IonImg className="h-30vh" src={item?.metadata?.image.url} />
                </div>
                <div className="flex ion-padding flex align-items-center gap-4">
                    <a ref={linkRef} href={item?.url} target="_blank" style={{ display: 'none' }} rel="noreferrer" />
                    <div className="flex-2 flex align-items-center">
                        {item?.metadata.logo && (
                            <IonAvatar style={{ width: "35px", height: "35px" }}>
                                <img
                                    alt="Silhouette of a person's head"
                                    src={item.metadata.logo.url}
                                />
                            </IonAvatar>
                        )}
                        {item?.metadata.publisher && (
                            <IonCardSubtitle>{item?.metadata.publisher} (publisher) </IonCardSubtitle>
                        )}
                    </div>
                    <div className="flex-1 flex justify-content-end">
                        {
                            item?.createdAt && (
                                <div className="flex align-items-center gap-4">
                                    <IonIcon color="primary" icon={calendarClearOutline} />
                                    <IonText>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </IonText>
                                </div>

                            )
                        }
                    </div>
                </div>
                <div className="ion-padding flex flex-column gap-5">
                    <div>
                        <IonText className="text-sm">
                            {item?.metadata?.title}
                        </IonText>
                    </div>
                    <div>
                        {
                            item?.tags?.map((tag) => (
                                <IonChip key={tag.id}>
                                    {tag.name}
                                </IonChip>
                            ))
                        }
                    </div>
                </div>
                <IonList>
                    {menu.map((item) => (
                        <IonItem key={item.label} onClick={item.onClick || (() => { })} button>
                            <IonIcon slot="start" icon={item.icon} />
                            <IonLabel>
                                {item.label}
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
                {item?.note && <div className="ion-padding bg-light">
                    <IonText color="dark">
                        <h1>Note</h1>
                    </IonText>
                    <IonText>
                        {item?.note}
                    </IonText>
                </div>}

            </IonContent>
            <IonModal isOpen={isOpen}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                        </IonButtons>
                        <IonTitle>Write a Note</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => onClickSave()}>Save</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonTextarea value={note} onIonChange={(e) => setNote(e.detail.value!)} autoGrow label="Note" labelPlacement="stacked" placeholder="Write a note"></IonTextarea>
                </IonContent>
            </IonModal>
        </IonPage>
    )
}

export default ItemDetail