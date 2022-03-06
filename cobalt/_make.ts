#!/usr/bin/env -S deno run -A --no-check
import * as path from "https://deno.land/std@0.121.0/path/mod.ts";
import * as async from "https://deno.land/std@0.121.0/async/mod.ts";
import * as log from "https://deno.land/std@0.121.0/log/mod.ts";
import * as make from "../make/mod.ts";
import * as mod from "../mod/mod.ts";
import { buildClient } from "./server/mod.ts";

const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
const outputDir = path.join(currentDir, "build");
const clientDir = path.join(outputDir, "client");
const clientEntry = path.join(currentDir, "client/mod.ts");
const serverEntry = path.join(currentDir, "server/mod.ts");

async function buildServer() {
  log.info("Building server");
  const process = Deno.run({
    cmd: [
      "deno",
      "compile",
      "-A",
      "-o",
      path.join(outputDir, "cobalt"),
      serverEntry,
    ],
    stdout: "piped",
    stderr: "piped",
  });
  await Promise.all([process.output(), process.status()]);
}

let serverProcess: undefined | Deno.Process;
function startServer() {
  if (serverProcess) {
    // Should it be killed here? Fails on Windows though.
    serverProcess.close();
  }
  serverProcess = Deno.run({
    cmd: ["deno", "run", "-A", "--no-check", serverEntry, clientDir],
    stdout: "inherit",
    stderr: "inherit",
  });
}

make.task("build", async () => {
  await buildClient({
    dev: false,
    entry: clientEntry,
    outputDir: clientDir,
  });
  await buildServer();
});

make.task("dev", async () => {
  startServer();
  const watchServer = async () => {
    const watcher = mod.watchModule(serverEntry);
    const handle = async.debounce(() => startServer(), 300);
    for await (const event of watcher) {
      if (
        event.kind === "modify" ||
        event.kind === "create" ||
        event.kind === "remove"
      ) {
        handle();
      }
    }
  };
  await Promise.all([watchServer()]);
});

await make.exec(Deno.args);
