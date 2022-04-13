import { collections, nats } from "../deps.ts";

export interface EnsureStreamOptions {
  nc: nats.NatsConnection;
  name: string;
  subjects: string[];
}

export async function ensureStream({
  nc,
  name,
  subjects,
}: EnsureStreamOptions) {
  const jsm = await nc.jetstreamManager();
  try {
    const { config } = await jsm.streams.info(name);
    const unionSubjects = collections.union(config.subjects, subjects);
    if (config.subjects.length !== unionSubjects.length) {
      await jsm.streams.update(name, { subjects: unionSubjects });
    }
  } catch {
    await jsm.streams.add({ name, subjects });
  }
}
