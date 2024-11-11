import { Redirect, Route } from "react-router";
import { useAuthContext } from "./context/AuthContext";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonContent,
  IonPage,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  searchOutline,
  homeOutline,
  personCircleOutline,
} from "ionicons/icons";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { AppContextProvider } from "./context/MainContext";
import Tags from "./pages/Tags";
import ItemDetail from "./pages/ItemDetail";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import GroupForm from "./pages/GroupForm";
import OnBoard from "./pages/Onboard";
import { useState } from "react";
import Search from "./pages/Search";
import Subscription from "./pages/Subscription";
import ExpandedLogoWhite from "./assets/svg/ExpandedLogoWhite";

const AuthRoutes = () => {
  const { user } = useAuthContext();

  const st: string | null = localStorage.getItem("isOnBoarded");

  const [isOnBoarded, setIsOnBoarded] = useState<string>(st ?? "NO");

  const onBoard = () => {
    localStorage.setItem("isOnBoarded", "YES");
    setIsOnBoarded("YES");
  };

  if (isOnBoarded === "NO") {
    return <OnBoard onBoardDone={onBoard} />;
  }

  return (
    <AppContextProvider user={user}>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route
              exact
              path="/tabs"
              render={() => <Redirect to="/tabs/home" />}
            />
            <Route exact path="/tabs/home" component={Home} />
            <Route exact path="/tabs/search" component={Search} />
            <Route exact path="/tabs/item/:id" component={ItemDetail} />
            <Route exact path="/tabs/profile" component={Profile} />
            <Route exact path="/tabs/tags" component={Tags} />
            <Route exact path="/tabs/groups" component={Groups} />
            <Route exact path="/tabs/groups/:id" component={Group} />
            <Route exact path="/tabs/group-form" component={GroupForm} />
            <Route exact path="/tabs/subscribe" component={Subscription} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton
              className="tab-btn tab-btn-home"
              tab="tab1"
              href="/tabs/home"
            >
              <IonIcon aria-hidden="true" icon={homeOutline} />
            </IonTabButton>
            <IonTabButton
              className="main-search-icon"
              tab="tab2"
              href="/tabs/search"
            >
              <IonIcon aria-hidden="true" icon={searchOutline} />
            </IonTabButton>
            <IonTabButton
              className="tab-btn tab-btn-profile"
              tab="profile"
              href="/tabs/profile"
            >
              <IonIcon aria-hidden="true" icon={personCircleOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </AppContextProvider>
  );
};

const AppRoutes = () => {
  const { authenticated } = useAuthContext();

  if (authenticated === null)
    return (
      <>
        <IonPage>
          <IonContent className="ion-padding bg-primary" fullscreen>
            <div className="flex align-items-center justify-content-center h-100vh">
              <ExpandedLogoWhite />
            </div>
          </IonContent>
        </IonPage>
      </>
    );

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" render={() => <Redirect to="/tabs/" />} />
        <Route
          exact
          path="/login"
          render={() =>
            authenticated === true ? <Redirect to="/tabs/home" /> : <Login />
          }
        />
        <Route
          exact
          path="/sign-up"
          render={() =>
            authenticated === true ? <Redirect to="/tabs/home" /> : <SignUp />
          }
          component={SignUp}
        />
        <Route
          exact
          path="/tabs/*"
          render={() =>
            authenticated === true ? <AuthRoutes /> : <Redirect to="/login" />
          }
        ></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default AppRoutes;
