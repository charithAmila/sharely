type AuthUser = {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
};

type Tag = {
    id: string;
    name: string;
};

type SharedItem = {
    id: string;
    createdAt: string;
    updatedAt?: string;
    url?: string;
    content?: string;
    tags: Tag[];
    userId: string;
}

type GroupedSharedItem = {
  createdAt: string;
  data: SharedItem[];
}