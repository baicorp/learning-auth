export type UserDatabase = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  password?: string;
};

export type SessionDatabase = {
  id: string;
  userId: string;
};
