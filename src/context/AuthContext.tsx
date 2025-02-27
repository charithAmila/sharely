import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  OAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../firebase";
import { UserService } from "../services/UserService";
import Echo from "../plugins/Echo";
import { Capacitor } from "@capacitor/core";
import { getAuth, updatePassword, UserCredential } from "firebase/auth";

type AuthContextProviderProps = {
  children: React.ReactNode;
};

type ContextProps = {
  authenticated: boolean | null;
  user: AuthUser | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<AuthUser>;
  signup: ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  appleSignIn: (token: string) => Promise<AuthUser>;
  updateUser: (user: Partial<AuthUser>) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  activeTab: "home" | "profile" | "search";
  setActiveTab: (tab: "home" | "profile" | "search") => void;
};

const AuthContext = createContext<ContextProps | undefined>(undefined);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "profile" | "search">(
    "home"
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const authUser: AuthUser = {
          id: user.uid,
          email: user.email ?? "",
          name: user.displayName ?? "",
          isOnBoarded: false,
          createdAt: user.metadata.creationTime ?? "",
        };

        const userService = new UserService();

        const fetchUser = async () => {
          try {
            const userDoc = await userService.findByDocument(user.uid);
            if (userDoc) {
              setUser({
                ...authUser,
                ...(userDoc.exists() ? userDoc.data() : {}),
                id: user.uid,
              });
              setAuthenticated(true);

              if (Capacitor.getPlatform() === "ios") {
                const savedUserId = await Echo.readFromKeyChain({ key: "uid" });

                if (savedUserId.value !== user.uid) {
                  Echo.saveToKeyChain({ key: "uid", value: user.uid });
                }
              }
            } else {
              setUser(null);

              setAuthenticated(false);

              if (Capacitor.getPlatform() === "ios") {
                Echo.deleteFromKeyChain({ key: "uid" });
              }
            }
          } catch (error) {
            setUser(null);
            setAuthenticated(false);
            throw new Error("Error fetching user");
          }
        };
        fetchUser();
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthUser> => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      const authUser: AuthUser = {
        id: user.user.uid,
        email: user.user.email ?? "",
        name: user.user.displayName ?? "",
        isOnBoarded: false,
        createdAt: user.user.metadata.creationTime ?? "",
      };
      return Promise.resolve(authUser);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const appleSignIn = async (idToken: string): Promise<AuthUser> => {
    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({ idToken });
    const user: UserCredential = await signInWithCredential(auth, credential);

    const authUser: AuthUser = {
      id: user.user.uid,
      name: user.user.displayName ?? "",
      email: user.user.email ?? "",
      isOnBoarded: false,
      createdAt: user.user.metadata.creationTime ?? "",
    };

    const userService = new UserService();

    await userService.setDoc(authUser.id, authUser);

    return Promise.resolve(authUser);
  };

  const signup = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthUser> => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      const authUser: AuthUser = {
        id: user.user.uid,
        name: name,
        email: user.user.email ?? "",
        isOnBoarded: false,
        createdAt: user.user.metadata.creationTime ?? "",
      };

      const userService = new UserService();

      await userService.setDoc(authUser.id, authUser);

      await login({ email, password });

      return Promise.resolve(authUser);
    } catch (error) {
      throw new Error("Error signing up");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      throw new Error("Error logging out");
    }
  };

  const updateUser = async (data: Partial<AuthUser>) => {
    try {
      if (!user) {
        return;
      }
      const userService = new UserService();
      await userService.update({ ...data, id: user?.id });
      setUser({ ...user, ...data });
    } catch (error) {}
  };

  const resetPassword = async (newPassword: string) => {
    try {
      const auth = getAuth();

      const user = auth.currentUser;

      if (!user) {
        console.log("No user logged in");
        throw new Error("No user logged in");
      }

      await updatePassword(user, newPassword);
      console.log("Password reset successfully");
    } catch (error) {
      throw new Error("Error resetting password");
    }
  };

  const value: ContextProps = {
    authenticated,
    user,
    login,
    signup,
    logout,
    appleSignIn,
    updateUser,
    resetPassword,
    activeTab,
    setActiveTab,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};

export { AuthContext, AuthContextProvider, useAuthContext };
