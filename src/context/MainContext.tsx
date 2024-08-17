import { createContext, useContext, useEffect, useState } from "react";
import { ItemService } from "../services/ItemServices";
import { TagService } from "../services/TagService";

type AppContextProviderProps = {
    children: React.ReactNode;
    user: AuthUser | null;
};
type ContextProps = {
    items : GroupedSharedItem[]
    tags: Tag[]
    createTag: (name: string) => Promise<void>;
  };

const AuthContext = createContext<ContextProps | undefined>(undefined);

const AppContextProvider = ({ children, user }: AppContextProviderProps) => {
  const [items, setItems] = useState<GroupedSharedItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if(!user) {
      return;
    }


    const fetchTags = async () => {
      try {
        const tag = new TagService();
        const data = await tag.findByField("userId", user.id);
        setTags(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTags();
  }, [user]);

  const groupByCreatedAt=(array: SharedItem[]): GroupedSharedItem[] => {
    const groupedMap: { [key: string]: SharedItem[] } = {};
    
    array.forEach((item : SharedItem) => {      
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
      itemService.onDocumentChange(user.id, (data: SharedItem[]) => {  
         setItems(groupByCreatedAt([...data]));
      })
     }
    return unsubscribe();
  }, [user]);

  

  const createTag = async (name: string) => {

    if(!user) {
      return;
    }

    const tag = new TagService();

    const newTag: Omit<Tag, "id"> = {
      name,
      userId: user.id,
      sharedWith: [
        {
          id: user.id,
          name: user.name,
          type: "author"
        }
      ]
    }

    const data = await tag.create(newTag);

    data.id && setTags([{...newTag, id: data.id},...tags]);

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
