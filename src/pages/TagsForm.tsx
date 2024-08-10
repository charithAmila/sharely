import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { useState } from "react";
import { useAppContext } from "../context/MainContext";

const TagsForm = () => {
    const [text, setText] = useState<string>('');

    const { createTag } = useAppContext();
    const { goBack } = useIonRouter();


    const saveTag = async () => {
        await createTag(text);
        setText('');
        goBack();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons>
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Tags</IonTitle>
                    <IonButtons slot="end">
                        <IonButton disabled={!text.trim()} onClick={saveTag}>Save</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput value={text} onIonChange={(e) => setText(e.detail.value!)} label="Tag Name" placeholder="Enter Tag Name"></IonInput>
                </IonItem>
            </IonContent>
        </IonPage>
    );
};

export default TagsForm