import { Application } from "./deps.ts";

const port = parseInt(Deno.env.get("PORT") || "") || 1234;
const app = new Application();

app.use((ctx) => {
  ctx.response.body = "TODO";
});

await app.listen({ port });
