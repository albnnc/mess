import { useMemo, useMemoFn, useState } from "../deps.ts";
import { flatPromise } from "./flat_promise.ts";

export type MergeFn = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  key?: string
) => Record<string, unknown>;

export function useMergeQueue<T extends Record<never, never>>(
  initialValue: T
  // fn?: MergeFn
) {
  const [head, setHead] = useState<T>(initialValue);
  const lockRef = useMemo<{
    current: undefined | Promise<void>;
  }>(() => ({ current: undefined }), []);
  const queue = useMemoFn((maybePromise: T | Promise<T>) => {
    const { current } = lockRef;
    let replacement: Promise<void>;
    const lock = async () => {
      await current;
      const value = await flatPromise(maybePromise);
      // setHead(merge(clone(head), value, fn));
      setHead((prior) => ({ ...prior, value }));
      if (lockRef.current === replacement) {
        lockRef.current = undefined;
      }
    };
    lockRef.current = replacement = lock();
  }, []);
  const wait = useMemoFn(async () => {
    await lockRef.current;
  }, []);
  return [head, queue, wait] as const;
}
