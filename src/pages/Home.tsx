import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Home: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Collection</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false} scrollY={true} fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Collection</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <img alt="Silhouette of mountains" src="https://images.ctfassets.net/0k812o62ndtw/kOozcyS9Qi9DCwrfoEWfM/40cdd85bdf0711fd2d3de3e84b32fd50/BackToGymSWEATf1f07a7f6f79e7b8807d2436a6ae8e8b.jpg" />
          <IonCardHeader>
            <IonCardTitle>How To Smash Your First Back-To-Gym Workout - Sweat</IonCardTitle>
            <IonCardSubtitle>Back-To-Gym</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Gyms are re-opening, and that means you may be considering swapping some of your at-home workouts for gym workouts. Whether you’ve been eagerly awaiting this moment for months or feeling a little daunted post-lockdown, it’s important to take your time preparing to get back into a gym routine, both physically and mentally.
            <div className='flex gap-2 justify-content-end pt-10'>
              <IonChip color="primary">Gym</IonChip>
              <IonChip color="primary">Sport</IonChip>
              <IonChip color="primary">Article</IonChip>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <img alt="Silhouette of mountains" src="https://media.geeksforgeeks.org/wp-content/uploads/20240319155102/what-is-ai-artificial-intelligence.webp" />
          <IonCardHeader>
            <IonCardTitle>
              What is Artificial Intelligence?
            </IonCardTitle>
            <IonCardSubtitle>Back-To-Gym</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
          Artificial Intelligence (AI) has become a discussed subject, in today’s fast-moving world. It has transitioned from being a concept in science fiction to a reality that impacts our daily lives. People all over the world are fascinated by AI and its ability to bring their imaginations to work in their daily lives.
            <div className='flex gap-2 justify-content-end pt-10'>
              <IonChip color="primary">AI</IonChip>
              <IonChip color="primary">Computer Science</IonChip>
              <IonChip color="primary">Article</IonChip>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
