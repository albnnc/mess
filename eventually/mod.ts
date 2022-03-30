import { nats } from "./deps.ts";

try {
  const nc = await nats.connect({
    servers: ["demo.nats.io:4222"],
  });
  console.log(`connected to ${nc.getServer()}`);
} catch {
  console.log("Error while connecting");
}
