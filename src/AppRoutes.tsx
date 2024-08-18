import { Redirect, Route } from "react-router";
import { useAuthContext } from "./context/AuthContext";
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, IonPage } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, addCircle, person, pricetagOutline, pricetagsOutline } from "ionicons/icons";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { AppContextProvider } from "./context/MainContext";
import TagsForm from "./pages/TagsForm";
import Tags from "./pages/Tags";
import ItemDetail from "./pages/ItemDetail";

  const AuthRoutes = () => {
    const { authenticated, user } = useAuthContext();
    return (
        <AppContextProvider user={user}>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/tabs" render={() => <Redirect to="/tabs/home" />} />
                        <Route exact path="/tabs/home" component={Home} />
                        <Route exact path="/tabs/item/:id" component={ItemDetail} />
                        <Route exact path="/tabs/profile" component={Profile} />
                        <Route exact path="/tabs/tags" component={Tags} />
                        <Route exact path="/tabs/tags/tags-form" component={TagsForm} />
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="tab1" href="/tabs/home">
                            <IonIcon aria-hidden="true" icon={home} />
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="tab2" href="/tabs/tags">
                            <IonIcon aria-hidden="true" icon={pricetagsOutline} />
                            <IonLabel>Tags</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="profile" href="/tabs/profile">
                            <IonIcon aria-hidden="true" icon={person} />
                            <IonLabel>Profile</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </AppContextProvider>
    );
  }

  const AppRoutes = () => {
    const { authenticated } = useAuthContext();
    if (authenticated === null)
        return (
          <>
            <IonPage>
              <IonContent fullscreen>
                {/* Loading */}
              </IonContent>
            </IonPage>
          </>
    );

    return (
        <IonReactRouter>
            <IonRouterOutlet>
                <Route exact path="/" render={() => <Redirect to="/tabs/" />} />
                <Route exact path="/login" render={() => authenticated === true ? <Redirect to="/tabs/home" /> : <Login />} />
                <Route exact path="/sign-up" render={() => authenticated === true ? <Redirect to="/tabs/home" /> : <SignUp />} component={SignUp} />
                <Route exact path="/tabs/*" render={() => authenticated === true ?  <AuthRoutes /> : <Redirect to="/login" />}></Route>
            </IonRouterOutlet>
        </IonReactRouter>
    );
};

export default AppRoutes