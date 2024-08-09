import { Redirect, Route } from "react-router";
import { useAuthContext } from "./context/AuthContext";
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, IonLoading, IonPage } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { triangle, ellipse, square, home, pulse, add, addCircle, person } from "ionicons/icons";
import Tab1 from "./pages/Home";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Profile";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";


const PrivateRoute = ({ children, ...rest }: any) => {
    const { authenticated } = useAuthContext();
  
    if (!authenticated) return <Redirect to="/login" />;
  
    return <Route {...rest} render={() => children} />;
  };
  
  const PublicRoute = ({ children, ...rest }: any) => {
    const { authenticated } = useAuthContext();
  
    if (authenticated) return <Redirect to="/" />;
  
    return <Route {...rest} render={() => children} />;
  };

  const AppRoutes = () => {
    const { authenticated, user } = useAuthContext();
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
            <IonTabs>
                <IonRouterOutlet>
                    <Route exact path="/" render={() => <Redirect to="/home" />} />
                    <PrivateRoute exact path="/home">
                        <Route exact path="/home" component={Home} />
                    </PrivateRoute>
                    <PrivateRoute exact path="/profile">
                        <Route exact path="/profile" component={Profile} />
                    </PrivateRoute>
                    {/* <Route exact path="/tab1">
                        <Tab1 />
                    </Route>
                    <Route exact path="/tab2">
                        <Tab2 />
                    </Route>
                    <Route path="/tab3">
                        <Tab3 />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/tab1" />
                    </Route> */}
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="tab1" href="/home">
                        <IonIcon aria-hidden="true" icon={home} />
                        <IonLabel>Home</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="tab2" href="/tab2">
                        <IonIcon aria-hidden="true" icon={addCircle} />
                        <IonLabel>Add New</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="profile" href="/profile">
                        <IonIcon aria-hidden="true" icon={person} />
                        <IonLabel>Profile</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
            <PublicRoute exact path="/login">
                <Route exact path="/login" component={Login} />
            </PublicRoute>
            <PublicRoute exact path="/sign-up">
                <Route exact path="/sign-up" component={SignUp} />
            </PublicRoute>
        </IonReactRouter>
    );
};

export default AppRoutes