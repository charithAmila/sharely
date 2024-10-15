import { createContext, useContext, useEffect, useState } from "react";
import { ItemService } from "../services/ItemServices";
import { TagService } from "../services/TagService";
import { Omit } from "react-router";
import { GroupService } from "../services/GroupService";
import { UserService } from "../services/UserService";
import { groupByCreatedAt } from "../helpers";

type AppContextProviderProps = {
  children: React.ReactNode;
  user: AuthUser | null;
};
type ContextProps = {
  items: GroupedSharedItem[];
  tags: Tag[];
  createTag: (name: string) => Promise<void>;
  sharedItems: SharedItem[];
  updateItem: (item: Partial<SharedItem>, id: string) => Promise<void>;
  deleteItem: (item: SharedItem) => Promise<void>;
  groups: Group[];
  createGroup: (
    data: Omit<Group, "id" | "createdAt" | "updatedAt" | "userId">
  ) => Promise<void>;
  updateGroup: (group: Partial<Group>, id: string) => Promise<void>;
  deleteGroup: (group: Group) => Promise<void>;
  friends: Member[];
  getFriends: () => Promise<void>;
};

const AuthContext = createContext<ContextProps | undefined>(undefined);

const AppContextProvider = ({ children, user }: AppContextProviderProps) => {
  const [items, setItems] = useState<GroupedSharedItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Member[]>([]);

  useEffect(() => {
    if (!user) {
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
    };

    const fetchGroups = async () => {
      try {
        const group = new GroupService();
        const data = await group.findByField("userId", user.id);
        setGroups(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
    fetchTags();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = () => {
      const itemService = new ItemService();
      itemService.onDocumentChange(user.id, (data: SharedItem[]) => {
        setSharedItems([...data]);
        setItems(groupByCreatedAt([...data]));
      });
    };
    return unsubscribe();
  }, [user]);

  const createTag = async (name: string) => {
    if (!user) {
      return;
    }

    const tag = new TagService();

    const newTag: Omit<Tag, "id"> = {
      name,
      userId: user.id,
    };

    const data = await tag.create(newTag);

    data.id && setTags([{ ...newTag, id: data.id }, ...tags]);
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

  const createGroup = async (
    data: Omit<Group, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    if (!user) {
      return;
    }

    const group = new GroupService();

    const newGroup: Omit<Group, "id"> = {
      name: data.name,
      userId: user.id,
      members: data.members || [],
      tags: data.tags || [],
    };

    const groupData = await group.create(newGroup);

    if (groupData.id) {
      setGroups([
        {
          id: groupData.id,
          ...newGroup,
        },
        ...groups,
      ]);
    }
  };

  const updateGroup = async (group: Partial<Group>, id: string) => {
    const _group = groups.find((i) => i.id === id);
    const groupService = new GroupService();
    await groupService.update({ ...group, id });
    const index = groups.findIndex((i) => i.id === id);
    if (index !== -1 && _group) {
      groups[index] = _group;
      setGroups([...groups]);
    }
  };

  const deleteGroup = async (group: Group) => {
    const groupService = new GroupService();
    await groupService.delete(group.id);
    const index = groups.findIndex((i) => i.id === group.id);
    if (index !== -1) {
      groups.splice(index, 1);
      setGroups([...groups]);
    }
  };

  const getFriends = async () => {
    if (!user || !user.friends) {
      return;
    }

    const friendsIds: string[] = user.friends.map((f) => f.id);

    const userService = new UserService();

    const data: AuthUser[] = await userService.findByFieldsArrayIn(
      "id",
      friendsIds
    );

    const _friends: Member[] = data.map((d) => {
      return {
        id: d.id,
        name: d.name,
        email: d.email,
      };
    });

    setFriends(_friends);
  };

  const values: ContextProps = {
    items,
    tags,
    createTag,
    sharedItems,
    updateItem,
    deleteItem,
    groups,
    createGroup,
    updateGroup,
    deleteGroup,
    friends,
    getFriends,
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
