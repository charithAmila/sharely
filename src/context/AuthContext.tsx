import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { createContext, useContext, useEffect, useState } from "react";
  import { auth } from "../firebase";
  import { UserService } from "../services/UserService";
  
  type AuthContextProviderProps = {
    children: React.ReactNode;
  };
  
  type ContextProps = {
    authenticated: boolean | null;
    user: AuthUser | null;
    login: ({ email, password }: { email: string; password: string }) => Promise<AuthUser>;
    signup: ({ name, email, password }: { name: string; email: string; password: string }) => Promise<AuthUser>;
    logout: () => Promise<void>;
  };
  
  const AuthContext = createContext<ContextProps | undefined>(undefined);
  
  const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
  
    useEffect(() => {
      
      const unsubscribe = auth.onAuthStateChanged((user) => {
        
        if (user) {
          const authUser: AuthUser = {
            id: user.uid,
            email: user.email ?? "",
            name: user.displayName ?? "",
          };
  
          const userService = new UserService();
  
          const fetchUser = async () => {
            try {
              const userDoc = await userService.findByDocument(user.uid);
              if (userDoc) {
                setUser({
                  ...authUser,
                  ...(userDoc.exists() ? userDoc.data() : {}),
                });
                setAuthenticated(true);
              }else {
                setUser(null);
                setAuthenticated(false);
              }
            } catch (error) {
              setUser(null);
              setAuthenticated(false);
              throw new Error("Error fetching user");
            }
          }
          fetchUser();
        } else {
          setUser(null);
          setAuthenticated(false);
        }
  
      });
  
      return () => unsubscribe();
    }, []);
    const login = async ({ email, password }: { email: string; password: string }): Promise<AuthUser> => {
      try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        const authUser: AuthUser = {
          id: user.user.uid,
          email: user.user.email ?? "",
          name: user.user.displayName ?? "",
        };
        return Promise.resolve(authUser);
      } catch (error) {
        return Promise.reject(error);
      }
    };
  
    const signup = async ({ name, email, password }: { name: string; email: string; password: string }): Promise<AuthUser> => {
      try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        const authUser: AuthUser = {
          id: user.user.uid,
          name: name,
          email: user.user.email ?? "",
        };
  
        const userService = new UserService();
  
        await userService.setDoc(authUser.id, authUser);
  
        await login({ email, password });
  
        return Promise.resolve(authUser);
      } catch (error) {
        console.log('+++ error 2', error);
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
  
    const value = {
      authenticated,
      user,
      login,
      signup,
      logout,
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