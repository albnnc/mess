import { collections, nats } from "./deps.ts";

const nc = await nats.connect({
  servers: "localhost:4222",
});

const jsm = await nc.jetstreamManager();
const streamName = "SAMPLE";
const subjects = ["SAMPLE.A"];

try {
  const { config } = await jsm.streams.info(streamName);
  const unionSubjects = collections.union(config.subjects, subjects);
  if (config.subjects.length !== unionSubjects.length) {
    await jsm.streams.update(streamName, { subjects: unionSubjects });
  }
} catch {
  await jsm.streams.add({ name: streamName, subjects });
}

const info = await jsm.streams.info(streamName);

await nc.close();
