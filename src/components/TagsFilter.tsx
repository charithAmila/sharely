import { IonButton, IonText, IonIcon, IonItem, IonInput, useIonToast } from "@ionic/react";
import { add, checkmark, remove } from "ionicons/icons";
import { useState } from "react";
import { useAppContext } from "../context/MainContext";

type Props = {
    tags: Tag[];
    selectedTags: Tag[];
    onClickTag: (tag: Tag) => void;
}

const TagsFitler = ({ tags, selectedTags, onClickTag }: Props) => {
    const [showForm, setShowForm] = useState(false);
    const [tagName, setTagName] = useState('');
    const { createTag } = useAppContext();
    const [ present ] = useIonToast();

    const onClickDone = () => {
        if (tagName.trim().length > 0) {
            createTag(tagName);
            setTagName('');
            setShowForm(false);
            present({
                message: 'Tag created successfully',
                duration: 1500,
                position: 'top',
                color: 'success'
            })
        } else {
            present({
                message: 'Please enter tag name',
                duration: 1500,
                position: 'top',
                color: 'danger'
            })
        }
    }

    return (
        <>
            <div className="h-50vh ion-padding">
                {showForm ? (
                    <>
                        <IonItem>
                            <IonInput
                                slot="start"
                                label="Tag Name"
                                placeholder="Enter Tag Name"
                                value={tagName}
                                onIonChange={(e) => e.detail.value && setTagName(e.detail.value)}
                            />
                            <IonButton
                                shape="round"
                                disabled={tagName.trim().length === 0}
                                color={'success'}
                                slot="end"
                                onClick={() => onClickDone()}
                            >
                                <IonIcon slot="icon-only" icon={checkmark} />
                            </IonButton>
                        </IonItem>
                    </>
                ) :
                    <>
                        {tags.length > 0 ? (
                            tags.map((tag: Tag) => (
                                <IonButton
                                    key={tag.id}
                                    shape="round"
                                    size="default"
                                    fill={
                                        selectedTags.map((t) => t.id).includes(tag.id)
                                            ? "solid"
                                            : "outline"
                                    }
                                    onClick={() => onClickTag(tag)}
                                >
                                    {tag.name}
                                </IonButton>
                            ))
                        ) : (
                            <>
                                <div className="flex flex-column gap-4">
                                    <IonText>No Tags</IonText>
                                    <IonButton
                                        expand="full"
                                        shape="round"
                                        fill="outline"
                                        onClick={() => setShowForm(true)}
                                    >
                                        Add Tags
                                    </IonButton>
                                </div>

                            </>
                        )}
                    </>}
            </div>
            {!showForm ? <>
                {tags.length > 0 && <IonButton fill="clear" onClick={() => setShowForm(true)}>
                    <IonIcon icon={add}></IonIcon>
                    Add Tags
                </IonButton>
                }
            </> : <>
                <IonButton color={'danger'} fill="clear" onClick={() => setShowForm(false)} >
                    <IonText>Cancel</IonText>

                </IonButton>
            </>

            }

        </>
    )
};

export default TagsFitler