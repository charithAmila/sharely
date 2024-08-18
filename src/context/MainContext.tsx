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
    sharedItems: SharedItem[];
    updateItem: (item: Partial<SharedItem>, id: string) => Promise<void>;
    deleteItem: (item: SharedItem) => Promise<void>;
  };

const AuthContext = createContext<ContextProps | undefined>(undefined);

const AppContextProvider = ({ children, user }: AppContextProviderProps) => {
  const [items, setItems] = useState<GroupedSharedItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);

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
        setSharedItems([...data]);
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

  const updateItem = async (item: Partial<SharedItem>, id: string) => {

    const _item = sharedItems.find((i) => i.id === id);

    const itemService = new ItemService();
    await itemService.update({...item, id});

    const index = sharedItems.findIndex((i) => i.id === id);
    if (index !== -1 && _item) {
      sharedItems[index] = _item;
      setSharedItems([...sharedItems]);
    }

  }

  const deleteItem = async (item: SharedItem) => {
    const itemService = new ItemService();
    await itemService.delete(item.id);

    const index = sharedItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      sharedItems.splice(index, 1);
      setSharedItems([...sharedItems]);
    }
  }

  const values: ContextProps = {
    items,
    tags,
    createTag,
    sharedItems,
    updateItem,
    deleteItem
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
