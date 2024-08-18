import { IonButton } from "@ionic/react";
import { useAppContext } from "../context/MainContext"

type Props = {
    selectedTags: Tag[];
    onClickTag: (tag: Tag) => void;
}
export default function TagList({ selectedTags, onClickTag }: Props) {
    const { tags } = useAppContext()
    return (
        <div>
            {
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
            }
        </div>
    )
}