import type { SessionDatabase, UserDatabase } from "../backend/type";

export let userDatabase: UserDatabase[] = [
  {
    id: crypto.randomUUID(),
    email: "bagusatoki@proton.me",
    name: "Bagus Atok Illah",
    password:
      "$argon2id$v=19$m=65536,t=2,p=1$fHb2u0MFTs3ogeECKXKEGGANjIanWwLO8qQFaD0yQ7A$7+nZ4JYHlOmGinE5Xot8rUw6N7O18lmlZH/2VVvF++c",
  },
];
export let sessionDatabase: SessionDatabase[] = [];
