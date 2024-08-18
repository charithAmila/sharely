import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";

type Props = {
    onClickSave: () => void;
    setIsOpen: (isOpen: boolean) => void;
    note: string;
    setNote: (note: string) => void;
}
export default function NoteForm({ onClickSave, setIsOpen, note, setNote }: Props) {
    return (
        <>
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
                <IonTextarea value={note} onIonInput={(e) => setNote(e.detail.value!)} autoGrow label="Note" labelPlacement="stacked" placeholder="Write a note"></IonTextarea>
            </IonContent>
        </>
    )
}