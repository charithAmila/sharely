type AuthUser = {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
};

type ShareUser = {
    id: string;
    name: string;
    type: "author" | "contributor";
}

type Tag = {
    id: string;
    name: string;
    userId: string;
    sharedWith?: ShareUser[];
    createdAt?: string;
    updatedAt?: string;
};

type SharedItem = {
    id: string;
    createdAt: string;
    updatedAt?: string;
    url?: string;
    content?: string;
    tags: {id: string, name: string}[];
    userId: string;
}

type GroupedSharedItem = {
  createdAt: string;
  data: SharedItem[];
}