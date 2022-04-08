import { mongo, nats } from "../deps.ts";

export interface HandlerOptions {
  nc: nats.NatsConnection;
  db: mongo.Database;
}
