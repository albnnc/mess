import { mongo, nats } from "../deps.ts";

export interface OpOptions {
  nc: nats.NatsConnection;
  db: mongo.Database;
}
