import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip } from '@ionic/react';
import React, { useEffect, useState } from 'react';

interface Metadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface LinkPreviewProps {
  item: any;
  selectedTags: {id: string, name: string}[];
}

const LinkPreview = ({ item, selectedTags }: LinkPreviewProps) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(item.url)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMetadata({
          title: data.data.title,
          description: data.data.description,
          image: data.data.image?.url,
          url: data.data.url
        });
      } catch (error) {
        setError('Failed to fetch metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [item.url]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  }

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {metadata && (
        <>
          <IonCard>
          {metadata.image && <img src={metadata.image} alt="Preview" />}
            <IonCardHeader>
              <IonCardSubtitle>{metadata.title}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              { truncateText(metadata.description, 100) }
              <div className='flex gap-2 justify-content-start pt-10 flex-wrap'>
                {(item.tags || []).map((tag: string) => <IonChip color={ selectedTags.find(t => t.name === tag) ? "warning" : "primary"}>{tag}</IonChip>)}
              </div>
              <a href={metadata.url} target="_blank" rel="noopener noreferrer">Visit Site</a> 
            </IonCardContent>
          </IonCard>
        </>
      )}
    </>
  );
};

export default LinkPreview;
