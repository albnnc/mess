import { async, nats } from "./deps.ts";

export interface MsgRecorderOptions {
  nc: nats.NatsConnection;
  subject?: string;
  count?: number;
  deadline?: number;
}

export interface MsgRecorder {
  msgs: nats.Msg[];
  stopped: Promise<void>;
  stop: () => void;
  clear: () => void;
}

export async function createMsgRecorder({
  nc,
  subject = ">",
  count,
  deadline,
}: MsgRecorderOptions): Promise<MsgRecorder> {
  const msgs: nats.Msg[] = [];
  const sub = await nc.subscribe(subject);
  const stopped = async.deferred<void>();
  const clear = () => {
    msgs.splice(0, msgs.length);
  };
  const stop = (e?: Error) => {
    sub.unsubscribe();
    if (e) {
      stopped.reject(e);
    } else {
      stopped.resolve();
    }
  };
  const handleMsgs = async () => {
    for await (const message of sub) {
      msgs.push(message);
      if (count && msgs.length >= count) {
        stop();
      }
    }
  };
  const handleDealine = async () => {
    if (!deadline) {
      return;
    }
    try {
      await async.deadline(stopped, deadline);
    } catch {
      stop(new Error("Message recorder deadline reached"));
    }
  };
  handleMsgs();
  handleDealine();
  return {
    msgs,
    stopped,
    stop,
    clear,
  };
}
