type AuthUser = {
  id: string;
  name: string;
  email: string;
  photo?: string;
  phone?: string;
  friends?: AuthUserFriend[];
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
  metadata?: any;
  note?: string;
  imageURL?: string;
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
