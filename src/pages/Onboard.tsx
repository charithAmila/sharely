import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IonPage, IonContent } from "@ionic/react";
import OnboardSwiper from "../components/onboard/OnboardSwiper";
import OnBoardFirst from "../assets/svg/OnBoardFirst";
import OnBoardSecond from "../assets/svg/OnBoardSecond";
import OnBoardThird from "../assets/svg/OnBoardThrid";
import OnBoardFourth from "../assets/svg/OnBoardFourth";

import "swiper/scss";
import "@ionic/react/css/ionic-swiper.css";

type Props = {
  onBoardDone: () => void;
};
export default function OnBoard({ onBoardDone }: Props) {
  const swiperRef = useRef<any>(null); // Ref to store swiper instance

  const slides = [
    {
      img: <OnBoardFirst />,
      buttonLabel: "Get Started",
      onClickButton: () => {
        swiperRef.current?.slideNext();
      },
      title: (
        <>
          Welcome to <br></br> Sharely!
        </>
      ),
      description:
        "Keep all your shared links in one place, organized and easy to find.",
    },
    {
      img: <OnBoardSecond />,
      buttonLabel: "Got it",
      onClickButton: () => {
        swiperRef.current?.slideNext();
      },
      title: (
        <>
          How to <br></br> Share Links
        </>
      ),
      description: (
        <ol
          style={
            {
              // marginTop: 0,
              // marginBottom: 0,
              // marginLeft: 0,
              // paddingLeft: 25,
              // paddingRight: 15,
              // fontSize: 15,
            }
          }
        >
          <li>Open any app (like a browser or social media).</li>
          <li>Find a link you want to save.</li>
          <li>Tap 'Share' and choose Sharely.</li>
        </ol>
      ),
    },
    {
      img: <OnBoardThird />,
      buttonLabel: "Next",
      onClickButton: () => {
        swiperRef.current?.slideNext();
      },
      title: (
        <>
          Organize and <br></br>Access Easily
        </>
      ),
      description:
        "Add notes, use tags, and quickly find your saved links whenever you need them.",
    },
    {
      img: <OnBoardFourth />,
      buttonLabel: "Start Using Sharely",
      onClickButton: () => {
        onBoardDone();
      },
      title: (
        <>
          You're <br></br>Ready to Go!
        </>
      ),
      description:
        "Start sharing your favourite links and keep them organized!",
    },
  ];

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <Swiper
          onSwiper={(swiperInstance) => {
            swiperRef.current = swiperInstance; // Set the swiper instance
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index.toString()}>
              <div className="flex h-100vh w-full">
                <OnboardSwiper {...slide} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </IonContent>
    </IonPage>
  );
}
