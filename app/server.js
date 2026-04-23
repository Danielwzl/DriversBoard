import { createApp } from "./app.js";

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const { app } = createApp({ dbPath: process.env.DB_PATH });
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on http://localhost:${port}`);
    console.log(`Signup example: http://localhost:${port}/signup?ref=fb-spring-1`);
  });
}
