import { async, nats } from "./deps.ts";

export interface MessageRecorderOptions {
  connection: nats.NatsConnection;
  subject?: string;
  count?: number;
  deadline?: number;
}

export interface MessageRecorder {
  messages: nats.Msg[];
  stopped: Promise<void>;
  stop: () => void;
  clear: () => void;
}

export function createMessageRecorder({
  connection,
  subject = ">",
  count,
  deadline,
}: MessageRecorderOptions): MessageRecorder {
  const messages: nats.Msg[] = [];
  const subscription = connection.subscribe(subject);
  const stopped = async.deferred<void>();
  const clear = () => {
    messages.splice(0, messages.length);
  };
  const stop = (e?: Error) => {
    subscription.unsubscribe();
    if (e) {
      stopped.reject(e);
    } else {
      stopped.resolve();
    }
  };
  const handleMessages = async () => {
    for await (const message of subscription) {
      messages.push(message);
      if (count && messages.length >= count) {
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
  handleMessages();
  handleDealine();
  return {
    messages,
    stopped,
    stop,
    clear,
  };
}
