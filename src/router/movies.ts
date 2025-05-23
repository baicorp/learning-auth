import { Hono } from "hono";
import userAuth from "../middleware/auth-middleware";

const movies = new Hono();

movies.use("/*", userAuth);

movies.get("/", (c) => {
  const movies = [
    { title: "Movie 1", year: 2021 },
    { title: "Movie 2", year: 2022 },
    { title: "Movie 3", year: 2023 },
  ];
  return c.json(movies);
});

export default movies;
