type AuthUser = {
  id: string;
  name: string;
  email: string;
  photo?: string;
  phone?: string;
  isOnBoarded: boolean;
  userType?: "FREE" | "PRO";
  maxTagCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type AuthUserFriend = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

type Member = {
  id: string;
  name: string;
  email?: string;
  photo?: string;
  phone?: string;
  type?: "author" | "contributor";
};

type Tag = {
  id: string;
  name: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

type SharedItem = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  url?: string;
  content?: string;
  tags: string[];
  userId: string;
  metadata?: {
    title?: string;
    description?: string;
    publisher?: string;
    author?: string;
    [key: string]: any;
  };
  note?: string;
  fileURL?: string;
  contentType?: "url" | "text" | "image" | "video" | "pdf";
};

type GroupedSharedItem = {
  createdAt: string;
  data: SharedItem[];
};

type LinkCount = {
  [key: string]: number;
};

type Group = {
  id: string;
  name: string;
  userId: string;
  members?: Member[];
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
};

type Settings = {
  id: string;
  maxTagCount: number;
};
