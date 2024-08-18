import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonTextarea } from "@ionic/react"
import TagList from "./TagList";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/MainContext";

type Props = {
    setIsOpen: (isOpen: boolean) => void;
    title: string;
    selectedTags: Tag[];
    id: string;
}

export default function TagSelector({ title, setIsOpen, ...rest }: Props) {

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const { updateItem } = useAppContext()

    useEffect(() => {
       setSelectedTags(rest.selectedTags) 
    },[ rest.selectedTags ])

    const onClickTag = (tag: Tag) => {
        setSelectedTags(
          selectedTags.map((t) => t.id).includes(tag.id)
            ? selectedTags.filter((t) => t.id !== tag.id)
            : [...selectedTags, tag]
        )
      };

    const onClickSave = async () => {
        await updateItem({ tags: selectedTags }, rest.id)
        setIsOpen(false)
    }

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                    </IonButtons>
                    <IonTitle>{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => onClickSave()}>Save</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <TagList onClickTag={onClickTag} selectedTags={selectedTags} />
            </IonContent>
        </>
    )
}