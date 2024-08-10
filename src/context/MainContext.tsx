import { createContext, useContext, useEffect, useState } from "react";
import { ItemService } from "../services/ItemServices";
import { TagService } from "../services/TagService";

type AppContextProviderProps = {
    children: React.ReactNode;
    user: AuthUser | null;
};
type ContextProps = {
    items : any[]
    tags: {id: string, name: string}[]
    createTag: (name: string) => Promise<void>;
  };

const AuthContext = createContext<ContextProps | undefined>(undefined);

const AppContextProvider = ({ children, user }: AppContextProviderProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [tags, setTags] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    if(!user) {
      return;
    }


    const fetchTags = async () => {
      try {
        const tag = new TagService(user.id);
        const data = await tag.all();
        setTags(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTags();
  }, [user]);

  const groupByCreatedAt=(array: any[]): any[] => {
    const groupedMap: { [key: string]: any[] } = {};
    
    array.forEach(item => {      
      if(!item.createdAt) {
        item.createdAt = new Date();
      }

      if (!groupedMap[new Date(item.createdAt).toLocaleDateString()]) {
        groupedMap[new Date(item.createdAt).toLocaleDateString()] = [];
      }
      groupedMap[`${new Date(item.createdAt).toLocaleDateString()}`].push({ ...item });
    });
  
    return Object.keys(groupedMap).map(createdAt => ({
      createdAt,
      data: groupedMap[createdAt],
    }));
  }

  useEffect(() => {
    if(!user) {
      return;
    }
    const unsubscribe = () => {
      const itemService = new ItemService();
      itemService.onDocumentChange(user.id, (data: any) => {  
         setItems(groupByCreatedAt([...data]));
      })
     }
    return unsubscribe();
  }, [user]);

  

  const createTag = async (name: string) => {

    if(!user) {
      return;
    }

    const tag = new TagService(user.id);
    const data = await tag.create({ name });

    data.id && setTags([...tags, {
      id: data.id,
      name
    }]);

  }

  const values: ContextProps = {
    items,
    tags,
    createTag
  };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

export { AppContextProvider, useAppContext };
