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
import { searchOutline } from "ionicons/icons";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { AppContextProvider } from "./context/MainContext";
import Tags from "./pages/Tags";
import ItemDetail from "./pages/ItemDetail";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import GroupForm from "./pages/GroupForm";
import OnBoard from "./pages/Onboard";
import Search from "./pages/Search";
import Subscription from "./pages/Subscription";
import ExpandedLogoWhite from "./assets/svg/ExpandedLogoWhite";
import { addIcons } from "ionicons";
import TabHomeActive from "./assets/icons/tab-home-active.svg";
import TabTag from "./assets/icons/tab-tag.svg";
import TabTagActive from "./assets/icons/tab-tag-active.svg";
import TabProfile from "./assets/icons/tab-profile.svg";
import TabHome from "./assets/icons/tab-home.svg";
import TabProfileActive from "./assets/icons/tab-profile-active.svg";
import HowToUseDetail from "./pages/HowToUseDetail";

addIcons({
  "tab-home": TabHome,
  "tab-home-active": TabHomeActive,
  "tab-profile": TabProfile,
  "tab-profile-active": TabProfileActive,
  "tab-tag": TabTag,
  "tab-tag-active": TabTagActive,
});

const AuthRoutes = () => {
  const { user, activeTab, updateUser } = useAuthContext();

  const onBoard = async () => {
    await updateUser({ isOnBoarded: true });
  };

  if (user?.isOnBoarded === false) {
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
            <Route exact path="/tabs/home" component={Search} />
            <Route exact path="/tabs/search" component={Search} />
            <Route exact path="/tabs/item/:id" component={ItemDetail} />
            <Route exact path="/tabs/how-to-use" component={HowToUseDetail} />
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
              href="/tabs/tags"
            >
              <IonIcon
                aria-hidden="true"
                icon={activeTab === "tags" ? "tab-tag-active" : "tab-tag"}
              />
            </IonTabButton>
            <IonTabButton
              className="main-search-icon"
              style={{
                "--background":
                  activeTab === "search"
                    ? "var(--ion-color-primary)"
                    : "#6f9bff",
              }}
              tab="tab2"
              href="/tabs/search"
            >
              <IonIcon aria-hidden="true" icon={"tab-home"} />
            </IonTabButton>
            <IonTabButton
              className="tab-btn tab-btn-profile"
              tab="profile"
              href="/tabs/profile"
            >
              <IonIcon
                aria-hidden="true"
                icon={
                  activeTab === "profile" ? "tab-profile-active" : "tab-profile"
                }
              />
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
        />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default AppRoutes;
