export type TaskFn = () => void | Promise<void>;

const taskMap = new Map<string, TaskFn>();

export function task(name: string, fn: TaskFn) {
  taskMap.set(name, fn);
}

export async function exec(args: string[]) {
  const name = args[0];
  const fn = taskMap.get(name);
  if (!fn) {
    throw new Error("Task not found");
  }
  await fn();
}
