import { useState } from "react";
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonPage, IonTitle, IonToolbar, useIonRouter, useIonToast } from "@ionic/react";
import { useAppContext } from "../context/MainContext";
import { arrowBackCircleOutline } from "ionicons/icons";

const TagsForm = () => {
    const [text, setText] = useState<string>('');

    const { createTag } = useAppContext();
    const [ present ] = useIonToast();
    const { goBack, canGoBack } = useIonRouter();


    const saveTag = async () => {
        try {
            await createTag(text);
            setText('');
            present({
                message: 'Tag created successfully',
                duration: 1500,
                position: 'top',
                color: 'success'
            })
        } catch (error) {
            present({
                message: 'Error creating tag',
                duration: 1500,
                position: 'top',
                color: 'danger'
            })
        }
        
    }

    console.log('+++ canGoBack', canGoBack());
    console.log('+++ canGoBack', canGoBack);
    
    

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton></IonBackButton>
                </IonButtons>
                    <IonTitle>Tags</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="flex flex-column">
                    <div className="">
                        <IonItem>
                            <IonInput value={text} onIonChange={(e) => setText(e.detail.value!)} label="Tag Name" placeholder="Enter Tag Name"></IonInput>
                        </IonItem>
                    </div>
                    <div className="pt-50">
                        <IonButton expand="block" disabled={text.trim().length === 0} onClick={saveTag}>Save</IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default TagsForm