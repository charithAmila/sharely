import { createContext, useContext, useEffect, useState } from "react";
import { ItemService } from "../services/ItemServices";
import { TagService } from "../services/TagService";
import { Omit } from "react-router";
import { groupByCreatedAt } from "../helpers";
import { SettingService } from "../services/SettingService";
import { UserService } from "../services/UserService";
import { useAuthContext } from "./AuthContext";

type AppContextProviderProps = {
  children: React.ReactNode;
  user: AuthUser | null;
};
type ContextProps = {
  items: GroupedSharedItem[];
  tags: Tag[];
  linksCount: LinkCount[];
  createTag: (name: string) => Promise<void>;
  updateTag: (tag: Partial<Tag>, id: string) => Promise<void>;
  deleteTag: (tag: Tag) => Promise<void>;
  sharedItems: SharedItem[];
  updateItem: (item: Partial<SharedItem>, id: string) => Promise<void>;
  deleteItem: (item: SharedItem) => Promise<void>;
  settings: Settings | null;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<ContextProps | undefined>(undefined);

const AppContextProvider = ({ children, user }: AppContextProviderProps) => {
  const [items, setItems] = useState<GroupedSharedItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [linksCount, setLinksCount] = useState<LinkCount[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  const { deleteAuthUser } = useAuthContext();

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = () => {
      const tagService = new TagService();
      tagService.onDocumentChange(user.id, true, (data: Tag[]) => {
        setTags(data.sort((a, b) => (a.name > b.name ? 1 : -1)));
      });
    };

    return unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchSettings = async () => {
      try {
        const settingService = new SettingService();
        const res = await settingService.findByDocument("v-1");
        if (res?.exists()) {
          setSettings(res.data() as Settings);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSettings();
  }, [user]);

  // calculate links count for each tag
  useEffect(() => {
    const linkCountMap: { [tagId: string]: number } = {};

    sharedItems.forEach((item) => {
      (item.tags || []).forEach((tagId) => {
        if (linkCountMap[tagId]) {
          linkCountMap[tagId]++;
        } else {
          linkCountMap[tagId] = 1;
        }
      });
    });

    // Convert the map into an array of LinkCount objects
    setLinksCount(
      Object.keys(linkCountMap).map((tagId) => ({
        [tagId]: linkCountMap[tagId],
      }))
    );
  }, [tags, sharedItems]);

  useEffect(() => {
    if (!user || !settings) {
      return;
    }
    const unsubscribe = () => {
      const itemService = new ItemService();
      itemService.onDocumentChange(user.id, true, (data: SharedItem[]) => {
        const howToUseItem: SharedItem = {
          id: "how-to-use",
          metadata: {
            title: settings?.howToUse?.title || "How to use",
            description:
              settings?.howToUse?.description ||
              "Keep all your digital assets in one place, easily organize & archive them, and access anytime. 😊",
            image: settings?.howToUse?.image || {
              url: "https://firebasestorage.googleapis.com/v0/b/snap-link-424d4.appspot.com/o/app-items%2Fhow-to-use.svg?alt=media&token=cf690c58-f3a1-4506-9c9b-e49b69363d77",
            },
            video: settings?.howToUse?.video || {
              muted: true,
              playing: true,
              url: "https://firebasestorage.googleapis.com/v0/b/snap-link-424d4.appspot.com/o/uploads%2FF219DEB9-9952-47A6-8BA2-5BB74D56F962.mp4?alt=media&token=03bef9ab-8837-44b4-8668-4c104c2c0fd1",
            },
          },
          tags: [],
          type: "HOW_TO_USE",
          userId: user.id,
          createdAt: user.createdAt,
        };
        const items = [...data, howToUseItem];
        setSharedItems([...items]);
        setItems(groupByCreatedAt([...items]));
      });
    };
    return unsubscribe();
  }, [user, settings]);

  const isValidTag = (name: string, id: string = "") => {
    return tags
      .filter((tag) => tag.id !== id)
      .some(
        (tag) => tag.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
  };

  const createTag = async (name: string) => {
    try {
      if (!user) {
        return;
      }

      if (isValidTag(name)) {
        throw new Error("Tag already exists");
      }

      const tag = new TagService();

      const newTag: Omit<Tag, "id"> = {
        name,
        userId: user.id,
      };

      const data = await tag.create(newTag);

      data.id && setTags([{ ...newTag, id: data.id }, ...tags]);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const updateTag = async (tag: Partial<Tag>, id: string) => {
    try {
      if (!user) {
        return;
      }

      if (tag.name && isValidTag(tag.name, id)) {
        throw new Error("Tag already exists");
      }

      const tagService = new TagService();
      await tagService.update({ ...tag, id });

      const index = tags.findIndex((i) => i.id === id);
      if (index !== -1) {
        tags[index] = { ...tags[index], ...tag };
        setTags([...tags]);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const deleteTag = async (tag: Tag) => {
    if (!user) {
      return;
    }

    const tagService = new TagService();
    await tagService.delete(tag.id);

    const index = tags.findIndex((i) => i.id === tag.id);
    if (index !== -1) {
      tags.splice(index, 1);
      setTags([...tags]);
    }
  };

  const updateItem = async (item: Partial<SharedItem>, id: string) => {
    const _item = sharedItems.find((i) => i.id === id);

    const itemService = new ItemService();
    await itemService.update({ ...item, id });

    const index = sharedItems.findIndex((i) => i.id === id);
    if (index !== -1 && _item) {
      sharedItems[index] = _item;
      setSharedItems([...sharedItems]);
    }
  };

  const deleteItem = async (item: SharedItem) => {
    const itemService = new ItemService();
    await itemService.delete(item.id);

    const index = sharedItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      sharedItems.splice(index, 1);
      setSharedItems([...sharedItems]);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      await deleteAuthUser();
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const values: ContextProps = {
    items,
    tags,
    linksCount,
    createTag,
    updateTag,
    deleteTag,
    sharedItems,
    updateItem,
    settings,
    deleteItem,
    deleteAccount,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

export { AppContextProvider, useAppContext };
