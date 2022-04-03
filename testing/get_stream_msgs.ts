import { nats } from "./deps.ts";

export async function getStreamMsgs(
  nc: nats.NatsConnection,
  streamName: string
) {
  const jsm = await nc.jetstreamManager();
  const {
    state: { messages: msgCount, first_seq: firstSeq, last_seq: lastSeq },
  } = await jsm.streams.info(streamName);
  if (msgCount < 1) {
    return [];
  }
  const promises = new Array(lastSeq - firstSeq + 1)
    .fill(undefined)
    .map((_, i) =>
      jsm.streams
        .getMessage(streamName, { seq: firstSeq + i })
        .catch(() => undefined)
    );
  const unfiltered = await Promise.all(promises);
  return unfiltered.filter(Boolean) as nats.StoredMsg[];
}
