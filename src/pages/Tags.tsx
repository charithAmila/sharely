import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButtons, IonButton, IonIcon, IonInput, IonItemDivider, useIonToast, IonNavLink } from "@ionic/react";
import { useAppContext } from "../context/MainContext";
import { add, removeCircleOutline, trashBinOutline } from "ionicons/icons";
import { memo, useEffect, useState } from "react";

const Tags = () => {
    const {tags, createTag} = useAppContext();
    const [tagName, setTagName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [present] = useIonToast();

    useEffect(() => {
       console.log('+++ mounterd');
        
    },[])


    const onClickDone = () => {
        if(tagName.trim().length > 0){
            setTagName('');
            createTag(tagName);
        }else {
            present({
                message: 'Please enter tag name',
                duration: 1500,
                position: 'top',
                color: 'danger'
              });
        }
    }
    

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tags</IonTitle>
                    <IonButtons slot="end">
                        <IonButton routerLink="tags/tags-form">
                            <IonIcon icon={add} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tags</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonList>
                    {
                        showForm === true && (
                            <>
                                <IonItem>
                                    <IonInput label="Tag Name" placeholder="Enter Tag Name" value={tagName} onIonChange={(e) => e.detail.value && setTagName(e.detail.value)} />
                                    <IonButton 
                                        shape="round" 
                                        color={'danger'} 
                                        slot="end" 
                                        onClick={() => {
                                            setTagName('')
                                            setShowForm(false)
                                        }}
                                    >
                                        <IonIcon slot="icon-only" icon={removeCircleOutline} />
                                    </IonButton>
                                </IonItem>
                                <IonItemDivider />
                            </>
                        )
                    }
                    {tags.map(tag => <IonItem key={tag.id}>{tag.name}</IonItem>)}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Tags